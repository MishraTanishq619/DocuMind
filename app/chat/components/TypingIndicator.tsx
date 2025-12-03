"use client"

import React from 'react'

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-2xl bg-white text-zinc-800 border px-3 py-2 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-zinc-500" />
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-zinc-500 delay-75" />
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-zinc-500 delay-150" />
        </div>
      </div>
      <div className="text-sm text-zinc-500">Assistant is typing…</div>
    </div>
  )
}
