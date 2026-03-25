'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  const scoreColor =
    matchScore >= 90 ? 'text-green-400 bg-green-400/10 border-green-400/20' :
    matchScore >= 75 ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' :
    'text-orange-400 bg-orange-400/10 border-orange-400/20';

  const handleApply = async () => {
    setIsGenerating(true);
    setShowModal(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const { data: { session } } = await supabase.auth.getSession();

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

      // Save application to DB
      await supabase.from('applications').insert({
        user_id: userId,
        job_id: job.id,
        status: 'applied',
        cover_letter: data.cover_letter,
      });

      // Award XP
      await supabase.rpc('increment_xp', { user_id_input: userId, xp_amount: 50 });

      setIsApplied(true);
      onApply(job.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaved(true);
    await supabase.from('applications').insert({
      user_id: userId,
      job_id: job.id,
      status: 'pending',
    }).then(() => {
      supabase.rpc('increment_xp', { user_id_input: userId, xp_amount: 10 });
    });
  };

  return (
    <>
      <motion.div
        className="group relative p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/60 transition-all duration-300 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
      >
        {/* Match Score Badge */}
        <div className={`absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${scoreColor}`}>
          <span>{matchScore}%</span>
          <span className="text-[10px] opacity-70">match</span>
        </div>

        {/* Company Logo Placeholder */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
            {job.company.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <h3 className="font-bold text-white text-base leading-tight truncate group-hover:text-blue-300 transition-colors">
              {job.title}
            </h3>
            <p className="text-slate-400 text-sm font-medium mt-0.5">{job.company}</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{job.metadata?.type ?? 'Full-time'}</span>
          </div>
          {job.metadata?.salary && (
            <div className="flex items-center gap-1 text-green-400/80">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{job.metadata.salary}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
          {job.description}
        </p>

        {/* Tags */}
        {job.metadata?.tags && job.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-medium"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isApplied ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Applied!
            </div>
          ) : (
            <Button
              onClick={handleApply}
              className="flex-1 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 group/btn"
            >
              <Sparkles className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Apply + Cover Letter
            </Button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all ${
              isSaved
                ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                : 'border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
            }`}
          >
            {isSaved ? <CheckCircle className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
          </button>

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 w-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      {/* Cover Letter Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  AI Cover Letter
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  For {job.title} at {job.company}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                <p className="text-slate-400 text-sm font-medium">Crafting your cover letter...</p>
              </div>
            ) : (
              <>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 max-h-80 overflow-y-auto">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {coverLetter}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    onClick={() => navigator.clipboard.writeText(coverLetter ?? '')}
                    variant="outline"
                    className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
                  >
                    Copy to Clipboard
                  </Button>
                  <Button
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-xl"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Done — +50 XP Earned!
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}
