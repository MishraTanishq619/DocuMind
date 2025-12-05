import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Code, Server, Brain, Database as DatabaseIcon } from 'lucide-react';

const techStack = {
  frontend: [
    { name: 'Next.js 15', description: 'App Router' },
    { name: 'React 19', description: 'Latest React' },
    { name: 'TypeScript', description: 'Type Safety' },
    { name: 'Tailwind CSS', description: 'Styling' },
  ],
  backend: [
    { name: 'Google Gemini 2.0', description: 'AI Generation' },
    { name: 'Pinecone', description: 'Vector Database' },
    { name: 'LangChain', description: 'Document Processing' },
    { name: 'MongoDB', description: 'Data Persistence' },
    { name: 'pdf-parse', description: 'PDF Extraction' },
  ],
};

export function TechStack() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={containerRef} className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Animated background grid */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl mb-4">Built with Modern Technology</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Powered by cutting-edge AI and cloud infrastructure
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Frontend Stack */}
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-2xl">Frontend</h3>
              </div>
              <div className="space-y-4">
                {techStack.frontend.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    className="flex justify-between items-center p-4 rounded-lg transition-all"
                  >
                    <span className="text-lg">{tech.name}</span>
                    <span className="text-sm text-slate-400">{tech.description}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Backend & AI Stack */}
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [100, -100]) }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-2xl">Backend & AI</h3>
              </div>
              <div className="space-y-4">
                {techStack.backend.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: -10, backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
                    className="flex justify-between items-center p-4 rounded-lg transition-all"
                  >
                    <span className="text-lg">{tech.name}</span>
                    <span className="text-sm text-slate-400">{tech.description}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </section>
  );
}
