import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

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
    const uploadsDir = path.join(process.cwd(), 'uploads', 'files')
    const filePath = path.join(uploadsDir, filename)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const file = await fs.promises.readFile(filePath)
    const ext = path.extname(filename).toLowerCase()
    const contentType = ext === '.pdf' ? 'application/pdf' : 'application/octet-stream'

    return new NextResponse(file, {
      status: 200,
      headers: { 'Content-Type': contentType, 'Content-Length': String(file.length) },
    })
  } catch (err) {
    console.error('files route error', err)
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
