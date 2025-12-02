# Usage: `useFetch` and server `actions`

This project includes a small client hook `app/hooks/useFetch.ts` and server action stubs in `app/actions` to standardize API calls and server-side document actions.

- `useFetch` (client):

  ```tsx
  'use client'
  import useFetch from './app/hooks/useFetch'

  export default function Example() {
    const { data, loading, error, fetchData } = useFetch()

    async function load() {
      await fetchData('/api/hello')
    }

    return (
      <div>
        <button onClick={load}>Load</button>
        {loading && <p>Loading...</p>}
        {error && <pre>{String(error)}</pre>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    )
  }
  ```

- `app/actions` (server actions): import and call server functions from client components. Example:

  ```tsx
  'use client'
  import { uploadDocument, queryDocument } from '@/app/actions'

  async function onSubmit(formData: FormData) {
    const res = await uploadDocument(formData)
    console.log(res)
  }
  ```

These are starter utilities — expand them to integrate PDF parsing, embedding creation, and your MongoDB Vector Search logic.
