'use client'

import React, { useMemo, useState } from 'react'

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

export default function ChatList({ 
  chats, 
  activeId, 
  onSelect,
  onDelete,
}: { 
  chats: Array<{ id: string; title: string }>
  activeId: string | null
  onSelect: (id: string) => void
  onDelete?: (id: string) => Promise<void>
}) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {}
    chats.forEach((c) => {
      map[c.id] = getColorForId(c.id)
    })
    return map
  }, [chats])

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    setDeleteConfirmId(chatId)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmId) return
    setDeleting(true)
    try {
      if (onDelete) {
        await onDelete(deleteConfirmId)
      }
    } catch (err) {
      console.error('Failed to delete chat', err)
    } finally {
      setDeleting(false)
      setDeleteConfirmId(null)
    }
  }

  return (
    <div className="px-2">
      {chats.length === 0 && <div className="mt-2 text-sm text-zinc-400">No chats yet</div>}
      <ul className="mt-3 space-y-2">
        {chats.map((c) => (
          <li key={c.id}>
            <div className="group relative">
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
              <button
                onClick={(e) => handleDelete(e, c.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center w-6 h-6 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                aria-label="Delete chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="mb-2 text-lg font-semibold text-zinc-900">Delete chat?</h3>
            <p className="mb-6 text-sm text-zinc-600">
              This will permanently delete the chat, its messages, and any associated documents. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
