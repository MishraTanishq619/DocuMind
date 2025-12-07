import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fsPromises } from 'fs'
import os from 'os'
import { randomUUID } from 'crypto'
import { connectToDatabase } from '../../../lib/mongoose'
import Chat from '../../../lib/models/Chat'
import { indexPDFToPinecone } from '../../../lib/indexers/pinecone'
import { bucket } from '../../../lib/gcs'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
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
    const fileName = `${id}${ext}`
    const gcsPath = `uploads/files/${fileName}`
    
    // Upload to GCS
    const gcsFile = bucket.file(gcsPath)
    await gcsFile.save(buffer)

    // Save to Temp for Indexing
    const tempDir = os.tmpdir()
    const tempFilePath = path.join(tempDir, fileName)
    await fsPromises.writeFile(tempFilePath, buffer)

    const size = buffer.length

    // persist to Chat if chatId provided
    if (chatId) {
      try {
        await connectToDatabase()
        await Chat.findByIdAndUpdate(chatId, {
          file: {
            id,
            filename: fileName,
            originalname,
            size,
            path: gcsPath,
            uploadedAt: new Date(),
          },
        })
      } catch (err) {
        console.error('Failed to persist file metadata to Chat in upload route:', err)
      }
    }

    // Index to Pinecone
    try {
      await indexPDFToPinecone(tempFilePath, chatId || undefined)
    } catch (err) {
      console.error('Indexing task failed:', err)
    } finally {
      // Cleanup Temp
      await fsPromises.unlink(tempFilePath).catch((err) => console.error('Failed to delete temp file', err))
    }

    return NextResponse.json({ success: true, id, filename: fileName, originalname, size, path: gcsPath, chatId }, { status: 201 })
  } catch (err) {
    console.error('upload route error', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
