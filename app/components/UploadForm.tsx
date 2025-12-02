'use client'

import React, { useRef, useState } from 'react'
import useFetch from '@/app/hooks/useFetch'
import { uploadFile } from '@/app/actions'

export default function UploadForm() {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const { data: fetchDataResult, error: fetchError, loading: fetchLoading } = useFetch()
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const input = fileRef.current
    if (!input?.files || input.files.length === 0) return

    const file = input.files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Call server action exported from app/actions
      const res = await uploadFile(formData)
      setResult(res)
      setError(null)
    } catch (err) {
      setError(err)
      setResult(null)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="file">Upload PDF</label>
        <input ref={fileRef} id="file" name="file" type="file" accept="application/pdf" />
        <button type="submit" disabled={fetchLoading}>Upload</button>
      </form>

      {fetchLoading && <div>Uploading…</div>}
      {error && <pre style={{ color: 'red' }}>{String(error)}</pre>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}

      {/* legacy fetchData state (if you want to use fetch instead) */}
      {fetchError && <pre style={{ color: 'red' }}>{String(fetchError)}</pre>}
      {fetchDataResult && <pre>{JSON.stringify(fetchDataResult, null, 2)}</pre>}
    </div>
  )
}
