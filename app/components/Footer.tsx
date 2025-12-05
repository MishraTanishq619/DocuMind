import { MessageSquare, Twitter, Linkedin, Github } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <span className="text-lg text-white">DocuMind</span>
            </div>
            <p className="text-sm">
              AI-powered document intelligence for modern teams.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm">© 2025 DocuMind. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.2, color: "#60a5fa" }}
              className="hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.2, color: "#60a5fa" }}
              className="hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.2, color: "#60a5fa" }}
              className="hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}