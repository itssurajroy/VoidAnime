'use client';

import { motion } from 'framer-motion';
import { Star, Swords, Zap, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';
import Image from 'next/image';

interface ComparisonUser {
  username: string;
  avatar: string;
  avgScore: number;
  totalWatched: number;
  topGenres: string[];
  list: { id: number, title: string, score: number, image: string }[];
}

export function UserComparison({ user1, user2 }: { user1: ComparisonUser, user2: ComparisonUser }) {
  // Logic to find common anime
  const commonIds = user1.list.filter(item1 => user2.list.some(item2 => item1.id === item2.id));
  
  // Calculate compatibility (mock logic)
  const scoreDiffs = commonIds.map(item1 => {
    const item2 = user2.list.find(i => i.id === item1.id);
    return Math.abs(item1.score - (item2?.score || 0));
  });
  
  const avgDiff = scoreDiffs.length > 0 ? scoreDiffs.reduce((a, b) => a + b, 0) / scoreDiffs.length : 5;
  const compatibility = Math.max(0, Math.min(100, 100 - (avgDiff * 15)));

  return (
    <div className="space-y-12">
      {/* Compatibility Header */}
      <div className="relative p-10 rounded-[40px] bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-3xl overflow-hidden flex flex-col items-center text-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-anime-primary/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-8 md:gap-16 mb-8 relative z-10">
          <div className="text-center group">
            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-anime-primary overflow-hidden mb-3 shadow-xl group-hover:scale-105 transition-transform">
              <Image src={user1.avatar} alt={user1.username} fill className="object-cover" />
            </div>
            <p className="text-sm font-black text-white uppercase tracking-widest">{user1.username}</p>
          </div>

          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#212121] border border-[#2A2A2A] flex items-center justify-center relative z-10 shadow-2xl">
              <ArrowRightLeft className="w-8 h-8 text-anime-primary animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-anime-primary/20 blur-2xl rounded-full" />
          </div>

          <div className="text-center group">
            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-anime-secondary overflow-hidden mb-3 shadow-xl group-hover:scale-105 transition-transform">
              <Image src={user2.avatar} alt={user2.username} fill className="object-cover" />
            </div>
            <p className="text-sm font-black text-white uppercase tracking-widest">{user2.username}</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">Sync Compatibility</p>
          <h2 className="text-6xl md:text-8xl font-heading font-black text-white glow-text">{Math.round(compatibility)}%</h2>
          <p className="text-sm text-white/50 mt-4 max-w-sm">
            {compatibility > 80 ? "You two are basically the same person. Soulmates." :
             compatibility > 50 ? "Strong common ground, but enough difference to keep it interesting." :
             "A clash of ideals. Your debates must be legendary."}
          </p>
        </div>
      </div>

      {/* Stats Battle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Avg. Score', val1: user1.avgScore, val2: user2.avgScore, icon: Star },
          { label: 'Total Seen', val1: user1.totalWatched, val2: user2.totalWatched, icon: Zap },
          { label: 'Common Titles', val1: commonIds.length, val2: commonIds.length, icon: Swords },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-[#1A1A1A]/30 border border-[#2A2A2A] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-white/20">
              <stat.icon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-2xl font-black text-anime-primary">{stat.val1}</div>
              <div className="h-10 w-px bg-[#212121]" />
              <div className="text-2xl font-black text-anime-secondary">{stat.val2}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Common Ground Section */}
      <section>
        <h3 className="text-xl font-heading font-black text-white mb-6 uppercase tracking-widest px-2">Common Ground</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {commonIds.slice(0, 5).map(anime => {
            const score1 = user1.list.find(i => i.id === anime.id)?.score;
            const score2 = user2.list.find(i => i.id === anime.id)?.score;
            return (
              <div key={anime.id} className="relative group">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-[#2A2A2A]">
                  <Image src={anime.image} alt={anime.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-[8px] font-bold text-zinc-400 uppercase">U1</p>
                        <p className="text-lg font-black text-anime-primary">{score1}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-bold text-zinc-400 uppercase">U2</p>
                        <p className="text-lg font-black text-anime-secondary">{score2}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[10px] font-bold text-zinc-300 line-clamp-1">{anime.title}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
