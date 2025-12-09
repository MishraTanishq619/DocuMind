'use client'

import React from 'react'

export default function MarkdownMessage({ content }: { content: string }) {
  // Simple markdown parser for common patterns
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let inList = false
    let listItems: React.ReactNode[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(<ul key={`list-${elements.length}`} className="list-disc pl-6 my-2 space-y-1">{listItems}</ul>)
        listItems = []
      }
      inList = false
    }

    lines.forEach((line, idx) => {
      const key = `line-${idx}`
      
      // Headings
      if (line.startsWith('### ')) {
        flushList()
        elements.push(<h3 key={key} className="text-lg font-semibold mt-3 mb-2">{line.slice(4)}</h3>)
      } else if (line.startsWith('## ')) {
        flushList()
        elements.push(<h2 key={key} className="text-xl font-semibold mt-4 mb-2">{line.slice(3)}</h2>)
      } else if (line.startsWith('# ')) {
        flushList()
        elements.push(<h1 key={key} className="text-2xl font-bold mt-4 mb-3">{line.slice(2)}</h1>)
      }
      // List items (handle both * and - prefixes)
      else if (line.match(/^\s*[\*\-]\s+/)) {
        inList = true
        const content = line.replace(/^\s*[\*\-]\s+/, '')
        listItems.push(<li key={key} className="leading-relaxed">{parseInline(content)}</li>)
      }
      // Code blocks (simple inline code)
      else if (line.trim().startsWith('```')) {
        flushList()
        // Skip code fence markers for now (could be enhanced)
      }
      // Empty line
      else if (line.trim() === '') {
        flushList()
        if (elements.length > 0) {
          elements.push(<div key={key} className="h-2" />)
        }
      }
      // Regular paragraph
      else {
        flushList()
        if (line.trim()) {
          elements.push(<p key={key} className="leading-relaxed my-1">{parseInline(line)}</p>)
        }
      }
    })

    flushList()
    return elements
  }

  // Parse inline markdown (bold, italic, code)
  const parseInline = (text: string) => {
    const parts: React.ReactNode[] = []
    let remaining = text
    let partKey = 0

    while (remaining.length > 0) {
      // Bold (**text**)
      const boldMatch = remaining.match(/^\*\*(.+?)\*\*/)
      if (boldMatch) {
        parts.push(<strong key={partKey++}>{boldMatch[1]}</strong>)
        remaining = remaining.slice(boldMatch[0].length)
        continue
      }

      // Italic (*text*)
      const italicMatch = remaining.match(/^\*(.+?)\*/)
      if (italicMatch) {
        parts.push(<em key={partKey++}>{italicMatch[1]}</em>)
        remaining = remaining.slice(italicMatch[0].length)
        continue
      }

      // Inline code (`code`)
      const codeMatch = remaining.match(/^`(.+?)`/)
      if (codeMatch) {
        parts.push(<code key={partKey++} className="bg-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono">{codeMatch[1]}</code>)
        remaining = remaining.slice(codeMatch[0].length)
        continue
      }

      // Regular text
      const nextSpecial = remaining.search(/[\*`]/)
      if (nextSpecial === -1) {
        parts.push(remaining)
        break
      } else {
        parts.push(remaining.slice(0, nextSpecial))
        remaining = remaining.slice(nextSpecial)
      }
    }

    return parts
  }

  return <div className="markdown-content">{parseMarkdown(content)}</div>
}
