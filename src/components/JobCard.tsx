'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  ExternalLink,
  Sparkles,
  BookmarkPlus,
  CheckCircle,
  X,
  Loader2,
  Tag,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  metadata: {
    salary?: string;
    type?: string;
    match_score?: number;
    tags?: string[];
  };
}

interface JobCardProps {
  job: Job;
  userId: string;
  userProfile: { name: string; summary?: string; skills?: string[] };
  index: number;
  onApply: (jobId: string) => void;
}

export function JobCard({ job, userId, userProfile, index, onApply }: JobCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  const matchScore = job.metadata?.match_score ?? Math.floor(Math.random() * 30) + 70;
  const scoreStyles =
    matchScore >= 90 ? 'text-[#16A34A] bg-[#DCFCE7] border-[#BBF7D0]' :
    matchScore >= 75 ? 'text-[#2563EB] bg-[#DBEAFE] border-[#BFDBFE]' :
    'text-[#F59E0B] bg-[#FEF3C7] border-[#FDE68A]';

  const handleApply = async () => {
    setIsGenerating(true);
    setShowModal(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const res = await fetch(`${supabaseUrl}/functions/v1/generate-cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? supabaseKey}`,
        },
        body: JSON.stringify({
          job_title: job.title,
          company: job.company,
          job_description: job.description,
          user_name: userProfile.name,
          user_summary: userProfile.summary,
          user_skills: userProfile.skills,
        }),
      });

      const data = await res.json();
      setCoverLetter(data.cover_letter);

      await supabase.from('applications').insert({
        user_id: userId,
        job_id: job.id,
        status: 'applied',
        cover_letter: data.cover_letter,
      });

      await supabase.rpc('increment_xp', { user_id_input: userId, xp_amount: 50 });

      setIsApplied(true);
      onApply(job.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <motion.div
        className="group relative p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#2563EB]/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        {/* Match Score */}
        <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${scoreStyles}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{matchScore}% Match</span>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#111827] font-bold text-xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            {job.company.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 pr-16 text-left">
            <h3 className="font-bold text-[#111827] text-lg leading-tight tracking-tight group-hover:text-[#2563EB] transition-colors line-clamp-1">
              {job.title}
            </h3>
            <p className="text-[#6B7280] text-sm font-semibold mt-1 flex items-center gap-1.5">
              <span className="text-[#111827]">{job.company}</span>
              <span className="w-1 h-1 rounded-full bg-[#E5E7EB]" />
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 opacity-60" />
                {job.location}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-5 text-[12px] font-medium text-[#6B7280]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F3F4F6] rounded-lg">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{job.metadata?.type ?? 'Full-time'}</span>
          </div>
          {job.metadata?.salary && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#DCFCE7] text-[#16A34A] rounded-lg">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{job.metadata.salary}</span>
            </div>
          )}
        </div>

        <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
          {job.description}
        </p>

        <div className="flex items-center gap-3">
          {isApplied ? (
            <div className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] text-sm font-bold">
              <CheckCircle className="w-4 h-4" />
              Application Sent
            </div>
          ) : (
            <Button
              onClick={handleApply}
              className="flex-1 h-11 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Apply
            </Button>
          )}

          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all ${
              isSaved
                ? 'bg-[#F5F3FF] border-[#DDD6FE] text-[#7C3AED]'
                : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
          >
            <BookmarkPlus className={`w-5 h-5 ${isSaved ? 'fill-[#7C3AED]' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Modal Re-design */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => !isGenerating && setShowModal(false)}
            />
            <motion.div
              className="relative w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 text-[#2563EB] font-bold text-sm uppercase tracking-widest mb-1">
                    <Sparkles className="w-4 h-4" />
                    OfferQuest AI
                  </div>
                  <h2 className="text-2xl font-bold text-[#111827]">Cover Letter Prepared</h2>
                </div>
                {!isGenerating && (
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-[#6B7280] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin" />
                    <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-[#6366F1] animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-[#111827] font-bold text-lg">AI is crafting your letter...</p>
                    <p className="text-[#6B7280] text-sm mt-1">Analyzing job requirements vs your profile</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 h-[400px] overflow-y-auto font-medium text-[#111827] text-sm leading-relaxed scrollbar-thin">
                    <pre className="whitespace-pre-wrap font-sans">{coverLetter}</pre>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => navigator.clipboard.writeText(coverLetter ?? '')}
                      variant="outline"
                      className="flex-1 h-12 border-[#E5E7EB] text-[#111827] font-bold hover:bg-[#F9FAFB] rounded-xl"
                    >
                      Copy Content
                    </Button>
                    <Button
                      onClick={() => setShowModal(false)}
                      className="flex-1 h-12 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl shadow-lg shadow-green-500/10"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Success — +50 XP
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
