'use client';

import { motion } from 'framer-motion';
import { Award, Shield, Zap, Flame, Star, Trophy, Target, Crown } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 'century', title: 'Century Club', desc: 'Watch 100 anime', icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'purist', title: 'Manga Purist', desc: 'Read 50 manga', icon: Target, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'contrarian', title: 'Contrarian', desc: 'Dissent from the hivemind', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'legend', title: 'Grand Otaku', desc: 'Reach Level 50', icon: Crown, color: 'text-red-500', bg: 'bg-red-500/10' },
];

export function AchievementShowcase() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ACHIEVEMENTS.map((ach, i) => (
        <motion.div 
          key={ach.id}
          whileHover={{ scale: 1.02, y: -2 }}
          className="p-5 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-xl flex items-center gap-4 group"
        >
          <div className={`w-12 h-12 rounded-2xl ${ach.bg} flex items-center justify-center shrink-0 border border-[#2A2A2A]`}>
            <ach.icon className={`w-6 h-6 ${ach.color}`} />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight">{ach.title}</h4>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">{ach.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
