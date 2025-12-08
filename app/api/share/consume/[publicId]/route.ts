import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../../lib/mongoose'
import SharedChat from '../../../../../lib/models/SharedChat'
import Chat from '../../../../../lib/models/Chat'
import User from '../../../../../lib/models/User'
import getUserFromRequest from '../../../../../lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request, context: any) {
  try {
    const params = await context.params
    const { publicId } = params || {}
    if (!publicId) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectToDatabase()
    const shared = await SharedChat.findOne({ publicId })
    if (!shared) return NextResponse.json({ error: 'Shared chat not found' }, { status: 404 })

    // If the authenticated user already has the original chat (likely the owner), return it
    try {
      const originalId = shared.originalChatId
      if (originalId && user.chats && Array.isArray(user.chats) && user.chats.find((c: any) => String(c) === String(originalId))) {
        return NextResponse.json({ success: true, id: String(originalId) }, { status: 200 })
      }
    } catch (err) {
      // ignore and continue
    }

    // If this user already consumed this share, return the existing chat id
    if (shared.consumers && Array.isArray(shared.consumers)) {
      const existing = shared.consumers.find((c: any) => String(c.userId) === String(user._id))
      if (existing && existing.chatId) {
        // ensure the user's chats array contains it
        try {
          await User.updateOne({ _id: user._id, chats: { $ne: existing.chatId } }, { $push: { chats: existing.chatId } })
        } catch (err) {
          console.error('Failed to ensure existing chat is associated with user:', err)
        }
        return NextResponse.json({ success: true, id: String(existing.chatId) }, { status: 200 })
      }
    }

    // Create a copy of the chat for this user
    const newChat = await Chat.create({ title: shared.snapshot.title, messages: shared.snapshot.messages, file: shared.snapshot.file })

    // Try to record the consumer atomically: only push if a consumer for this user doesn't already exist
    const updateResult = await SharedChat.updateOne(
      { publicId, 'consumers.userId': { $ne: user._id } },
      { $push: { consumers: { userId: user._id, chatId: newChat._id, createdAt: new Date() } } }
    )

    if (updateResult.modifiedCount && updateResult.modifiedCount > 0) {
      // Successfully recorded consumer; associate chat with user (avoid duplicates)
      try {
        await User.updateOne({ _id: user._id, chats: { $ne: newChat._id } }, { $push: { chats: newChat._id } })
      } catch (err) {
        console.error('Failed to associate shared chat with user:', err)
      }

      return NextResponse.json({ success: true, id: String(newChat._id) }, { status: 201 })
    }

    // If we reach here, another request likely added the consumer concurrently.
    // Find the existing consumer entry and return that chat id; clean up the newly created chat.
    const updatedShared = await SharedChat.findOne({ publicId, 'consumers.userId': user._id }, { 'consumers.$': 1 })
    const existingConsumer = updatedShared?.consumers && updatedShared.consumers[0]
    if (existingConsumer && existingConsumer.chatId) {
      // remove the chat we created to avoid duplicates
      try {
        await Chat.findByIdAndDelete(newChat._id)
      } catch (err) {
        console.error('Failed to delete duplicate chat', err)
      }
      // ensure user has the chat associated
      try {
        await User.updateOne({ _id: user._id, chats: { $ne: existingConsumer.chatId } }, { $push: { chats: existingConsumer.chatId } })
      } catch (err) {
        console.error('Failed to ensure existing chat is associated with user:', err)
      }
      return NextResponse.json({ success: true, id: String(existingConsumer.chatId) }, { status: 200 })
    }

    // Fallback: return the newly created chat id
    try {
      await User.updateOne({ _id: user._id, chats: { $ne: newChat._id } }, { $push: { chats: newChat._id } })
    } catch (err) {
      console.error('Failed to associate shared chat with user (fallback):', err)
    }

    return NextResponse.json({ success: true, id: String(newChat._id) }, { status: 201 })
  } catch (err: any) {
    console.error('Failed to consume shared chat', err)
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
