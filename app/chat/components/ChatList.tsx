'use client'

import React, { useMemo } from 'react'

const BORDER_COLORS = [
  'border-red-500',
  'border-orange-500',
  'border-yellow-500',
  'border-green-500',
  'border-blue-500',
  'border-indigo-500',
  'border-purple-500',
  'border-pink-500',
  'border-cyan-500',
  'border-teal-500',
]

function getColorForId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i)
    hash = hash & hash
  }
  return BORDER_COLORS[Math.abs(hash) % BORDER_COLORS.length]
}

export default function ChatList({ chats, activeId, onSelect }: { chats: Array<{ id: string; title: string }>; activeId: string | null; onSelect: (id: string) => void }) {
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {}
    chats.forEach((c) => {
      map[c.id] = getColorForId(c.id)
    })
    return map
  }, [chats])

  return (
    <div className="px-2">
      {chats.length === 0 && <div className="mt-2 text-sm text-zinc-400">No chats yet</div>}
      <ul className="mt-3 space-y-2">
        {chats.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`flex w-full items-center gap-3 truncate rounded-md px-3 py-2 text-left text-sm transition-all ${
                activeId === c.id
                  ? `${colorMap[c.id]} border-l-4 bg-[#102737] text-white shadow-lg ring-1 ring-opacity-50`
                  : `${colorMap[c.id]} border-l-2 text-zinc-200 hover:bg-[#0d1626]`
              }`}
              style={
                activeId === c.id
                  ? {
                      borderLeftWidth: '4px',
                      boxShadow: `inset -4px 0 0 rgba(255,255,255,0.1)`,
                    }
                  : { borderLeftWidth: '2px' }
              }
            >
              <span className="truncate font-medium">{c.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
