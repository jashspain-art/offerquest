'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hexagon,
  Briefcase,
  LayoutDashboard,
  ExternalLink,
  FileText,
  X,
  ChevronRight,
  LogOut,
  Target,
  Sparkles,
  ArrowRight,
  ClipboardCopy,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type Status = 'pending' | 'applied' | 'interview' | 'rejected';

interface Application {
  id: string;
  status: Status;
  cover_letter: string | null;
  created_at: string;
  updated_at: string;
  jobs: {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    metadata: { salary?: string; type?: string; match_score?: number };
  } | null;
}

const COLUMNS: { id: Status; label: string; color: string; bg: string; dot: string; textColor: string }[] = [
  { id: 'pending', label: 'Saved', color: 'border-[#E5E7EB]', bg: 'bg-[#F9FAFB]', dot: 'bg-[#9CA3AF]', textColor: 'text-[#111827]' },
  { id: 'applied', label: 'Applied', color: 'border-[#BFDBFE]', bg: 'bg-[#EFF6FF]', dot: 'bg-[#2563EB]', textColor: 'text-[#1E40AF]' },
  { id: 'interview', label: 'Interview', color: 'border-[#BBF7D0]', bg: 'bg-[#F0FDF4]', dot: 'bg-[#16A34A]', textColor: 'text-[#15803D]' },
  { id: 'rejected', label: 'Rejected', color: 'border-[#FECACA]', bg: 'bg-[#FEF2F2]', dot: 'bg-[#EF4444]', textColor: 'text-[#991B1B]' },
];

export default function ApplicationsClient({
  applications: initialApplications,
  userId,
}: {
  applications: Application[];
  userId: string;
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [viewingLetter, setViewingLetter] = useState<{ title: string; company: string; letter: string } | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const moveApplication = async (appId: string, newStatus: Status) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    await supabase
      .from('applications')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', appId);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getColumnApps = (status: Status) =>
    applications.filter((a) => a.status === status);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group transition-all">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-[#111827] text-xl tracking-tighter">
              Offer<span className="text-[#2563EB]">Quest</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#111827] hover:bg-[#F3F4F6] transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-[#2563EB]" />
              <span className="hidden sm:block">Dashboard</span>
            </Link>

            <div className="h-6 w-px bg-[#E5E7EB] mx-1" />

            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl text-sm font-bold text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Mission Board</h1>
          <p className="text-[#6B7280] font-medium mt-1">
            Managing <span className="text-[#2563EB] font-bold">{applications.length} active quests</span> across your career horizon.
          </p>
        </header>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-[#E5E7EB] border-dashed">
            <div className="w-20 h-20 bg-[#F9FAFB] rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-[#9CA3AF]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">Board Empty</h2>
            <p className="text-[#6B7280] font-medium text-center max-w-xs mt-2">
              Launch your first mission from the dashboard to start tracking progress.
            </p>
            <Button asChild className="mt-8 h-12 px-8 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-2xl shadow-lg shadow-blue-500/10 active:scale-[0.98]">
              <Link href="/dashboard">Return to Mission Control <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {COLUMNS.map((col) => {
              const colApps = getColumnApps(col.id);
              return (
                <div key={col.id} className="space-y-4 min-h-[500px]">
                  {/* Column Header */}
                  <div className={`p-4 rounded-2xl border ${col.color} ${col.bg} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <span className={`text-sm font-extrabold tracking-tight uppercase ${col.textColor}`}>{col.label}</span>
                    </div>
                    <span className="text-[10px] font-black bg-white/50 px-2 py-0.5 rounded-lg border border-black/5 opacity-70">
                      {colApps.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {colApps.map((app) => (
                        <motion.div
                          key={app.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#2563EB]/20 transition-all cursor-default"
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#111827] font-bold text-base flex-shrink-0">
                              {app.jobs?.company?.charAt(0) ?? '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[#111827] text-sm font-bold truncate tracking-tight">{app.jobs?.title ?? 'Unknown Job'}</h3>
                              <p className="text-[#6B7280] text-[11px] font-semibold flex items-center gap-1 mt-0.5">
                                <span className="truncate">{app.jobs?.company}</span>
                                <span className="text-[#D1D5DB]">·</span>
                                <span className="flex-shrink-0">{formatDate(app.created_at)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
                            <div className="flex-1 flex items-center gap-2">
                              {app.cover_letter && (
                                <button
                                  onClick={() => setViewingLetter({ title: app.jobs?.title ?? 'Job', company: app.jobs?.company ?? '', letter: app.cover_letter! })}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] hover:bg-[#EDE9FE] transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  CV Letter
                                </button>
                              )}
                              
                              {app.jobs?.url && (
                                <a
                                  href={app.jobs.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] border border-transparent hover:border-[#E5E7EB] transition-all"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>

                            <div className="relative group/move">
                              <button className="p-2 rounded-xl text-[#6B7280] hover:text-[#2563EB] hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 bottom-full mb-2 hidden group-hover/move:flex flex-col gap-1 bg-white border border-[#E5E7EB] rounded-2xl p-2 min-w-[140px] shadow-xl z-20">
                                <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest px-2 py-1">Move Quest To:</p>
                                {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                                  <button
                                    key={c.id}
                                    onClick={() => moveApplication(app.id, c.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold hover:bg-[#F9FAFB] transition-colors ${c.textColor}`}
                                  >
                                    <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                                    {c.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {colApps.length === 0 && (
                      <div className="text-center py-10 text-[#9CA3AF] text-[10px] font-bold border-2 border-dashed border-[#E5E7EB] rounded-2xl">
                        NO APPLICATIONS
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AnimatePresence>
        {viewingLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setViewingLetter(null)} />
            <motion.div
              className="relative w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 text-[#7C3AED] font-bold text-sm uppercase tracking-widest mb-1">
                    <FileText className="w-4 h-4" />
                    Cover Letter Asset
                  </div>
                  <h2 className="text-2xl font-bold text-[#111827]">{viewingLetter.title}</h2>
                  <p className="text-[#6B7280] font-medium text-sm mt-0.5">{viewingLetter.company}</p>
                </div>
                <button onClick={() => setViewingLetter(null)} className="p-2 hover:bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-[#6B7280] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 h-[400px] overflow-y-auto font-medium text-[#111827] text-sm leading-relaxed scrollbar-thin">
                <pre className="whitespace-pre-wrap font-sans">{viewingLetter.letter}</pre>
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => navigator.clipboard.writeText(viewingLetter.letter)}
                  className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all"
                >
                  <ClipboardCopy className="w-4 h-4 mr-2" />
                  Copy Asset to Clipboard
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
