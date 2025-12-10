"use client"

import { MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

export function Hero() {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="container mx-auto px-6 py-6 border-b border-slate-200/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">DocuMind</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-12">
            <a href="#features" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">How It Works</a>
            <a href="#cta" className="text-slate-700 hover:text-slate-900 transition-colors font-medium">Get Started</a>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
            onClick={() => {
              router.push('/auth')
            }}
            type="button"
            aria-label="Sign in"
          >
            Sign In
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Content */}
      <div className="container mx-auto px-6 pt-20 pb-32 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-100/80 border border-blue-300/50 text-blue-700 rounded-full mb-6 backdrop-blur-sm"
            >
              ✨ AI-Powered Document Intelligence
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 leading-tight"
            >
              Chat with Your Documents
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl"
            >
              Upload PDFs, reports, and documents. Ask questions. Get instant, intelligent answers powered by advanced RAG technology with Google Gemini 2.0, real-time streaming, and voice input.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div 
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/chat" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 block font-semibold shadow-xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.a 
                href="#features"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-slate-200/60 text-slate-900 rounded-lg border-2 border-slate-300 hover:border-slate-400 transition-all backdrop-blur-sm font-semibold cursor-pointer"
              >
                Learn More
              </motion.a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-6 mt-10"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm text-slate-600">Real-time Streaming</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm text-slate-600">Voice Input</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm text-slate-600">PDF Export</span>
              </div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 100, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="relative hidden lg:block"
          >
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-3xl blur-2xl"
            ></motion.div>
            <div className="relative bg-white/60 backdrop-blur-xl border border-slate-200/50 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-200 rounded w-full"></div>
                  <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                  <div className="h-2 bg-blue-300/60 rounded w-3/4 mt-4"></div>
                  <div className="h-2 bg-blue-200/60 rounded w-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full filter blur-3xl"
        ></motion.div>
      </div>
    </div>
  );
}