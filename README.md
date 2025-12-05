# DocuMind 🧠📄

**DocuMind** is an intelligent RAG (Retrieval-Augmented Generation) document chat application that allows you to upload PDF documents and have natural conversations with them using AI. Built with Next.js 15, it leverages Google Gemini for generation, Pinecone for vector storage, and LangChain for document processing.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🗨️ **Multi-Chat Interface** - Create and manage multiple chat sessions simultaneously
- 📤 **PDF Upload & Indexing** - Upload PDF documents with automatic vectorization to Pinecone
- 🤖 **AI-Powered Responses** - Get accurate answers grounded in your document content using Google Gemini 2.0
- 💾 **Persistent Storage** - All chats, messages, and document metadata saved to MongoDB
- 🎨 **Beautiful UI** - Modern, responsive interface with resizable panels and smooth animations
- 🔍 **Smart Query Rewriting** - Automatic query enhancement for better retrieval results
- 📊 **Document Viewer** - Preview your uploaded PDFs directly in the app
- 🎯 **Per-Chat Namespaces** - Isolated vector storage for each chat session
- 🗑️ **Chat Management** - Delete chats with automatic cleanup of files and vectors
- ⚡ **Real-time Indexing Status** - Visual feedback during document processing

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**

### Backend & AI
- **Google Gemini 2.0 Flash** - Query rewriting and response generation
- **Pinecone** - Vector database for embeddings
- **LangChain** - Document processing and chunking
- **MongoDB + Mongoose** - Chat and message persistence
- **pdf-parse** - PDF text extraction

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or cloud)
- Google AI API key ([Get one here](https://ai.google.dev/))
- Pinecone account and API key ([Sign up here](https://www.pinecone.io/))

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd documind
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/documind

# Google AI (Gemini)
GEMINI_API_KEY=your_google_ai_api_key_here

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=documind

# Optional: Specify environment
PINECONE_ENVIRONMENT=your_pinecone_environment
```

### 4. Create the Pinecone index

Go to your Pinecone dashboard and create an index named `documind` with:
- **Dimensions**: 768 (for `text-embedding-004` model)
- **Metric**: Cosine similarity
- **Cloud**: AWS or GCP (your preference)

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
documind/
├── app/
│   ├── api/
│   │   ├── chats/              # Chat CRUD endpoints
│   │   ├── files/              # File serving endpoint
│   │   └── upload/             # File upload handler
│   ├── chat/
│   │   └── components/         # Chat UI components
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── lib/
│   ├── models/                 # Mongoose schemas
│   ├── indexers/               # Pinecone indexing utilities
│   └── mongoose.ts             # Database connection
├── uploads/
│   └── files/                  # Uploaded PDF storage
└── public/                     # Static assets
```

## 🎯 How It Works

1. **Create a Chat** - Start by creating a new chat session
2. **Upload a PDF** - Drag and drop a PDF document (auto-indexed to Pinecone)
3. **Ask Questions** - Type questions about your document
4. **Get AI Answers** - Receive contextual responses powered by Gemini

### Under the Hood

1. **Document Processing**:
   - PDF → Text extraction (pdf-parse)
   - Text → Chunks (RecursiveCharacterTextSplitter)
   - Chunks → Embeddings (Google text-embedding-004)
   - Embeddings → Pinecone (per-chat namespace)

2. **Query Flow**:
   - User question → Query rewrite (Gemini improves clarity)
   - Rewritten query → Embedding → Pinecone similarity search
   - Retrieved context + original question → Gemini → Answer
   - Answer saved to MongoDB

## 🔧 Configuration

### Adjusting Chunk Size

Edit `lib/indexers/pinecone.ts`:

```typescript
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,        // Adjust chunk size
  chunkOverlap: 200,      // Adjust overlap
})
```

### Changing the LLM Model

Edit API routes to use a different Gemini model:

```typescript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-exp'  // or gemini-1.5-pro
})
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check your cloud connection string
- Verify `MONGODB_URI` in `.env.local`

### Pinecone Errors
- Check your index name matches `PINECONE_INDEX_NAME`
- Verify dimensions (768 for text-embedding-004)
- Ensure API key has proper permissions

### File Upload Fails
- Check `/uploads/files` directory exists and is writable
- Verify file size limits in `next.config.ts`

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chats` | List all chats |
| POST | `/api/chats` | Create new chat |
| GET | `/api/chats/[chatId]` | Get chat with messages |
| DELETE | `/api/chats/[chatId]` | Delete chat + file + vectors |
| POST | `/api/chats/[chatId]/messages` | Send message, get AI response |
| POST | `/api/upload` | Upload PDF file |
| GET | `/api/files/[filename]` | Serve uploaded file |

## 🚀 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

**Note**: For file uploads in production, consider using cloud storage (S3, Google Cloud Storage) instead of local filesystem.

### Docker

```bash
docker build -t documind .
docker run -p 3000:3000 --env-file .env.local documind
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Google Gemini](https://ai.google.dev/) - Generative AI
- [Pinecone](https://www.pinecone.io/) - Vector database
- [LangChain](https://www.langchain.com/) - LLM orchestration
- [MongoDB](https://www.mongodb.com/) - Database

---

Built with ❤️ using Next.js and AI
