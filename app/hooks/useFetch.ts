'use client'

import { useCallback, useRef, useState } from 'react'

type FetchOptions = RequestInit & { skipJson?: boolean }

export default function useFetch() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async (input: RequestInfo, options?: FetchOptions) => {
    setLoading(true)
    setError(null)
    // abort previous
    try {
      abortRef.current?.abort()
    } catch (e) {
      // ignore
    }
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch(input, { signal: controller.signal, ...options })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }

      const result = options?.skipJson ? res : await res.json()
      setData(result)
      setLoading(false)
      return result
    } catch (err) {
      if ((err as any)?.name === 'AbortError') {
        // request was cancelled
      } else {
        setError(err)
      }
      setLoading(false)
      throw err
    }
  }, [])

  const cancel = useCallback(() => {
    try {
      abortRef.current?.abort()
    } catch (e) {
      // ignore
    }
    abortRef.current = null
  }, [])

  return { data, error, loading, fetchData, cancel, setData, setError }
}
