'use client'

import React, { useCallback, useRef, useState } from 'react'

export default function DragDropUploader({ onUploaded, onSaved, chatId }: { onUploaded?: (meta: { name: string; size?: number; url?: string }) => void; onSaved?: (resp: any) => void; chatId?: string | null }) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]

    setUploading(true)
    // create object URL for viewer
    const url = URL.createObjectURL(file)

    // POST to the App Router upload route which saves the file with formidable
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (chatId) fd.append('chatId', chatId)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      })

      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      onUploaded?.({ name: data.originalname ?? file.name, size: data.size ?? file.size, url })
      // notify caller of server response (includes chatId, filename, id)
      onSaved?.(data)
    } catch (err) {
      // if server upload fails, still provide client-side preview
      onUploaded?.({ name: file.name, size: file.size, url })
    } finally {
      setUploading(false)
    }
  }, [onUploaded, chatId, onSaved])

  const onDrop: React.DragEventHandler = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver: React.DragEventHandler = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const onDragLeave: React.DragEventHandler = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`mx-auto flex h-80 w-full max-w-2xl items-center justify-center rounded-lg border-2 border-dashed p-6 ${dragOver ? 'border-blue-400 bg-blue-50/40' : 'border-zinc-200 bg-white'}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center">
            <svg className="mb-4 h-10 w-10 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium text-zinc-600">Uploading document...</p>
          </div>
        ) : (
          <div className="text-center">
            <svg className="mx-auto mb-4 h-12 w-12 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="7 10 12 5 17 10" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="5" x2="12" y2="18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h4 className="mb-2 text-lg font-semibold text-zinc-700">Upload a document to get started</h4>
            <p className="mb-4 text-sm text-zinc-500">Drag and drop a file here, or click to browse</p>
            <div className="flex justify-center">
              <button
                type="button"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                onClick={() => inputRef.current?.click()}
                aria-label="Select file"
              >
                Select File
              </button>
            </div>
            <input ref={inputRef} type="file" accept="application/pdf" className="sr-only" onChange={(e) => handleFiles(e.target.files)} aria-hidden />
          </div>
        )}
      </div>
    </div>
  )
}
