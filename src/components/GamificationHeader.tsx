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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
      {/* Avatar & Name */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/20">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
            <span className="text-[10px] font-bold text-yellow-400">{level}</span>
          </div>
        </div>
        <div>
          <p className="font-bold text-white text-lg leading-tight">{name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-slate-400 font-medium">Level {level} Hunter</span>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="flex-1 w-full sm:w-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-slate-300">{xp} XP</span>
          </div>
          <span className="text-xs text-slate-500">{xpForNextLevel} XP to Level {level + 1}</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-1">{xpNeeded - xpProgress} XP until next level</p>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
        >
          <Flame className="w-6 h-6 text-orange-400" />
        </motion.div>
        <div>
          <p className="text-xl font-black text-orange-400 leading-none">{streak}</p>
          <p className="text-[11px] text-orange-400/70 font-medium mt-0.5">day streak</p>
        </div>
      </div>

      {/* Level badge */}
      <div className="hidden xl:flex items-center gap-2 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', delay: 1 }}
        >
          <Star className="w-6 h-6 text-purple-400 fill-purple-400" />
        </motion.div>
        <div>
          <p className="text-xl font-black text-purple-400 leading-none">Lv.{level}</p>
          <p className="text-[11px] text-purple-400/70 font-medium mt-0.5">current</p>
        </div>
        <ChevronRight className="w-4 h-4 text-purple-400/50" />
      </div>
    </div>
  );
}
