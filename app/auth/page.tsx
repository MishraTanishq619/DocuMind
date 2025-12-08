"use client";
import { AuthPage } from '../components/AuthPage';
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'

export default function App() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4 relative">
      <motion.button
        type="button"
        onClick={() => router.push('/')}
        aria-label="Back to home"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white shadow"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      <AuthPage />
    </div>
  );
}