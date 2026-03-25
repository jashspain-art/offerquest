'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { signup } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { User, Mail, KeyRound, ArrowRight, Loader2, Sparkles } from 'lucide-react';

function SignupForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-[#111827] tracking-tight mb-2">Join the Elite</h2>
        <p className="text-[#6B7280] text-sm font-medium">Create your credentials and start questing</p>
      </div>

      <form action={signup} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] ml-1">Hero Persona (Full Name)</Label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#2563EB] transition-colors" />
            <Input 
              id="name" 
              name="name" 
              type="text" 
              required 
              placeholder="Commander John Shepard"
              className="h-12 pl-11 bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus-visible:ring-4 focus-visible:ring-blue-500/5 focus-visible:border-[#2563EB] rounded-2xl font-medium transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] ml-1">Base Communication (Email)</Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#2563EB] transition-colors" />
            <Input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              placeholder="pilot@offerquest.io"
              className="h-12 pl-11 bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus-visible:ring-4 focus-visible:ring-blue-500/5 focus-visible:border-[#2563EB] rounded-2xl font-medium transition-all"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-[#9CA3AF] ml-1">Secure Key (Password)</Label>
          <div className="relative group">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] group-focus-within:text-[#2563EB] transition-colors" />
            <Input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="new-password" 
              required 
              placeholder="••••••••"
              className="h-12 pl-11 bg-[#F9FAFB] border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus-visible:ring-4 focus-visible:ring-blue-500/5 focus-visible:border-[#2563EB] rounded-2xl font-medium transition-all"
            />
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            {error}
          </motion.div>
        )}

        <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-14 rounded-2xl text-sm font-bold transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98] mt-2 group">
          Finalize Recruitment
          <Sparkles className="ml-2 w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
        </Button>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-[#6B7280]">
        Already enlisted?{' '}
        <Link href="/login" className="text-[#2563EB] hover:text-[#1D4ED8] font-bold transition-colors">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" /></div>}>
      <SignupForm />
    </Suspense>
  )
}
