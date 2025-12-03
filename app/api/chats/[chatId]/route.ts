import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongoose'
import Chat from '../../../../lib/models/Chat'

export const runtime = 'nodejs'

export async function GET(req: Request, context: any) {
  try {
    const params = await context.params
    const { chatId } = params || {}
    if (!chatId) return NextResponse.json({ error: 'Missing chatId' }, { status: 400 })

    await connectToDatabase()
    const chat = await Chat.findById(chatId).lean()
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 })

    const out = {
      id: String(chat._id),
      title: chat.title || 'Untitled Chat',
      createdAt: chat.createdAt || null,
      file: chat.file || null,
      messages: (chat.messages || []).map((m: any) => ({ role: m.role, text: m.text, createdAt: m.createdAt })),
    }

    return NextResponse.json(out)
  } catch (err: any) {
    console.error('Failed to get chat', err)
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
