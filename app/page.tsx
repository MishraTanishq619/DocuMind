"use client";
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { InterfaceShowcase } from './components/InterfaceShowcase';
import { TechStack } from './components/TechStack';
import { HowItWorks } from './components/HowItWorks';
import { UnderTheHood } from './components/UnderTheHood';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <ScrollProgress />
      <Hero />
      <Features />
      <InterfaceShowcase />
      <HowItWorks />
      <TechStack />
      <UnderTheHood />
      <CTA />
      <Footer />
    </div>
  );
}