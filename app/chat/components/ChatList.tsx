'use client'

import React from 'react'

export default function ChatList({ chats, activeId, onSelect }: { chats: Array<{ id: string; title: string }>; activeId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="px-2">
      {chats.length === 0 && <div className="mt-2 text-sm text-zinc-400">No chats yet</div>}
      <ul className="mt-3 space-y-2">
        {chats.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`flex w-full items-center gap-3 truncate rounded-md px-3 py-2 text-left text-sm transition-colors ${activeId === c.id ? 'bg-[#102737] text-white' : 'text-zinc-200 hover:bg-[#0d1626]'}`}
            >
              <span className="inline-block h-6 w-6 shrink-0 rounded-sm bg-[#082036] text-xs" />
              <span className="truncate">{c.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
