'use client';

import { motion } from 'framer-motion';
import { Flame, Shield, Star, Award, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getXpForNextLevel } from '@/lib/gamification/engine';

export function LevelBadge({ level, xp }: { level: number; xp: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const nextLevelXp = getXpForNextLevel(level);
  const currentLevelBaseXp = getXpForNextLevel(level - 1);
  
  // Calculate progress percentage through the current level
  const progressToNext = Math.max(0, Math.min(100, ((xp - currentLevelBaseXp) / (nextLevelXp - currentLevelBaseXp)) * 100));

  // Determine border/glow based on level tier
  let rankStyle = "border-white/20 text-white/80 shadow-white/10";
  let Icon = Shield;
  
  if (level >= 50) {
    rankStyle = "border-red-500 text-red-500 shadow-red-500/50 glow-text";
    Icon = Flame;
  } else if (level >= 30) {
    rankStyle = "border-anime-primary text-anime-primary shadow-anime-primary/40";
    Icon = Award;
  } else if (level >= 10) {
    rankStyle = "border-anime-secondary text-anime-secondary shadow-anime-secondary/40";
    Icon = Star;
  } else if (level >= 5) {
    rankStyle = "border-anime-accent text-anime-accent shadow-anime-accent/40";
    Icon = Zap;
  }

  return (
    <div className="relative group flex items-center gap-3 bg-[#1A1A1A]/80 border border-[#2A2A2A] px-3 py-1.5 rounded-2xl backdrop-blur-xl hover:bg-[#212121] transition-colors cursor-pointer">
      <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl border-2 shadow-lg bg-[#0D0D0D] ${rankStyle}`}>
        <Icon className="w-4 h-4" />
        <span className="absolute -bottom-2 -right-2 bg-[#1A1A1A] border border-[#2A2A2A] text-[9px] font-black px-1.5 py-0.5 rounded-md">
          {level}
        </span>
      </div>
      
      <div className="flex flex-col hidden md:flex">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors">
          Grand Otaku
        </span>
        <div className="w-20 h-1.5 bg-[#0D0D0D] rounded-full overflow-hidden mt-1 border border-[#2A2A2A]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${level >= 50 ? 'bg-red-500' : level >= 30 ? 'bg-anime-primary' : level >= 10 ? 'bg-anime-secondary' : 'bg-white/40'}`}
          />
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-[#1A1A1A]/95 backdrop-blur-3xl border border-[#2A2A2A] p-3 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">
        <p className="text-xs text-white/80 font-bold text-center mb-1">Level {level} Progress</p>
        <p className="text-[10px] text-white/50 text-center font-mono">{xp} / {nextLevelXp} XP</p>
        <p className="text-[9px] text-center mt-2 text-anime-primary uppercase font-black tracking-widest">
          +{nextLevelXp - xp} XP to Level Up
        </p>
      </div>
    </div>
  );
}
