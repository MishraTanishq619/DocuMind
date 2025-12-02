'use client'

import React from 'react'

export default function DocumentViewer({ document }: { document: { name: string; url?: string; size?: number } | null }) {
  if (!document) {
    return (
      <div className="flex h-[72vh] flex-col items-center justify-center text-zinc-400">
        <svg className="mb-4 h-12 w-12 text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="text-sm font-medium">No document uploaded</div>
        <div className="text-xs text-zinc-400">Upload a document to view it here</div>
      </div>
    )
  }

  // If we have an object URL, embed PDF via <iframe>
  if (document.url) {
    return (
      <div className="h-[72vh] w-full">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium">{document.name}</div>
          <div className="text-xs text-zinc-500">{document.size ? `${Math.round((document.size/1024)/10)/100} MB` : ''}</div>
        </div>
        <iframe src={document.url} className="h-[68vh] w-full rounded border" title={document.name} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-2 text-sm font-medium">{document.name}</div>
      <div className="text-sm text-zinc-600">Size: {document.size ?? '—'}</div>
    </div>
  )
}
