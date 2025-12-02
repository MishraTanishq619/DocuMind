'use server'

import fs from 'fs'
import path from 'path'
import { promises as fsPromises } from 'fs'
import { connectToDatabase } from '../../lib/mongoose'
import Chat from '../../lib/models/Chat'

/**
 * Server action to upload a single file from client `FormData`.
 *
 * Usage (client):
 *   const fd = new FormData()
 *   fd.append('file', file)
 *   const result = await uploadFile(fd)
 */
export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File | null
  const chatId = (formData.get('chatId') as string) || null
  if (!file) throw new Error('No file provided')

  const uploadsDir = path.join(process.cwd(), 'uploads', 'files')
  await fsPromises.mkdir(uploadsDir, { recursive: true })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const safeName = `${Date.now()}-${file.name}`
  const dest = path.join(uploadsDir, safeName)

  await fsPromises.writeFile(dest, buffer)

  // If a chatId was provided, persist file metadata to the Chat document
  if (chatId) {
    try {
      await connectToDatabase()
      await Chat.findByIdAndUpdate(chatId, {
        file: {
          filename: safeName,
          originalname: file.name,
          size: buffer.length,
          path: path.relative(process.cwd(), dest),
          uploadedAt: new Date(),
        },
      })
    } catch (err) {
      // Log but don't fail the upload if DB write fails
      console.error('Failed to persist file metadata to Chat:', err)
    }
  }

  return {
    success: true,
    filename: safeName,
    originalname: file.name,
    size: buffer.length,
    path: path.relative(process.cwd(), dest),
  }
}

/**
 * Server action to upload multiple files. Pass multiple `file` entries in FormData
 * with the same field name `file` or enumerated names like `file[0]`.
 */
export async function uploadFiles(formData: FormData) {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'files')
  await fsPromises.mkdir(uploadsDir, { recursive: true })

  const entries: Array<{ filename: string; originalname: string; size: number; path: string }> = []

  // FormData.getAll isn't strongly typed here but exists on the platform FormData
  // We iterate keys and collect File values.
  for (const key of Array.from(formData.keys())) {
    const value = formData.getAll(key)
    for (const v of value) {
      if (v instanceof File) {
        const arrayBuffer = await v.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const safeName = `${Date.now()}-${v.name}`
        const dest = path.join(uploadsDir, safeName)
        await fsPromises.writeFile(dest, buffer)
        entries.push({ filename: safeName, originalname: v.name, size: buffer.length, path: path.relative(process.cwd(), dest) })
      }
    }
  }

  return { success: true, files: entries }
}

/**
 * Server-side actions for document ingestion and querying.
 *
 * These are lightweight stubs to be expanded with your project's
 * ingestion/persistence/embedding logic (MongoDB Vector Search, LangChain, etc.).
 */

export async function uploadDocument(formData: FormData) {
  const file = formData.get('file') as File | null
  if (!file) throw new Error('No file provided')

  // Read bytes of the uploaded file on the server side
  const buffer = await file.arrayBuffer()

  // TODO: replace this stub with PDF parsing, chunking, and embedding logic.
  // For example: parse with pdfjs, chunk text, call embedding service, upsert vectors.

  return {
    name: file.name,
    size: buffer.byteLength,
    message: 'Received file on server action (stub) - implement processing logic',
  }
}

export async function queryDocument(prompt: string) {
  // This stub calls your internal API route that should perform a vector search
  // and optionally call an LLM. Create `/api/documents/query` to handle it.
  const res = await fetch('/api/documents/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Query failed')
  }

  return res.json()
}
