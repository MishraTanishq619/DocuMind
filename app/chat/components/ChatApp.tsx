'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import DragDropUploader from './DragDropUploader'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import DocumentViewer from './DocumentViewer'

export default function ChatApp() {
  const [chats, setChats] = useState<Array<{ id: string; title: string }>>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Array<{ role: 'user'|'assistant'; text: string }>>>({})
  const [document, setDocument] = useState<{ name: string; url?: string; size?: number } | null>(null)
  const [documentsByChat, setDocumentsByChat] = useState<Record<string, { name: string; url?: string; size?: number } | null>>({})

  const createChat = useCallback((title?: string) => {
    const id = String(Date.now())
    const newChat = { id, title: title || `Chat ${chats.length + 1}` }
    setChats((c) => [newChat, ...c])
    setActiveChatId(id)
    setMessagesByChat((m) => ({ ...m, [id]: [] }))
    setDocumentsByChat((d) => ({ ...d, [id]: null }))
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

  // when activeChatId changes, set the document to the chat's attached file (if any)
  useEffect(() => {
    if (!activeChatId) {
      setDocument(null)
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
      setDocument(doc)
      setDocumentsByChat((d) => ({ ...d, [activeChatId]: doc }))
    } else {
      // if we have a client-side uploaded preview for this chat, use it
      const clientDoc = documentsByChat[activeChatId] || null
      setDocument(clientDoc)
    }
  }, [activeChatId, chats, documentsByChat])

  const activeChat = chats.find((c) => c.id === activeChatId) as any | undefined

  // UI states for creating new chat via modal + backend
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState('')
  const [creatingChat, setCreatingChat] = useState(false)

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
    // keep `document` for backwards compatibility/preview (optional)
    setDocument(fileMeta)
  }, [activeChatId])

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
    <div ref={containerRef} className="relative flex w-full items-start h-screen">
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
      <aside ref={leftRef} style={{ width: leftWidth }} className="flex-none flex h-screen flex-col justify-between rounded-l-md bg-[#071226] text-white shadow-lg">
        <div>
          <div className="p-4">
            <button
              className="flex w-full items-center gap-3 rounded-md bg-[#0b1b33] px-3 py-2 text-sm font-semibold hover:bg-[#0e2640]"
              onClick={() => setShowNewChatModal(true)}
              aria-label="Create new chat"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[#12243a] text-xs">+</span>
              <span>New Chat</span>
            </button>
          </div>

          <div className="px-2 pb-4">
            <ChatList chats={chats} activeId={activeChatId} onSelect={(id) => setActiveChatId(id)} />
          </div>
        </div>

        <div className="px-4 py-3 text-xs text-zinc-400">RAG Document Assistant</div>
      </aside>

      <section className="flex-1 flex h-screen flex-col rounded-md bg-white shadow-sm min-w-0">
        
        {/* Chat title header */}
        <div className="border-b px-6 py-3">
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
                // update local chat entry with returned file metadata
                const cid = data?.chatId || activeChatId
                setChats((prev) => prev.map((c) => c.id === cid ? { ...c, file: { id: data.id, filename: data.filename, originalname: data.originalname, size: data.size, path: data.path } } : c))
                // set document preview from server file
                const doc = { name: data.originalname ?? 'Document', size: data.size, url: `/api/files/${data.filename}` }
                setDocument(doc)
                setDocumentsByChat((d) => ({ ...d, [cid]: doc }))
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
                onSend={(text) => {
                  addMessage(activeChatId, 'user', text)
                  // placeholder assistant reply
                  setTimeout(() => addMessage(activeChatId, 'assistant', `Echo: ${text}`), 500)
                }}
                document={document}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">Create or select a chat to start</div>
          )}
        </div>
      </section>

      <aside ref={rightRef} style={{ width: rightWidth }} className="flex-none h-screen overflow-auto rounded-md bg-white p-6 shadow-sm relative">
        <h3 className="mb-4 text-sm text-black font-semibold">Document Viewer</h3>
        <DocumentViewer document={document} />
      </aside>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded bg-white p-6 shadow">
            <h3 className="mb-2 text-lg font-semibold">Create new chat</h3>
            <p className="mb-4 text-sm text-zinc-600">Give your chat a name</p>
            <input
              autoFocus
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              className="mb-4 w-full rounded border px-3 py-2"
              placeholder="e.g. Research notes"
            />
            <div className="flex justify-end gap-2">
              <button
                className="rounded px-3 py-2 text-sm"
                onClick={() => {
                  setShowNewChatModal(false)
                  setNewChatTitle('')
                }}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
                onClick={handleCreateChatFromServer}
                disabled={creatingChat || !newChatTitle.trim()}
              >
                {creatingChat ? 'Creating…' : 'Create Chat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
