import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongoose'
import Chat from '../../../../lib/models/Chat'
import { Pinecone } from '@pinecone-database/pinecone'
import { promises as fsPromises } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(req: Request, context: any) {
  try {
    const params = await context.params
    const { chatId } = params || {}
    if (!chatId) return NextResponse.json({ error: 'Missing chatId' }, { status: 400 })

    await connectToDatabase()
    const chat = await Chat.findById(chatId)
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

export async function DELETE(req: Request, context: any) {
  try {
    const params = await context.params
    const { chatId } = params || {}
    if (!chatId) return NextResponse.json({ error: 'Missing chatId' }, { status: 400 })

    await connectToDatabase()
    const chat = await Chat.findById(chatId)
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 })

    // If chat has a file, delete it from /uploads/files
    if (chat.file && chat.file.filename) {
      try {
        const filePath = path.join(process.cwd(), 'uploads', 'files', chat.file.filename)
        await fsPromises.unlink(filePath)
      } catch (err) {
        console.error('Failed to delete file from disk', err)
      }
    }

    // Delete from Pinecone namespace if file was indexed
    if (chat.file && chat.file.filename) {
      try {
        const pinecone = new Pinecone()
        const indexName = process.env.PINECONE_INDEX_NAME || 'default'
        const index = pinecone.Index(indexName)
        // Delete all vectors in the namespace corresponding to this chat
        await index.namespace(String(chatId)).deleteAll()
      } catch (err) {
        console.error('Failed to delete Pinecone namespace', err)
      }
    }

    // Delete chat from database
    await Chat.findByIdAndDelete(chatId)

    return NextResponse.json({ success: true, message: 'Chat deleted successfully' })
  } catch (err: any) {
    console.error('Failed to delete chat', err)
    return NextResponse.json({ error: err?.message || 'Failed to delete chat' }, { status: 500 })
  }
}
