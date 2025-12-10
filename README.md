# DocuMind 🧠📄

**DocuMind** is an intelligent RAG (Retrieval-Augmented Generation) document chat application that allows you to upload PDF documents and have natural conversations with them using AI. Built with Next.js 15, it leverages Google Gemini for generation, Pinecone for vector storage, and LangChain for document processing.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🗨️ **Multi-Chat Interface** - Create and manage multiple chat sessions with persistent storage
- 📤 **PDF Upload & Indexing** - Upload PDF documents with automatic vectorization to Pinecone
- 🤖 **AI-Powered Responses** - Get accurate answers grounded in your document content using Google Gemini 2.0
- ⚡ **Streaming Responses** - Real-time token streaming with progressive text display
- 🎙️ **Voice Input** - Speak naturally to search documents using Web Speech API (append mode)
- 💾 **Persistent Storage** - All chats, messages, and document metadata saved to MongoDB
- 🎨 **Beautiful UI** - Modern, responsive interface with resizable panels and smooth animations
- 🔍 **Smart Query Rewriting** - Automatic query enhancement for better retrieval results
- 📊 **Document Viewer** - Preview uploaded PDFs directly in the app
- 🎯 **Per-Chat Namespaces** - Isolated vector storage for each chat session
- 🔐 **Authentication** - Secure user accounts with JWT-based authentication and httpOnly cookies
- 📋 **Middleware Protection** - All routes except `/` and `/auth` require authentication
- 🔗 **Chat Sharing** - Create shareable links that fork chats to other users' accounts
- 📥 **PDF Export** - Export chat conversations as formatted PDFs with markdown support
- 📝 **Markdown Rendering** - Beautiful rendering of bold, italic, code, and lists in chat
- 🗑️ **Chat Management** - Delete chats with automatic cleanup of files and vectors
- ✅ **Toast Notifications** - User-friendly notifications for all actions
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

Copy `env.sample` to `.env.local` and fill in your credentials:

```bash
cp env.sample .env.local
```

Edit `.env.local` with your actual values:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=your-database-name

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL_NAME=gemini-2.0-flash

# Pinecone Vector Database
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX_NAME=your-index-name

# Google Cloud Storage (for file uploads in production)
GCP_PROJECT_ID=your-gcp-project-id
GCP_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
GCP_PRIVATE_KEY=your-gcp-private-key
GCP_BUCKET_NAME=your-bucket-name

# Authentication Secret (min 32 characters)
JWT_SECRET=your-jwt-secret-key-min-32-characters-long
```

**Environment Variable Details:**

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string with auth | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB` | Database name to use | `documind-prod` |
| `GEMINI_API_KEY` | Google AI API key from [ai.google.dev](https://ai.google.dev/) | - |
| `GEMINI_MODEL_NAME` | Gemini model version | `gemini-2.0-flash` or `gemini-1.5-pro` |
| `PINECONE_API_KEY` | Pinecone API key from [console.pinecone.io](https://console.pinecone.io) | - |
| `PINECONE_ENVIRONMENT` | Pinecone environment region | `us-west-2-aws` |
| `PINECONE_INDEX_NAME` | Pinecone index name (768 dimensions) | `documind-vectors` |
| `GCP_PROJECT_ID` | Google Cloud project ID (optional, for production) | `my-project-id` |
| `GCP_CLIENT_EMAIL` | GCP service account email (optional, for production) | `sa@project.iam.gserviceaccount.com` |
| `GCP_PRIVATE_KEY` | GCP service account private key (optional, for production) | - |
| `GCP_BUCKET_NAME` | Google Cloud Storage bucket (optional, for production) | `documind-uploads` |
| `JWT_SECRET` | Secret key for signing JWT tokens (at least 32 chars) | Generate with `openssl rand -base64 32` |

### 4. Create the Pinecone index

Go to your Pinecone dashboard and create an index with:
- **Name**: `your-index-name` (from `PINECONE_INDEX_NAME`)
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
3. **Ask Questions** - Type or use voice to ask questions about your document
4. **Get AI Answers** - Receive contextual responses with streaming text display
5. **Share & Export** - Share chats or export as PDF for offline access

### Under the Hood

1. **Document Processing**:
   - PDF → Text extraction (pdf-parse)
   - Text → Chunks (RecursiveCharacterTextSplitter)
   - Chunks → Embeddings (Google text-embedding-004)
   - Embeddings → Pinecone (per-chat namespace)

2. **Query Flow**:
   - User question → Query rewrite (Gemini improves clarity)
   - Rewritten query → Embedding → Pinecone similarity search
   - Retrieved context + original question → Gemini streaming → Answer (real-time display)
   - Answer saved to MongoDB

3. **Streaming Response**:
   - Backend returns Server-Sent Events (SSE) stream
   - Frontend displays tokens progressively as they arrive
   - Provides better UX with real-time feedback

4. **Voice Input**:
   - Browser Web Speech API captures audio
   - Speech recognized and appended to chat input
   - User can manually edit before sending

## 🔐 Authentication & Security

- **User Registration & Login** - Secure authentication with bcryptjs password hashing
- **JWT Tokens** - Stateless authentication with secure httpOnly cookies
- **Middleware Protection** - Edge runtime middleware verifies JWT on all protected routes
- **Automatic Redirect** - Unauthenticated users redirected to `/auth?next={originalPath}`
- **Post-Login Navigation** - Users automatically redirect to intended page after login

## 🔗 Chat Sharing

- **Share Links** - Generate unique public URLs for any chat
- **Fork on Consume** - Recipients get a copy of the chat in their account
- **Duplicate Prevention** - Same user can't import duplicate; original owner sees original
- **Consumer Tracking** - Track who consumed each shared chat

## 📥 PDF Export

- **Full Conversation Export** - Export entire chat history as formatted PDF
- **Markdown Support** - Bold, italic, and code formatting preserved in PDF
- **Multiple Pages** - Automatic page breaks for long conversations
- **Offline Access** - Keep copies of important conversations locally

## 📝 Markdown Rendering

- **Beautiful Formatting** - Render `**bold**`, `*italic*`, and `\`code\`` in chat
- **Bullet Lists** - Properly formatted bullet points and nested lists
- **Clean Display** - No raw markdown characters visible to users

## 🎙️ Voice Input

- **Hands-Free Input** - Click "Voice" button and speak naturally
- **Append Mode** - Voice text appends to existing input, not replacing
- **Real-Time Feedback** - "Listening…" indicator while recording
- **Browser Support** - Works in Chrome, Edge, Safari, and other modern browsers

---

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
  model: 'gemini-2.0-flash'  // or gemini-1.5-pro
})
```

### Voice Streaming Delay

Adjust the typing effect delay in `/app/api/chats/[chatId]/messages/route.ts`:

```typescript
await new Promise(resolve => setTimeout(resolve, 20))  // milliseconds between chunks
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

### Voice Input Not Working
- Check browser support (Chrome, Edge, Safari)
- Verify microphone permissions are granted
- Check browser console for errors

### PDF Export Fails
- Ensure html2canvas can access DOM elements
- Check for unsupported CSS functions (lab(), oklch())
- Verify message content doesn't contain problematic HTML

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/chats` | List all chats (auth required) |
| POST | `/api/chats` | Create new chat (auth required) |
| GET | `/api/chats/[chatId]` | Get chat with messages (auth required) |
| DELETE | `/api/chats/[chatId]` | Delete chat (auth required) |
| POST | `/api/chats/[chatId]/messages` | Send message, get streaming response (auth required) |
| POST | `/api/chats/[chatId]/share` | Create shareable link (auth required) |
| POST | `/api/share/consume/[publicId]` | Consume share link and fork chat (auth required) |
| POST | `/api/upload` | Upload PDF file (auth required) |
| GET | `/api/files/[filename]` | Serve uploaded file (auth required) |

**Response Format**: Streaming endpoints return `text/event-stream` with `data: {"text": "chunk"}\n\n` format

## 🚀 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `PINECONE_API_KEY`
   - `JWT_SECRET`
   - `PINECONE_INDEX_NAME`
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
- [Google Gemini](https://ai.google.dev/) - Generative AI with streaming
- [Pinecone](https://www.pinecone.io/) - Vector database
- [LangChain](https://www.langchain.com/) - LLM orchestration
- [MongoDB](https://www.mongodb.com/) - Database
- [jsPDF & html2canvas](https://github.com/parallax/jsPDF) - PDF generation
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Voice input

---

Built with ❤️ using Next.js, Gemini, and RAG
