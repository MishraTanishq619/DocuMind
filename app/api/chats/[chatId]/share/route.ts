import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../../lib/mongoose'
import Chat from '../../../../../lib/models/Chat'
import SharedChat from '../../../../../lib/models/SharedChat'
import getUserFromRequest from '../../../../../lib/auth'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST(req: Request, context: any) {
  try {
    const params = await context.params
    const { chatId } = params || {}
    if (!chatId) return NextResponse.json({ error: 'Missing chatId' }, { status: 400 })

    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectToDatabase()
    const chat = await Chat.findById(chatId)
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 })

    // Create a snapshot of the chat for sharing
    const publicId = randomUUID()
    const snapshot = {
      title: chat.title || 'Shared Chat',
      messages: chat.messages || [],
      file: chat.file || null,
    }

    const shared = await SharedChat.create({ publicId, originalChatId: chat._id, snapshot })

    // Return share URL (frontend will interpret this relative path)
    const sharePath = `/share/${shared.publicId}`
    return NextResponse.json({ success: true, url: sharePath }, { status: 201 })
  } catch (err: any) {
    console.error('Failed to create share', err)
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
