import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Hexagon } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/80 to-slate-950 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl z-0" />

      {/* Brand */}
      <div className="z-10 mb-8 mt-12 text-center flex flex-col items-center gap-3">
        <div className="h-16 w-16 bg-blue-600/20 border border-blue-500/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] backdrop-blur-md">
          <Hexagon className="text-blue-500 w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Offer<span className="text-blue-500">Quest</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-[280px]">
            Your gamified, AI-powered journey to the perfect job starts here.
          </p>
        </div>
      </div>

      <div className="z-10 w-full max-w-md px-6 pb-12">
        <div className="bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 pointer-events-none" />
          {children}
        </div>
      </div>
    </div>
  )
}
