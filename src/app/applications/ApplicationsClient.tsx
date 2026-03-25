'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Hexagon,
  Briefcase,
  LayoutDashboard,
  ExternalLink,
  FileText,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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

const COLUMNS: { id: Status; label: string; color: string; bg: string; dot: string }[] = [
  { id: 'pending', label: 'Saved', color: 'text-slate-300', bg: 'bg-slate-800/40', dot: 'bg-slate-500' },
  { id: 'applied', label: 'Applied', color: 'text-blue-300', bg: 'bg-blue-500/5', dot: 'bg-blue-500' },
  { id: 'interview', label: 'Interview', color: 'text-green-300', bg: 'bg-green-500/5', dot: 'bg-green-500' },
  { id: 'rejected', label: 'Rejected', color: 'text-red-400', bg: 'bg-red-500/5', dot: 'bg-red-500' },
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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Hexagon className="text-blue-500 w-5 h-5" />
            <span className="font-bold text-base tracking-tight">
              Offer<span className="text-blue-500">Quest</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:block">Dashboard</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black text-white tracking-tight">Application Tracker</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
          </p>
        </motion.div>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Briefcase className="w-16 h-16 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-400">No applications yet</h2>
            <p className="text-slate-500 text-sm text-center max-w-xs">
              Go to the dashboard and apply to your first job to start tracking here.
            </p>
            <Link
              href="/dashboard"
              className="mt-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
            >
              Go to Dashboard →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLUMNS.map((col) => {
              const colApps = getColumnApps(col.id);
              return (
                <div key={col.id} className={`rounded-2xl border border-slate-800 ${col.bg} p-4`}>
                  {/* Column Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className={`text-sm font-bold ${col.color}`}>{col.label}</span>
                    <span className="ml-auto text-xs text-slate-600 font-medium bg-slate-800 px-2 py-0.5 rounded-full">
                      {colApps.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {colApps.map((app, i) => (
                      <motion.div
                        key={app.id}
                        className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        {/* Job Info */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {app.jobs?.company?.charAt(0) ?? '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate leading-tight">
                              {app.jobs?.title ?? 'Unknown Job'}
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">{app.jobs?.company}</p>
                          </div>
                        </div>

                        {/* Date & links */}
                        <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                          <span>{formatDate(app.created_at)}</span>
                          {app.jobs?.metadata?.salary && (
                            <>
                              <span>·</span>
                              <span className="text-green-500/80">{app.jobs.metadata.salary}</span>
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          {app.cover_letter && (
                            <button
                              onClick={() =>
                                setViewingLetter({
                                  title: app.jobs?.title ?? 'Job',
                                  company: app.jobs?.company ?? '',
                                  letter: app.cover_letter!,
                                })
                              }
                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              Letter
                            </button>
                          )}

                          {app.jobs?.url && (
                            <a
                              href={app.jobs.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-lg text-slate-600 hover:text-slate-400 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Move menu */}
                          <div className="ml-auto relative group/move">
                            <button className="p-1 rounded-lg text-slate-600 hover:text-slate-400 transition-colors">
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 hidden group-hover/move:flex flex-col gap-1 bg-slate-800 border border-slate-700 rounded-xl p-2 min-w-[120px] shadow-2xl z-20">
                              {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => moveApplication(app.id, c.id)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors ${c.color}`}
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

                    {colApps.length === 0 && (
                      <div className="text-center py-8 text-slate-700 text-xs">
                        Nothing here yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Cover Letter Modal */}
      {viewingLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Cover Letter</h2>
                <p className="text-sm text-slate-400">
                  {viewingLetter.title} · {viewingLetter.company}
                </p>
              </div>
              <button
                onClick={() => setViewingLetter(null)}
                className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 max-h-80 overflow-y-auto">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {viewingLetter.letter}
              </p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(viewingLetter.letter)}
              className="mt-4 w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Copy to Clipboard
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
