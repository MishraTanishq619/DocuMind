'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ShareConsumePage() {
  const router = useRouter()
  const params = useParams()
  const publicId = params?.publicId
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!publicId) {
      setError('Missing share id')
      return
    }

    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/share/consume/${publicId}`, { method: 'POST', credentials: 'same-origin' })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.error || 'Failed to consume share')
        }
        const data = await res.json()
        const newId = data?.id
        // redirect to /chat and open the new chat if id present
        if (mounted) {
          if (newId) router.push(`/chat?open=${newId}`)
          else router.push('/chat')
        }
      } catch (err: any) {
        console.error('Failed to consume share', err)
        if (mounted) setError(err?.message || 'Failed')
      }
    })()
    return () => {
      mounted = false
    }
  }, [publicId, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      {error ? (
        <div className="max-w-xl text-center">
          <h3 className="text-lg font-semibold">Could not import shared chat</h3>
          <p className="text-sm text-zinc-600 mt-2">{error}</p>
        </div>
      ) : (
        <div className="text-sm text-zinc-600">Importing shared chat…</div>
      )}
    </div>
  )
}
