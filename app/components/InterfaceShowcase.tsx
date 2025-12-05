import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Maximize2, Layout, FileText, MessageSquare, Sparkles } from 'lucide-react';

const interfaceFeatures = [
  {
    icon: Layout,
    title: 'Resizable Panels',
    description: 'Customize your workspace with fully resizable sidebars',
    position: { top: '20%', left: '10%' }
  },
  {
    icon: MessageSquare,
    title: 'Multi-Chat Sessions',
    description: 'Switch between multiple document conversations instantly',
    position: { top: '15%', left: '-5%' }
  },
  {
    icon: FileText,
    title: 'Live PDF Preview',
    description: 'View your documents while you chat for better context',
    position: { top: '20%', right: '10%' }
  },
  {
    icon: Sparkles,
    title: 'Smart Responses',
    description: 'AI-powered answers with source citations from your document',
    position: { bottom: '25%', left: '50%', transform: 'translateX(-50%)' }
  },
];

export function InterfaceShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full filter blur-3xl opacity-20"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-80, 80]), opacity }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-200 to-pink-200 rounded-full filter blur-3xl opacity-20"
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
            Intuitive Interface, Powerful Features
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A beautifully designed workspace that puts everything you need at your fingertips
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Main interface showcase */}
          <motion.div
            style={{ scale }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-20 blur-xl"></div>
            
            {/* Interface image */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              <motion.img
                src={'4a5d7585b557a7334b352c3d0f172bca078aa237.png'}
                alt="DocuMind Chat Interface"
                className="w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Floating feature callouts */}
            {interfaceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.8 + index * 0.15,
                  type: "spring",
                  stiffness: 200
                }}
                style={feature.position}
                className="absolute hidden lg:block"
              >
                <motion.div
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 max-w-xs backdrop-blur-sm bg-white/95"
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <feature.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-sm text-slate-900 mb-1">{feature.title}</h4>
                      <p className="text-xs text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                  {/* Arrow pointing to feature */}
                  <div className="absolute w-2 h-2 bg-white border-r border-b border-slate-200 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature grid below */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {interfaceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200 lg:hidden"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Additional UI highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid md:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="text-lg text-slate-900 mb-2">Real-time Processing</h4>
              <p className="text-sm text-slate-600">
                Watch your documents get indexed with live status updates
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="text-lg text-slate-900 mb-2">Modern Design</h4>
              <p className="text-sm text-slate-600">
                Clean, intuitive interface built with the latest design principles
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl p-6 border border-pink-200">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="text-lg text-slate-900 mb-2">Responsive Layout</h4>
              <p className="text-sm text-slate-600">
                Works seamlessly on desktop, tablet, and mobile devices
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
