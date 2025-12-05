import { Upload, MessageCircle, Brain, Lock, Zap, FileText } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MessageSquare, Upload as UploadIcon, Bot, Database, Palette, RefreshCw, Eye, FolderTree, Trash2, Activity } from 'lucide-react';
import { useRef } from 'react';

const features = [
  {
    icon: MessageSquare,
    title: 'Multi-Chat Interface',
    description: 'Create and manage multiple chat sessions simultaneously for different documents.',
  },
  {
    icon: UploadIcon,
    title: 'PDF Upload & Indexing',
    description: 'Upload PDF documents with automatic vectorization to Pinecone for intelligent search.',
  },
  {
    icon: Bot,
    title: 'AI-Powered Responses',
    description: 'Get accurate answers grounded in your document content using Google Gemini 2.0.',
  },
  {
    icon: Database,
    title: 'Persistent Storage',
    description: 'All chats, messages, and document metadata saved to MongoDB for reliability.',
  },
  {
    icon: Palette,
    title: 'Beautiful UI',
    description: 'Modern, responsive interface with resizable panels and smooth animations.',
  },
  {
    icon: RefreshCw,
    title: 'Smart Query Rewriting',
    description: 'Automatic query enhancement for better retrieval results and accuracy.',
  },
  {
    icon: Eye,
    title: 'Document Viewer',
    description: 'Preview your uploaded PDFs directly in the app without switching windows.',
  },
  {
    icon: FolderTree,
    title: 'Per-Chat Namespaces',
    description: 'Isolated vector storage for each chat session ensuring data separation.',
  },
  {
    icon: Trash2,
    title: 'Chat Management',
    description: 'Delete chats with automatic cleanup of files and vectors for clean storage.',
  },
  {
    icon: Activity,
    title: 'Real-time Indexing Status',
    description: 'Visual feedback during document processing so you know exactly what\'s happening.',
  },
];

export function Features() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="features" ref={containerRef} className="py-24 bg-white relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div
        style={{ y, opacity }}
        className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-30"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]), opacity }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-slate-900 mb-4">
            Everything You Need to Master Your Documents
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to make document analysis effortless and intelligent
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 hover:border-blue-300 transition-all"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
              >
                <feature.icon className="w-6 h-6 text-blue-600" />
              </motion.div>
              <h3 className="text-xl text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}