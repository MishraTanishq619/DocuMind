'use client'

import React, { useState, useCallback, useRef, useEffect, JSX } from 'react'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'
import { motion } from 'motion/react'
import DragDropUploader from './DragDropUploader'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import DocumentViewer from './DocumentViewer'

export default function ChatApp() {
  const [chats, setChats] = useState<Array<{ id: string; title: string }>>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Array<{ role: 'user'|'assistant'; text: string }>>>({})
  const [loadingByChat, setLoadingByChat] = useState<Record<string, boolean>>({})
  const [indexingByChat, setIndexingByChat] = useState<Record<string, boolean>>({})
  const [uploadedDocument, setUploadedDocument] = useState<{ name: string; url?: string; size?: number } | null>(null)
  const [documentsByChat, setDocumentsByChat] = useState<Record<string, { name: string; url?: string; size?: number } | null>>({})

  const createChat = useCallback((title?: string) => {
    const id = String(Date.now())
    const newChat = { id, title: title || `Chat ${chats.length + 1}` }
    setChats((c) => [newChat, ...c])
    setActiveChatId(id)
    setMessagesByChat((m) => ({ ...m, [id]: [] }))
    setDocumentsByChat((d) => ({ ...d, [id]: null }))
    setIndexingByChat((idx) => ({ ...idx, [id]: false }))
  }, [chats.length])

  // Load chats from server on mount
  useEffect(() => {
    let mounted = true
    async function loadChats() {
      try {
        const res = await fetch('/api/chats')
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        // map to local shape
        const mapped = (data || []).map((c: any) => ({ id: c.id, title: c.title, createdAt: c.createdAt, file: c.file }))
        setChats(mapped)
      } catch (err) {
        console.error('Failed to load chats', err)
      }
    }
    loadChats()
    return () => {
      mounted = false
    }
  }, [])

  // Effect A: update displayed document when active chat or chat metadata changes
  useEffect(() => {
    if (!activeChatId) {
      setUploadedDocument(null)
      return
    }
    const chat = chats.find((c) => c.id === activeChatId)
    const fileMeta = (chat && (chat as any).file) || null
    if (fileMeta) {
      const doc = {
        name: fileMeta.originalname || fileMeta.filename || 'Document',
        size: fileMeta.size,
        url: `/api/files/${fileMeta.filename}`,
      }
      setUploadedDocument(doc)
      setDocumentsByChat((d) => ({ ...d, [activeChatId]: doc }))
    } else {
      // if we have a client-side uploaded preview for this chat, use it
      const clientDoc = documentsByChat[activeChatId] || null
      setUploadedDocument(clientDoc)
    }
  }, [activeChatId, chats, documentsByChat])

  // Keep track of which chats we've loaded messages for to avoid refetch loops
  const loadedMessagesRef = useRef<Record<string, boolean>>({})

  // Effect B: fetch messages for the active chat once when it becomes active
  useEffect(() => {
    if (!activeChatId) return
    if (loadedMessagesRef.current[activeChatId]) return

    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/chats/${activeChatId}`)
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        const msgs = (data.messages || []).map((m: any) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', text: m.text }))
        setMessagesByChat((m) => ({ ...m, [activeChatId]: msgs }))
        loadedMessagesRef.current[activeChatId] = true
      } catch (err) {
        console.error('Failed to load chat messages', err)
      }
    })()

    return () => {
      mounted = false
    }
  }, [activeChatId])

  const activeChat = chats.find((c) => c.id === activeChatId) as any | undefined

  // UI states for creating new chat via modal + backend
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState('')
  const [creatingChat, setCreatingChat] = useState(false)

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleCreateChatFromServer() {
    if (!newChatTitle.trim()) return
    try {
      setCreatingChat(true)
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newChatTitle.trim() }),
      })
      if (!res.ok) throw new Error('Failed to create chat')
      const data = await res.json()
      const id = data.id || String(Date.now())
      const title = data.title || newChatTitle.trim()
      const newChat = { id, title }
      setChats((c) => [newChat, ...c])
      setActiveChatId(id)
      setMessagesByChat((m) => ({ ...m, [id]: [] }))
      setDocumentsByChat((d) => ({ ...d, [id]: null }))
      setIndexingByChat((idx) => ({ ...idx, [id]: false }))
      setShowNewChatModal(false)
      setNewChatTitle('')
    } catch (err) {
      console.error(err)
      // optionally show user-facing error
    } finally {
      setCreatingChat(false)
    }
  }

  const addMessage = useCallback((chatId: string, role: 'user'|'assistant', text: string) => {
    setMessagesByChat((m) => ({ ...m, [chatId]: [...(m[chatId] || []), { role, text }] }))
  }, [])

  const onFileUploaded = useCallback((fileMeta: { name: string; size?: number; url?: string }) => {
    // attach uploaded file to the active chat
    if (!activeChatId) {
      // no active chat; ignore or you could create a new chat automatically
      return
    }
    setDocumentsByChat((d) => ({ ...d, [activeChatId]: fileMeta }))
    // keep `uploadedDocument` for backwards compatibility/preview (optional)
    setUploadedDocument(fileMeta)
  }, [activeChatId])

  const onDeleteChat = useCallback(async (chatId: string) => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Failed to delete chat')
      }
      // Remove chat from local state
      setChats((prev) => prev.filter((c) => c.id !== chatId))
      // Clear active chat if it was deleted
      if (activeChatId === chatId) {
        setActiveChatId(null)
        setUploadedDocument(null)
      }
      // Clean up local state
      setMessagesByChat((m) => {
        const newM = { ...m }
        delete newM[chatId]
        return newM
      })
      setDocumentsByChat((d) => {
        const newD = { ...d }
        delete newD[chatId]
        return newD
      })
      setLoadingByChat((l) => {
        const newL = { ...l }
        delete newL[chatId]
        return newL
      })
      setIndexingByChat((idx) => {
        const newIdx = { ...idx }
        delete newIdx[chatId]
        return newIdx
      })
    } catch (err) {
      console.error('Failed to delete chat', err)
      throw err
    }
  }, [activeChatId])

  const confirmDelete = useCallback(async () => {
    if (!deleteConfirmId) return
    setDeleting(true)
    try {
      await onDeleteChat(deleteConfirmId)
      setDeleteConfirmId(null)
    } catch (err) {
      console.error('Failed to delete chat', err)
    } finally {
      setDeleting(false)
    }
  }, [deleteConfirmId, onDeleteChat])

  const leftRef = useRef<HTMLDivElement | null>(null)
  const rightRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef<{ type: 'left' | 'right' | null; startX: number; startWidth: number } | null>(null)

  const [leftWidth, setLeftWidth] = useState<number>(224) // w-56 => 14rem = 224px
  const [rightWidth, setRightWidth] = useState<number>(320) // w-80 => 20rem = 320px

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!draggingRef.current) return
      const { type, startX, startWidth } = draggingRef.current
      const clientX = e.clientX
      const deltaX = clientX - startX
      if (type === 'left') {
        const min = 160
        const max = 480
        const newW = Math.max(min, Math.min(max, startWidth + deltaX))
        setLeftWidth(newW)
      } else if (type === 'right') {
        const min = 200
        const max = 720
        // Compute right width based on pointer distance to container right edge.
        const container = containerRef.current
        if (container) {
          const rect = container.getBoundingClientRect()
          const newW = Math.max(min, Math.min(max, Math.round(rect.right - clientX)))
          setRightWidth(newW)
        } else {
          const newW = Math.max(min, Math.min(max, startWidth - deltaX))
          setRightWidth(newW)
        }
      }
    }

    function onUp() {
      draggingRef.current = null
      try {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      } catch (e) {
        // ignore
      }
    }

    function onSelectStart(e: Event) {
      if (draggingRef.current) {
        e.preventDefault()
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('selectstart', onSelectStart)
    window.addEventListener('dragstart', onSelectStart)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('selectstart', onSelectStart)
      window.removeEventListener('dragstart', onSelectStart)
    }
  }, [])

  // touch support
  useEffect(() => {
    function onTouchMove(e: TouchEvent) {
      if (!draggingRef.current) return
      const touch = e.touches[0]
      const { type, startX, startWidth } = draggingRef.current
      const deltaX = touch.clientX - startX
      if (type === 'left') {
        const min = 160
        const max = 480
        const newW = Math.max(min, Math.min(max, startWidth + deltaX))
        setLeftWidth(newW)
      } else if (type === 'right') {
        const min = 200
        const max = 720
        const container = containerRef.current
        if (container) {
          const rect = container.getBoundingClientRect()
          const newW = Math.max(min, Math.min(max, Math.round(rect.right - touch.clientX)))
          setRightWidth(newW)
        } else {
          const newW = Math.max(min, Math.min(max, startWidth - deltaX))
          setRightWidth(newW)
        }
      }
    }

    function onTouchEnd() {
      draggingRef.current = null
      try {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  function startDragLeft(e: React.MouseEvent | React.TouchEvent) {
    try {
      // prevent text selection
      if ('touches' in e) (e as React.TouchEvent).preventDefault()
      else (e as React.MouseEvent).preventDefault()
    } catch (err) {
      // ignore
    }
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    draggingRef.current = { type: 'left', startX: clientX, startWidth: leftWidth }
    try {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } catch (err) {
      // ignore
    }
  }

  function startDragRight(e: React.MouseEvent | React.TouchEvent) {
    try {
      // prevent text selection
      if ('touches' in e) (e as React.TouchEvent).preventDefault()
      else (e as React.MouseEvent).preventDefault()
    } catch (err) {
      // ignore
    }
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    draggingRef.current = { type: 'right', startX: clientX, startWidth: rightWidth }
    try {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } catch (err) {
      // ignore
    }
  }

  return (
    <div ref={containerRef} className="relative flex w-full items-start h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
      </div>
      {/* left handle (absolute) */}
      <div
        onMouseDown={startDragLeft}
        onTouchStart={startDragLeft}
        className="z-20 hidden w-2 cursor-col-resize hover:bg-zinc-200 md:block"
        style={{ position: 'absolute', left: leftWidth - 4, top: 0, bottom: 0 }}
        aria-hidden
      />

      {/* right handle (absolute) */}
      <div
        onMouseDown={startDragRight}
        onTouchStart={startDragRight}
        className="z-20 hidden w-2 cursor-col-resize hover:bg-zinc-200 md:block"
        style={{ position: 'absolute', left: `calc(100% - ${rightWidth}px - 4px)`, top: 0, bottom: 0 }}
        aria-hidden
      />
      <aside ref={leftRef} style={{ width: leftWidth }} className="flex-none flex h-screen flex-col justify-between rounded-l-md bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-xl">
        <div className="flex flex-col min-h-0 flex-1">
          <div className="p-4 flex-shrink-0 space-y-3">
            <Link href="/" aria-label="Back to landing">
              <motion.div
                className="flex items-center gap-2 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <span className="text-lg text-slate-900">DocuMind</span>
              </motion.div>
            </Link>
            <button
              className="flex w-full items-center gap-3 rounded-md bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
              onClick={() => setShowNewChatModal(true)}
              aria-label="Create new chat"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-white/20 text-xs">+</span>
              <span>New Chat</span>
            </button>
          </div>

          <div className="px-2 pb-4 overflow-y-auto flex-1 min-h-0">
            <ChatList 
              chats={chats} 
              activeId={activeChatId} 
              onSelect={(id) => setActiveChatId(id)} 
              onDelete={onDeleteChat}
              deleteConfirmId={deleteConfirmId}
              setDeleteConfirmId={setDeleteConfirmId}
              deleting={deleting}
              confirmDelete={confirmDelete}
            />
          </div>
        </div>

        <div className="px-4 py-3 text-xs text-slate-600 flex-shrink-0">RAG Document Assistant</div>
      </aside>

      <section className="flex-1 flex h-screen flex-col rounded-md bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-xl min-w-0 text-slate-900">
        
        {/* Chat title header */}
        <div className="border-b border-slate-200/70 px-6 py-3">
          {activeChat ? (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-800 truncate">{activeChat.title}</h2>
              {activeChat.file ? (
                <span className="ml-4 inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">File attached</span>
              ) : null}
            </div>
          ) : (
            <div className="text-sm text-zinc-500">No chat selected</div>
          )}
        </div>
              
        <div className="p-6">
          {/* Uploader is only available inside an active chat */}
          {activeChatId ? (
            // show uploader only when active chat does NOT have a server file
            ((): JSX.Element | null => {
              const activeChat = chats.find((c) => c.id === activeChatId)
              const hasFile = !!(activeChat && (activeChat as any).file)
              if (hasFile) return null
              return <DragDropUploader onUploaded={onFileUploaded} onSaved={(data) => {
                // Set indexing state to true when upload completes
                const cid = data?.chatId || activeChatId
                setIndexingByChat((idx) => ({ ...idx, [cid]: true }))
                // update local chat entry with returned file metadata
                setChats((prev) => prev.map((c) => c.id === cid ? { ...c, file: { id: data.id, filename: data.filename, originalname: data.originalname, size: data.size, path: data.path } } : c))
                // set document preview from server file
                const doc = { name: data.originalname ?? 'Document', size: data.size, url: `/api/files/${data.filename}` }
                setUploadedDocument(doc)
                setDocumentsByChat((d) => ({ ...d, [cid]: doc }))
                // Simulate indexing delay; in production, poll actual Pinecone indexing status or use webhook
                setTimeout(() => {
                  setIndexingByChat((idx) => ({ ...idx, [cid]: false }))
                }, 3000) // 3s delay to simulate Pinecone indexing
              }} chatId={activeChatId} />
            })()
          ) : (
            <div className="mx-auto flex h-80 max-w-2xl items-center justify-center rounded-lg border-2 border-dashed p-6">
              <div className="text-center">
                <h4 className="mb-2 text-lg font-semibold text-zinc-700">Create or select a chat to upload a document</h4>
                <p className="text-sm text-zinc-500">Start a chat from the left, then upload files inside that conversation.</p>
              </div>
            </div>
          )}
        </div>


        <div className="relative flex flex-1 flex-col min-w-0">
          {activeChatId ? (
            <>
              <ChatWindow
                messages={messagesByChat[activeChatId] || []}
                onSend={async (text) => {
                  // Optimistically add the user message
                  addMessage(activeChatId, 'user', text)
                  // set loading indicator for this chat
                  setLoadingByChat((s) => ({ ...s, [activeChatId]: true }))

                  try {
                    const res = await fetch(`/api/chats/${activeChatId}/messages`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ text }),
                    })
                    if (!res.ok) {
                      const err = await res.json().catch(() => ({}))
                      addMessage(activeChatId, 'assistant', `Error: ${err?.error || 'Failed to get response'}`)
                      return
                    }
                    const data = await res.json()
                    const assistantText = data?.assistant?.text || 'No reply'
                    addMessage(activeChatId, 'assistant', assistantText)
                  } catch (err) {
                    console.error('Send message error', err)
                    addMessage(activeChatId, 'assistant', 'Error: failed to get assistant reply')
                  } finally {
                    setLoadingByChat((s) => ({ ...s, [activeChatId]: false }))
                  }
                }}
                document={uploadedDocument}
                loading={!!loadingByChat[activeChatId]}
                indexing={!!indexingByChat[activeChatId]}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">Create or select a chat to start</div>
          )}
        </div>
      </section>

      <aside ref={rightRef} style={{ width: rightWidth }} className="flex-none h-screen overflow-auto rounded-md bg-white/80 backdrop-blur-xl border border-slate-200/60 p-6 shadow-xl relative text-slate-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-black font-semibold">Document Viewer</h3>
          {activeChatId && !!indexingByChat[activeChatId as string] && (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
              Indexing...
            </div>
          )}
        </div>
        <DocumentViewer document={uploadedDocument} />
      </aside>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowNewChatModal(false)}>
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900">Create new chat</h3>
            <p className="mb-6 text-sm text-zinc-500">Give your chat a descriptive name</p>
            <input
              autoFocus
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newChatTitle.trim() && !creatingChat) {
                  handleCreateChatFromServer()
                }
              }}
              className="mb-6 w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Research notes"
            />
            <div className="flex justify-end gap-3">
              <button
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 transition-colors cursor-pointer"
                onClick={() => {
                  setShowNewChatModal(false)
                  setNewChatTitle('')
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shadow-sm hover:shadow-md active:scale-95"
                onClick={handleCreateChatFromServer}
                disabled={creatingChat || !newChatTitle.trim()}
              >
                {creatingChat ? 'Creating…' : 'Create Chat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Chat Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)}>
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
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
