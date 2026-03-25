import { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand / Logo */}
      <div className="z-10 mb-10 text-center flex flex-col items-center gap-4">
        <Link href="/" className="flex flex-col items-center gap-4 group transition-all active:scale-95">
          <div className="h-16 w-16 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-center shadow-xl shadow-black/5 group-hover:border-[#2563EB]/20 transition-all">
            <Sparkles className="text-[#2563EB] w-8 h-8 fill-[#2563EB]/10" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tightest text-[#111827]">
              Offer<span className="text-[#2563EB]">Quest</span>
            </h1>
          </div>
        </Link>
        <p className="text-[#6B7280] text-sm font-medium max-w-[280px]">
          Identify. Apply. Conquer. <br/>
          Your journey to the top starts here.
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="z-10 w-full max-w-[440px] px-6 pb-12">
        <div className="bg-white border border-[#E5E7EB] rounded-[2rem] p-10 shadow-2xl shadow-black/[0.03] relative overflow-hidden">
          {children}
        </div>
        
        <p className="mt-8 text-center text-[#9CA3AF] text-xs font-bold uppercase tracking-widest">
          Secure cloud infrastructure by Supabase
        </p>
      </div>
    </div>
  )
}
