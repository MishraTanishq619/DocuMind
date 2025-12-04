'use client'

import React, { useEffect, useRef, useState } from 'react'
import TypingIndicator from './TypingIndicator'

export default function ChatWindow({ messages, onSend, document, loading, indexing }: { messages: Array<{ role: 'user'|'assistant'; text: string }>; onSend: (text: string) => void; document?: { name: string; url?: string; size?: number } | null; loading?: boolean; indexing?: boolean }) {
  const [text, setText] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const firstRenderRef = useRef(true)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  // Scroll behavior: scroll to bottom after messages change.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Use requestAnimationFrame to ensure DOM updated before measuring
    const raf = requestAnimationFrame(() => {
      // Prefer the inner scroll node (we mark it with data-chat-scroll)
      const scrollNode = el.querySelector('[data-chat-scroll]') as HTMLElement | null
      const target = scrollNode || el
      if (!target) return
      target.scrollTo({ top: target.scrollHeight, behavior: 'smooth' })
      firstRenderRef.current = false
    })

    return () => cancelAnimationFrame(raf)
  }, [messages, loading])

  // focus input when document present
  // useEffect(() => {
  //   if (document) {
  //     setTimeout(() => inputRef.current?.focus(), 50)
  //   }
  // }, [document])

  const isEmpty = !messages || messages.length === 0

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className={`mb-4 flex-1 relative rounded-lg p-0 transition-all ${isEmpty ? 'flex items-center justify-center' : ''}`}>
        {isEmpty ? (
          <div className="mx-auto max-w-xl text-center text-zinc-600 p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">D</div>
            <h3 className="mb-2 text-xl font-semibold">Ask your first question about the document</h3>
            <p className="text-sm">You uploaded a document — type a question below to get answers grounded in its content.</p>
          </div>
        ) : (
          <div data-chat-scroll className="absolute inset-0 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] rounded-2xl px-5 py-3 shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-zinc-800 border'} `}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</div>
                </div>
              </div>
            ))}
            {loading ? (
              <div className="flex">
                <div className="max-w-[82%] rounded-2xl px-4 py-3">
                  <TypingIndicator />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <form onSubmit={submit} className="sticky bottom-0 mt-2 flex items-center gap-3 rounded-t-md border-t bg-white p-4">
        <input
          ref={inputRef}
          className="flex-1 rounded-lg border border-zinc-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-zinc-100"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={indexing ? 'Indexing document...' : document ? 'Ask a question about the document...' : 'Select or upload a document to ask questions'}
          aria-label="Message"
          disabled={!document || indexing || loading}
        />
        <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50" aria-label="Send message" disabled={!document || indexing || loading}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2l-7 20  -4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" opacity="0.2" />
          </svg>
          Send
        </button>
      </form>
    </div>
  )
}
