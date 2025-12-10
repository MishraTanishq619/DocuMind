import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../../lib/mongoose'
import Chat from '../../../../../lib/models/Chat'

export const runtime = 'nodejs'

export async function POST(req: Request, context: any) {
  try {
    const params = await context.params
    const { chatId } = params || {}
    if (!chatId) return NextResponse.json({ error: 'Missing chatId' }, { status: 400 })

    const body = await req.json()
    const text = (body?.text || '').trim()
    if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 })

    // Ensure retrieval configuration exists (per user instruction, return error if not configured)
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME || !process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Retrieval not configured (missing env vars)' }, { status: 500 })
    }

    await connectToDatabase()

    const chat = await Chat.findById(chatId)
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 })

    // Save the user message to DB
    const userMessage = { role: 'user', text, createdAt: new Date() }
    await Chat.findByIdAndUpdate(chatId, { $push: { messages: userMessage } })

    // Build a short history for the rewrite/generation (last 12 messages)
    const history = (chat.messages || []).slice(-12).map((m: any) => ({ role: m.role, text: m.text }))

    // 1) Re-write the query into a standalone question using Gemini
    let rewritten = text
    try {
      const { GoogleGenAI } = await import('@google/genai')
      const ai = new GoogleGenAI({})

      // Build contents similar to the snippet: use history and the follow-up question
      // Note: Gemini API does not support a 'system' role in content items — keep only 'user'/'model'.
      // user / model || user / assistant
      const contents = [
        ...history.map((h: any) => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text }] },
      ]

      const rewriteResp: any = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL_NAME,
        contents,
        config: {
          systemInstruction: `You are a query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history. Only output the rewritten question and nothing else.`,
        },
      })

      // Attempt to extract text from response
      if (rewriteResp && (rewriteResp.outputText || rewriteResp.text || rewriteResp?.candidates?.[0]?.content?.[0]?.text)) {
        rewritten = rewriteResp.outputText || rewriteResp.text || rewriteResp?.candidates?.[0]?.content?.[0]?.text || rewritten
      }
    } catch (err) {
      console.error('Query rewrite failed, proceeding with original text:', err)
    }

    // 2) Embed the rewritten query and query Pinecone in the chatId namespace
    const { GoogleGenerativeAIEmbeddings } = await import('@langchain/google-genai')
    const { Pinecone } = await import('@pinecone-database/pinecone')

    const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GEMINI_API_KEY, model: 'text-embedding-004' })
    const qVec = await embeddings.embedQuery(rewritten)

    // Initialize Pinecone client (it reads env vars automatically)
    const pinecone = new Pinecone()
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME || '')

    const queryResp: any = await pineconeIndex.namespace(String(chatId)).query({
      topK: 10,
      vector: qVec,
      includeMetadata: true,
    })

    const matches = (queryResp?.matches || queryResp?.matches || [])
    const retrievedContext = matches.map((m: any) => m.metadata?.text || m.metadata?.content || '').filter(Boolean).join('\n\n---\n\n')

    // 3) Stream the response from Gemini
    const { GoogleGenAI } = await import('@google/genai')
    const ai = new GoogleGenAI({})

    const historyForModel = [...history.map((h: any) => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })), { role: 'user', parts: [{ text: rewritten }] }]

    const encoder = new TextEncoder()
    let fullText = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await ai.models.generateContentStream({
            model: process.env.GEMINI_MODEL_NAME,
            contents: historyForModel,
            config: {
              systemInstruction: `You have to behave like a Data Structure and Algorithm Expert. You will be given a context of relevant information and a user question. Your task is to answer the user's question based ONLY on the provided context. If the answer is not in the context, you must say "I could not find the answer in the provided document." Keep your answers clear, concise, and educational.\n\nContext: ${retrievedContext}`,
            },
          })

          // Try to access the stream in different ways the API might provide it
          const responseStream = result[Symbol.asyncIterator] ? result : null
          
          if (!responseStream) {
            throw new Error('No stream available from Gemini API')
          }

          for await (const chunk of responseStream) {
            const text = chunk.text || chunk?.candidates?.[0]?.content?.parts?.[0]?.text || ''
            if (text) {
              fullText += text
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
              // Add a small delay for a more natural typing effect
              await new Promise(resolve => setTimeout(resolve, 20))
            }
          }

          // Save the complete assistant message to DB
          const assistantMessage = { role: 'assistant', text: fullText, createdAt: new Date() }
          await Chat.findByIdAndUpdate(chatId, { $push: { messages: assistantMessage } })

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          console.error('Streaming generation failed:', err)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Model generation failed' })}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err) {
    console.error('messages route error', err)
    return NextResponse.json({ error: 'Message processing failed' }, { status: 500 })
  }
}
