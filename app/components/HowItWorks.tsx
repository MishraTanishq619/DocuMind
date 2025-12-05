import { Upload, Cpu, MessageSquare } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { PlusCircle, Upload as UploadIcon, MessageCircle, Sparkles } from 'lucide-react';
import { useRef } from 'react';

const steps = [
  {
    icon: PlusCircle,
    title: 'Create a Chat',
    description: 'Start by creating a new chat session for your document analysis.',
    number: '01',
  },
  {
    icon: UploadIcon,
    title: 'Upload a PDF',
    description: 'Drag and drop a PDF document. It will be automatically indexed to Pinecone.',
    number: '02',
  },
  {
    icon: MessageCircle,
    title: 'Ask Questions',
    description: 'Type questions about your document and get instant, contextual answers.',
    number: '03',
  },
  {
    icon: Sparkles,
    title: 'Get AI Answers',
    description: 'Receive contextual responses powered by Google Gemini based on your document.',
    number: '04',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Parallax decorations */}
      <motion.div
        style={{ y }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-200 to-purple-200 rounded-full filter blur-3xl opacity-20"
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
            How DocuMind Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started in four simple steps and unlock the power of your documents
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-purple-400 origin-left"
          ></motion.div>

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              className="relative"
            >
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto relative z-10"
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.3, type: "spring" }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 z-20"
                  >
                    <span className="text-xs">{step.number}</span>
                  </motion.div>
                </div>
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.4 }}
                  className="text-2xl text-slate-900 mb-3"
                >
                  {step.title}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                  className="text-slate-600"
                >
                  {step.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}