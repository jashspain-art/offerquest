'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Hexagon,
  Search,
  Filter,
  LayoutGrid,
  List,
  Briefcase,
  Target,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { GamificationHeader } from '@/components/GamificationHeader';
import { JobCard } from '@/components/JobCard';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  job_preferences?: { summary?: string; skills?: string[] };
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  metadata: { salary?: string; type?: string; match_score?: number; tags?: string[] };
}

export default function DashboardClient({
  profile,
  userId,
  jobs,
  appliedJobIds,
}: {
  profile: Profile;
  userId: string;
  jobs: Job[];
  appliedJobIds: string[];
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'remote' | 'london' | 'top'>('all');
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set(appliedJobIds));
  const [profileXp, setProfileXp] = useState(profile.xp);
  const [profileLevel, setProfileLevel] = useState(profile.level);
  const supabase = createClient();
  const router = useRouter();

  const handleApply = (jobId: string) => {
    setAppliedIds((prev) => new Set([...prev, jobId]));
    setProfileXp((prev) => prev + 50);
    if ((profileXp + 50) >= profileLevel * 500) {
      setProfileLevel((prev) => prev + 1);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'remote' && job.location.toLowerCase().includes('remote')) ||
      (filter === 'london' && job.location.toLowerCase().includes('london')) ||
      (filter === 'top' && (job.metadata?.match_score ?? 0) >= 85);

    return matchesSearch && matchesFilter;
  });

  const userProfile = {
    name: profile.name ?? 'Quester',
    summary: profile.job_preferences?.summary,
    skills: profile.job_preferences?.skills,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
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
              href="/applications"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:block">Applications</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Gamification Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GamificationHeader
            name={profile.name ?? 'Quester'}
            xp={profileXp}
            level={profileLevel}
            streak={profile.streak ?? 1}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { label: 'Jobs Available', value: jobs.length, icon: <Briefcase className="w-5 h-5 text-blue-400" /> },
            { label: 'Applied', value: appliedIds.size, icon: <Target className="w-5 h-5 text-green-400" /> },
            { label: 'Top Matches', value: jobs.filter((j) => (j.metadata?.match_score ?? 0) >= 85).length, icon: <Hexagon className="w-5 h-5 text-purple-400" /> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(['all', 'top', 'remote', 'london'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {f === 'top' ? '🏆 Top Matches' : f === 'all' ? '✦ All Jobs' : f === 'remote' ? '🌍 Remote' : '🏙️ London'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Job Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No jobs match your search</p>
            <p className="text-sm mt-1">Try changing your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                userId={userId}
                userProfile={userProfile}
                index={index}
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
