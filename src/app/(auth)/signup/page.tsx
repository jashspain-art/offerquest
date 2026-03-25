'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { signup } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

function SignupForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-slate-400 text-sm">Join the quest for your dream job</p>
      </div>

      <form action={signup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-300">Hero Name (Full Name)</Label>
          <Input 
            id="name" 
            name="name" 
            type="text" 
            required 
            placeholder="John Doe"
            className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">Email Address</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            autoComplete="email" 
            required 
            placeholder="pilot@offerquest.io"
            className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300">Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            autoComplete="new-password" 
            required 
            placeholder="••••••••"
            className="bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 rounded-xl h-12"
          />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
            {error}
          </motion.div>
        )}

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl mt-4 text-md font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]">
          Create Profile
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Sign In
        </Link>
      </div>
    </motion.div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
