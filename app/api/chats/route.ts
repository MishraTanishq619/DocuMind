import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongoose'
import Chat from '../../../lib/models/Chat'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const title = body?.title?.trim() || 'Untitled Chat'
    await connectToDatabase()
    const chat = await Chat.create({ title })
    return NextResponse.json({ id: String(chat._id), title: chat.title, file: chat.file ?? null }, { status: 201 })
  } catch (err: any) {
    console.error('Failed to create chat', err)
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    const chats = await Chat.find().sort({ createdAt: -1 }).lean()
    const out = chats.map((c: any) => ({ id: String(c._id), title: c.title || 'Untitled Chat', createdAt: c.createdAt || null, file: c.file || null }))
    return NextResponse.json(out)
  } catch (err: any) {
    console.error('Failed to list chats', err)
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
