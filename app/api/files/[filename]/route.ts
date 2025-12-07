import { NextResponse } from 'next/server'
import path from 'path'
import { bucket } from '../../../../lib/gcs'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> | { filename: string } }) {
  try {
    const resolvedParams = (await params) as { filename?: string }
    const filenameRaw = resolvedParams?.filename
    if (!filenameRaw) {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 })
    }

    // sanitize filename to prevent path traversal
    const filename = path.basename(filenameRaw)
    const gcsPath = `uploads/files/${filename}`
    const file = bucket.file(gcsPath)
    const [exists] = await file.exists()

    if (!exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const [fileBuffer] = await file.download()
    const ext = path.extname(filename).toLowerCase()
    const contentType = ext === '.pdf' ? 'application/pdf' : 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: { 'Content-Type': contentType, 'Content-Length': String(fileBuffer.length) },
    })
  } catch (err) {
    console.error('files route error', err)
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
