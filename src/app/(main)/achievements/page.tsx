'use client';

import { useUserStore } from '@/store/userStore';
import { motion } from 'framer-motion';
import { Trophy, Target, Shield, Crown, Zap, Lock, Unlock } from 'lucide-react';
import Link from 'next/link';

const ALL_ACHIEVEMENTS = [
  { id: 'century', title: 'Century Club', desc: 'Watch 100 anime', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10', reqXp: 500 },
  { id: 'purist', title: 'Manga Purist', desc: 'Read 50 manga', icon: Target, color: 'text-green-500', bg: 'bg-green-500/10', reqXp: 1000 },
  { id: 'contrarian', title: 'Contrarian', desc: 'Dissent from the hivemind', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10', reqXp: 1500 },
  { id: 'legend', title: 'Grand Otaku', desc: 'Reach Level 50', icon: Crown, color: 'text-red-500', bg: 'bg-red-500/10', reqXp: 5000 },
  { id: 'socialite', title: 'Social Butterfly', desc: 'Compare lists with 5 friends', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10', reqXp: 200 },
];

export default function AchievementsPage() {
  const { profile } = useUserStore();
  const xp = profile?.gamification?.xp || 0;

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] pt-24 sm:pt-32 pb-20 selection:bg-anime-primary/30">
      <div className="w-full px-6 md:px-10 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 animate-slide-up flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-black text-[10px] tracking-widest uppercase mb-6 shadow-lg shadow-yellow-500/20">
                <Trophy className="w-4 h-4" /> Hall of Fame
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white leading-tight drop-shadow-xl">
                Your <span className="text-yellow-500 glow-text">Achievements</span>.
              </h1>
              <p className="mt-4 text-zinc-400 font-bold text-sm md:text-base">Unlock badges by tracking shows and engaging with the community.</p>
            </div>
            
            <div className="glass-panel p-4 rounded-3xl border-white/5 flex items-center gap-4 text-right">
               <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total XP</p>
                 <p className="text-2xl font-black text-white tabular-nums">{xp}</p>
               </div>
               <div className="w-12 h-12 rounded-full bg-anime-primary/20 flex items-center justify-center border border-anime-primary/50">
                 <Zap className="w-6 h-6 text-anime-primary" />
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_ACHIEVEMENTS.map((ach, i) => {
              const unlocked = xp >= ach.reqXp;
              
              return (
                <motion.div 
                  key={ach.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-6 rounded-[32px] border ${unlocked ? 'bg-[#1A1A1A] border-[#2A2A2A] hover:border-anime-primary/50' : 'bg-black/40 border-white/5 opacity-60'} backdrop-blur-xl group transition-all overflow-hidden`}
                >
                  {unlocked ? (
                    <div className="absolute top-4 right-4 text-green-500">
                      <Unlock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 text-zinc-600">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 rounded-2xl ${unlocked ? ach.bg : 'bg-white/5'} flex items-center justify-center mb-6 shadow-xl`}>
                    <ach.icon className={`w-8 h-8 ${unlocked ? ach.color : 'text-zinc-600'}`} />
                  </div>
                  
                  <h3 className={`text-xl font-black font-heading ${unlocked ? 'text-white' : 'text-zinc-400'} mb-2`}>{ach.title}</h3>
                  <p className="text-xs text-zinc-500 font-bold mb-6">{ach.desc}</p>
                  
                  <div className="w-full h-2 bg-[#212121] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (xp / ach.reqXp) * 100)}%` }}
                      className={`h-full ${unlocked ? ach.color.replace('text-', 'bg-') : 'bg-zinc-600'}`}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-black uppercase text-zinc-600">{xp} XP</span>
                    <span className="text-[10px] font-black uppercase text-zinc-500">{ach.reqXp} XP</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
