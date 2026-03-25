'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  Zap,
  Globe,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { GamificationHeader } from '@/components/GamificationHeader';
import { JobCard } from '@/components/JobCard';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-[#2563EB]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[25%] h-[25%] bg-[#6366F1]/5 rounded-full blur-[100px]" />
      </div>

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
              href="/applications"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#111827] hover:bg-[#F3F4F6] transition-all"
            >
              <Target className="w-4 h-4 text-[#2563EB]" />
              <span className="hidden sm:block">My Mission Board</span>
            </Link>

            <div className="h-6 w-px bg-[#E5E7EB] mx-1" />

            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-xl text-sm font-bold text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-all"
            >
              <LogOut className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Hero Section / Header */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-[#111827] tracking-tight">Mission Control</h1>
              <p className="text-[#6B7280] font-medium">Identify matches, generate assets, and track your conquest.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <GamificationHeader
              name={profile.name ?? 'Quester'}
              xp={profileXp}
              level={profileLevel}
              streak={profile.streak ?? 1}
            />
          </motion.div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              label: 'Scouted Jobs', 
              value: jobs.length, 
              icon: <Briefcase className="w-5 h-5 text-[#2563EB]" />, 
              color: 'bg-[#DBEAFE]',
              description: 'Fresh opportunities'
            },
            { 
              label: 'Active Missions', 
              value: appliedIds.size, 
              icon: <Target className="w-5 h-5 text-[#16A34A]" />, 
              color: 'bg-[#DCFCE7]',
              description: 'Applications sent'
            },
            { 
              label: 'Elite Matches', 
              value: jobs.filter((j) => (j.metadata?.match_score ?? 0) >= 85).length, 
              icon: <Sparkles className="w-5 h-5 text-[#7C3AED]" />, 
              color: 'bg-[#F5F3FF]',
              description: 'Over 85% score'
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mt-1">Live Update</div>
              </div>
              <h3 className="text-3xl font-black text-[#111827] tabular-nums">{stat.value}</h3>
              <p className="text-sm font-bold text-[#111827] mt-1">{stat.label}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Tools & Feed Header */}
        <div className="pt-4 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {(['all', 'top', 'remote', 'london'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-sm font-bold whitespace-nowrap pb-2 outline-none transition-all border-b-2 ${
                    filter === f
                      ? 'text-[#2563EB] border-[#2563EB]'
                      : 'text-[#6B7280] border-transparent hover:text-[#111827]'
                  }`}
                >
                  {f === 'top' ? 'Elite Matches' : f === 'all' ? 'All Roles' : f === 'remote' ? 'Remote Only' : 'London Hub'}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#2563EB] transition-colors" />
              <input
                type="text"
                placeholder="Search command center..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-[#2563EB] transition-all outline-none"
              />
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredJobs.length === 0 ? (
              <motion.div 
                className="text-center py-24 bg-white rounded-3xl border border-[#E5E7EB] border-dashed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-[#9CA3AF]" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Area Clear</h3>
                <p className="text-[#6B7280] font-medium mt-1">No matches found in this sector. Try different coordinates.</p>
                <Button 
                  onClick={() => { setSearch(''); setFilter('all'); }}
                  variant="outline" 
                  className="mt-6 border-[#E5E7EB] font-bold text-[#111827] rounded-xl"
                >
                  Reset Sensors
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
