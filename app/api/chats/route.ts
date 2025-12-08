import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongoose'
import Chat from '../../../lib/models/Chat'
import getUserFromRequest from '../../../lib/auth'
import User from '../../../lib/models/User'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const title = body?.title?.trim() || 'Untitled Chat'

    // Ensure user is authenticated and associate chat to user
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectToDatabase()
    const chat = await Chat.create({ title })

    // record chat id on the user document
    try {
      await User.findByIdAndUpdate(user._id, { $push: { chats: chat._id } })
    } catch (err) {
      console.error('Failed to associate chat with user:', err)
    }

    return NextResponse.json({ id: String(chat._id), title: chat.title, file: chat.file ?? null }, { status: 201 })
  } catch (err: any) {
    console.error('Failed to create chat', err)
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // Only return chats for the authenticated user
    // Note: we need a Request to extract cookies; Next's App Route GET here doesn't provide it by default
    // so we rely on the global `Request` via the route handler signature. If your call-site strips cookies,
    // ensure client includes credentials when calling.
    // (The runtime will pass the incoming Request when called by the framework.)
    // Extract user from the incoming request
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    await connectToDatabase()
    const chats = (user.chats && user.chats.length > 0) ? await Chat.find({ _id: { $in: user.chats } }).sort({ createdAt: -1 }).lean() : []
    const out = chats.map((c: any) => ({ id: String(c._id), title: c.title || 'Untitled Chat', createdAt: c.createdAt || null, file: c.file || null }))
    return NextResponse.json(out)
  } catch (err: any) {
    console.error('Failed to list chats', err)
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
