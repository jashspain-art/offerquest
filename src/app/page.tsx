'use client';

import { motion } from 'framer-motion';
import { Hexagon, Zap, Target, Briefcase, ArrowRight, Sparkles, Shield, Rocket, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] relative overflow-hidden font-sans">
      {/* Premium Background Elements */}
      <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 sticky top-0 bg-white/70 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-[#111827]">
              Offer<span className="text-[#2563EB]">Quest</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-[#6B7280] hover:text-[#111827] transition-colors">Sign In</Link>
            <Link href="/signup">
              <Button className="bg-[#111827] text-white hover:bg-[#111827]/90 h-11 rounded-xl px-6 font-bold shadow-xl shadow-black/5 transition-all active:scale-95">
                Start Questing
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] shadow-sm text-[#2563EB] text-xs font-bold uppercase tracking-widest mb-10"
        >
          <Sparkles className="w-4 h-4 fill-[#2563EB]" />
          <span>Meet the Future of Job Hunting</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          className="text-6xl md:text-8xl font-black tracking-tightest max-w-5xl leading-[0.95] text-[#111827]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Level Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Career Hunt</span> With AI
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          className="mt-8 text-xl text-[#6B7280] max-w-2xl font-medium leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          OfferQuest turns job searching into a high-octane RPG. Upload your CV, deploy AI agents to tailor your cover letters, and track your conquest with a gamified command center.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link href="/signup">
            <Button size="lg" className="h-16 px-10 text-lg rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-2xl shadow-blue-500/30 font-bold group transition-all active:scale-[0.98]">
              Join the Quest
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="ghost" size="lg" className="h-16 px-10 text-lg rounded-2xl text-[#111827] font-bold hover:bg-[#F3F4F6] transition-all">
            See the Demo
          </Button>
        </motion.div>

        {/* Social Proof Placeholder */}
        <motion.div 
          className="mt-20 pt-10 border-t border-[#E5E7EB] w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF] mb-8">Trusted by hunters at top tech hubs</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale pointer-events-none">
            {['Stripe', 'Linear', 'Notion', 'Vercel', 'Figma'].map(brand => (
              <span key={brand} className="text-2xl font-black text-[#111827] tracking-tighter">{brand}</span>
            ))}
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <FeatureCard 
            icon={<Target className="text-[#2563EB] w-7 h-7" />}
            title="Smarter Missions"
            desc="Our AI scouts the globe to find roles that match your DNA perfectly. No more manual sifting."
            delay={0.6}
            accent="bg-blue-50"
          />
          <FeatureCard 
            icon={<Zap className="text-[#06B6D4] w-7 h-7" />}
            title="Instant Assets"
            desc="Generate high-conversion cover letters in seconds. Tailored to the job, written for impact."
            delay={0.7}
            accent="bg-cyan-50"
          />
          <FeatureCard 
            icon={<Rocket className="text-[#6366F1] w-7 h-7" />}
            title="Gamified Growth"
            desc="Earn XP for every application. Track your streaks, level up your rank, and stay motivated."
            delay={0.8}
            accent="bg-indigo-50"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E5E7EB] bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Hexagon className="w-5 h-5" />
            <span className="font-bold tracking-tight">OfferQuest</span>
          </div>
          <p className="text-[#6B7280] text-sm font-medium">© 2026 OfferQuest Corp. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-bold text-[#6B7280]">
            <a href="#" className="hover:text-[#111827]">Privacy</a>
            <a href="#" className="hover:text-[#111827]">Terms</a>
            <a href="#" className="hover:text-[#111827]">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay, accent }: { icon: React.ReactNode, title: string, desc: string, delay: number, accent: string }) {
  return (
    <motion.div 
      className="p-10 rounded-[2.5rem] bg-white border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:border-[#2563EB]/20 transition-all duration-500 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className={`w-14 h-14 rounded-2xl ${accent} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-[#111827] mb-4 tracking-tight">{title}</h3>
      <p className="text-[#6B7280] font-medium leading-relaxed">{desc}</p>
      <div className="mt-8 flex items-center gap-2 text-[#2563EB] font-bold text-sm cursor-pointer group/link">
        Learn more 
        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  )
}
