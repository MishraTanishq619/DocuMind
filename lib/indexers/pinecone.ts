import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { Pinecone } from '@pinecone-database/pinecone'
import { PineconeStore } from '@langchain/pinecone'

export async function indexPDFToPinecone(filePath: string, namespace?: string) {
  try {
    // Require essential env vars
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME || !process.env.GEMINI_API_KEY) {
      console.log('Indexing skipped: missing PINECONE_API_KEY, PINECONE_INDEX_NAME, or GEMINI_API_KEY')
      return
    }

    // Load and split the PDF
    const loader = new PDFLoader(filePath)
    const rawDocs = await loader.load()
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 })
    const docs = await splitter.splitDocuments(rawDocs)

    // Embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GEMINI_API_KEY, model: 'text-embedding-004' })

    // Pinecone client and index
    const pinecone = new Pinecone()
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME || '')

    const ns = namespace || 'default'

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: ns,
      maxConcurrency: 5,
    })

    console.log(`Indexed ${docs.length} document chunks to Pinecone namespace=${ns}`)
  } catch (err) {
    // Provide actionable guidance if the failure is related to pdf-parse version mismatch
    const message = (err as any)?.message || String(err)
    console.error('Indexing to Pinecone failed:', err)
    if (message.includes('Failed to load pdf-parse')) {
      console.error("PDF loader requires pdf-parse v1. Install with: npm install pdf-parse@^1")
    }
  }
}

export default indexPDFToPinecone
