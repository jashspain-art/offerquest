'use client';

import { motion } from 'framer-motion';
import { Hexagon, Zap, Target, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 sticky top-0 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hexagon className="text-blue-500 w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">Offer<span className="text-blue-500">Quest</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">SignIn</Link>
            <Link href="/signup">
              <Button className="bg-white text-slate-950 hover:bg-slate-200 h-9 rounded-full px-5 font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Start Quest
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
        >
          <Zap className="w-4 h-4" />
          <span>The Next Generation AI Job Engine</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-black tracking-tighter max-w-4xl leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Level up your career with AI-powered hunting
        </motion.h1>

        <motion.p 
          className="mt-6 text-xl text-slate-400 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Turn job searching into a game. Upload your CV, complete missions, and let our AI agents tailor your cover letters to land your dream role.
        </motion.p>

        <motion.div 
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] group">
              Start Your Quest Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <FeatureCard 
            icon={<Target className="text-blue-500 w-8 h-8" />}
            title="Precision Matching"
            desc="Our AI parses your CV and matches you directly with the highest-converting job listings from global boards."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Briefcase className="text-purple-500 w-8 h-8" />}
            title="Auto-Tailored Cover Letters"
            desc="Instantly generate highly personalized cover letters that align your experience to the exact job description."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Hexagon className="text-green-500 w-8 h-8" />}
            title="Mission Control Dashboard"
            desc="Track applications, earn XP, maintain streaks, and level up your strategy in our gamified interface."
            delay={0.6}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm group hover:bg-slate-800/80 transition-colors"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  )
}
