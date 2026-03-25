'use client';

import { motion } from 'framer-motion';
import { Zap, Flame, Star, ChevronRight } from 'lucide-react';

interface GamificationHeaderProps {
  name: string;
  xp: number;
  level: number;
  streak: number;
}

export function GamificationHeader({ name, xp, level, streak }: GamificationHeaderProps) {
  const xpForCurrentLevel = (level - 1) * 500;
  const xpForNextLevel = level * 500;
  const xpProgress = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = Math.min((xpProgress / xpNeeded) * 100, 100);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
      {/* Avatar & Name */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#6366F1] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/10">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-[#2563EB]">{level}</span>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-[#111827] text-xl tracking-tight leading-none">{name}</h2>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E40AF] text-[10px] font-bold uppercase tracking-wider">
              Level {level} Hunter
            </div>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="flex-[1.5] w-full min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#2563EB] fill-[#2563EB]" />
            <span className="text-sm font-bold text-[#111827]">{xp} XP</span>
          </div>
          <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{xpForNextLevel} XP Goal</span>
        </div>
        <div className="h-3 bg-[#F3F4F6] rounded-full overflow-hidden border border-[#E5E7EB]">
          <motion.div
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <p className="text-[11px] font-medium text-[#6B7280]">{xpNeeded - xpProgress} XP to next level</p>
          <p className="text-[11px] font-bold text-[#2563EB]">{Math.round(progressPercent)}%</p>
        </div>
      </div>

      {/* Streak & Stats */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF7ED] border border-[#FFEDD5]">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
            </motion.div>
            <span className="text-lg font-bold text-[#C2410C]">{streak}</span>
          </div>
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mt-1.5">Day Streak</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F3FF] border border-[#EDE9FE]">
            <Star className="w-5 h-5 text-[#7C3AED] fill-[#7C3AED]" />
            <span className="text-lg font-bold text-[#5B21B6]">Elite</span>
          </div>
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mt-1.5">Rank</p>
        </div>
      </div>
    </div>
  );
}
