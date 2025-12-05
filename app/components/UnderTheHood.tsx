import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { FileText, Scissors, Layers, Database, Search, ArrowRight, MessageSquare, Zap } from 'lucide-react';

const documentProcessing = [
  { icon: FileText, label: 'PDF', description: 'Extract text' },
  { icon: Scissors, label: 'Text', description: 'Split into chunks' },
  { icon: Layers, label: 'Chunks', description: 'Generate embeddings' },
  { icon: Database, label: 'Pinecone', description: 'Store vectors' },
];

const queryFlow = [
  { icon: MessageSquare, label: 'Question', description: 'User asks' },
  { icon: Zap, label: 'Rewrite', description: 'Gemini enhances' },
  { icon: Search, label: 'Search', description: 'Find relevant chunks' },
  { icon: Layers, label: 'Context', description: 'Combine with question' },
  { icon: Zap, label: 'Generate', description: 'Gemini answers' },
  { icon: Database, label: 'Save', description: 'Store in MongoDB' },
];

export function UnderTheHood() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute top-10 left-10 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-100 rounded-full filter blur-3xl opacity-20"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-slate-900 mb-4">Under the Hood</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powered by advanced AI and vector search technology
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-20">
          {/* Document Processing Pipeline */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl text-slate-900 mb-8 text-center"
            >
              📄 Document Processing
            </motion.h3>
            <div className="relative">
              {/* Flow line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transform -translate-y-1/2 origin-left hidden md:block"
              />

              <div className="grid md:grid-cols-4 gap-6 relative">
                {documentProcessing.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="relative"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <step.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h4 className="text-xl text-slate-900 mb-2">{step.label}</h4>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                    {index < documentProcessing.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.3 }}
                        className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10"
                      >
                        <ArrowRight className="w-6 h-6 text-purple-500" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Query Flow */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl text-slate-900 mb-8 text-center"
            >
              🔍 Query Flow
            </motion.h3>
            <div className="relative">
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
                {queryFlow.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 shadow-md border border-slate-200 text-center h-full flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                        }}
                        transition={{ 
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center mb-3"
                      >
                        <step.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h4 className="text-sm text-slate-900 mb-1">{step.label}</h4>
                      <p className="text-xs text-slate-600">{step.description}</p>
                      
                      {/* Step number */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                    </div>
                    {index < queryFlow.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10"
                      >
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200"
          >
            <h3 className="text-2xl text-slate-900 mb-6 text-center">Key Technologies</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="text-3xl mb-3">🔤</div>
                <h4 className="text-lg text-slate-900 mb-2">Text Embedding</h4>
                <p className="text-sm text-slate-600">Google text-embedding-004 with 768 dimensions for semantic search</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="text-3xl mb-3">✂️</div>
                <h4 className="text-lg text-slate-900 mb-2">Text Splitting</h4>
                <p className="text-sm text-slate-600">RecursiveCharacterTextSplitter for optimal chunk sizes</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="text-lg text-slate-900 mb-2">AI Generation</h4>
                <p className="text-sm text-slate-600">Gemini 2.0 Flash for query rewriting and response generation</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
