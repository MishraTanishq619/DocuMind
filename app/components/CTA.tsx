import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

export function CTA() {
  return (
    <section id="cta" className="py-24 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"
      ></motion.div>
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-10 w-96 h-96 bg-purple-900 rounded-full blur-3xl"
      ></motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full mb-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span>Start Your Free Trial Today</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-5xl text-white mb-6"
          >
            Ready to Transform How You Work with Documents?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of professionals who are already using DocuMind to unlock insights from their documents faster than ever before.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/chat" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 block">
                Get Started Free
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent text-white rounded-lg border-2 border-white hover:bg-white/10 transition-colors"
            >
              Schedule a Demo
            </motion.button>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-blue-100 mt-6"
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>
        </div>
      </div>
    </section>
  );
}