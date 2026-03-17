'use client';

import { Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function DailyStreak({ streak }: { streak: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isActive = streak > 0;

  return (
    <div className="relative group cursor-pointer">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition-all duration-300 backdrop-blur-xl ${
        isActive 
          ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/50' 
          : 'bg-[#212121] border-[#2A2A2A] text-zinc-400 hover:text-white/80'
      }`}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={isActive ? 'active' : 'inactive'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Flame className={`w-4 h-4 ${isActive ? 'fill-current' : ''}`} />
          </motion.div>
        </AnimatePresence>
        <span className="text-sm font-black font-mono tabular-nums">{streak}</span>
      </div>

      {/* Tooltip */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-[#1A1A1A]/95 backdrop-blur-3xl border border-[#2A2A2A] p-3 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0 text-center">
        {isActive ? (
          <>
            <p className="text-xs text-white/80 font-bold mb-1">You're on fire!</p>
            <p className="text-[10px] text-white/50 leading-relaxed">You've visited VoidAnime for {streak} consecutive days. Watch an episode to maintain it!</p>
          </>
        ) : (
          <>
            <p className="text-xs text-white/80 font-bold mb-1">Streak lost</p>
            <p className="text-[10px] text-white/50 leading-relaxed">Watch an episode today to start a new streak.</p>
          </>
        )}
      </div>
    </div>
  );
}
