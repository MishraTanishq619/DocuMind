import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fsPromises } from 'fs'
import fs from 'fs'
import { randomUUID } from 'crypto'
import { connectToDatabase } from '../../../lib/mongoose'
import Chat from '../../../lib/models/Chat'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'files')
    await fsPromises.mkdir(uploadsDir, { recursive: true })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const chatId = (formData.get('chatId') as string) || null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const originalname = (file as any).name || (file as any).filename || 'file'
    const ext = path.extname(originalname || '') || ''
    const id = randomUUID()
    const destName = `${id}${ext}`
    const dest = path.join(uploadsDir, destName)

    await fsPromises.writeFile(dest, buffer)
    const size = buffer.length
    const relativePath = path.relative(process.cwd(), dest)

    // persist to Chat if chatId provided
    if (chatId) {
      try {
        await connectToDatabase()
        await Chat.findByIdAndUpdate(chatId, {
          file: {
            id,
            filename: destName,
            originalname,
            size,
            path: relativePath,
            uploadedAt: new Date(),
          },
        })
      } catch (err) {
        console.error('Failed to persist file metadata to Chat in upload route:', err)
      }
    }

    return NextResponse.json({ success: true, id, filename: destName, originalname, size, path: relativePath, chatId }, { status: 201 })
  } catch (err) {
    console.error('upload route error', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
