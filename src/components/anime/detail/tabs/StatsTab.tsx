'use client';

import { BarChart3, ListChecks, Users, ThumbsDown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatsTab({ media }: { media: any }) {
  const scoreDist = media.stats?.scoreDistribution || [];
  const maxAmount = Math.max(...scoreDist.map((d: any) => d.amount), 1);

  const getTagRank = (tagName: string) => {
    const tag = media.tags?.find((t: any) => t.name.toLowerCase() === tagName.toLowerCase());
    return tag ? tag.rank : 0;
  };

  const dnaData = [
    { label: 'Pacing', val: getTagRank('Fast-Paced') || 50, color: 'bg-blue-500', left: 'Slow', right: 'Fast' },
    { label: 'Violence', val: getTagRank('Violence') || getTagRank('Gore') || 0, color: 'bg-red-500', left: 'Mild', right: 'Brutal' },
    { label: 'Romance', val: getTagRank('Romance') || 0, color: 'bg-pink-500', left: 'None', right: 'Heavy' },
    { label: 'Complexity', val: getTagRank('Philosophy') || getTagRank('Psychological') || 40, color: 'bg-purple-500', left: 'Simple', right: 'Deep' },
    { label: 'Emotional', val: getTagRank('Tragedy') || getTagRank('Drama') || 30, color: 'bg-indigo-500', left: 'Comfy', right: 'Devastating' },
  ];

  return (
    <div className="space-y-12 animate-slide-up">
      <h2 className="text-2xl font-heading font-black text-white px-2">Community Statistics</h2>

      <section className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-anime-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <h3 className="text-sm font-black uppercase tracking-widest text-white/80 mb-6 flex items-center gap-2">
          <Users className="w-4 h-4 text-anime-secondary" /> Popularity Snapshot
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Popularity</p>
            <p className="text-2xl font-black text-white">{media.popularity?.toLocaleString('en-US')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Favourites</p>
            <p className="text-2xl font-black text-anime-primary">{media.favourites?.toLocaleString('en-US')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Avg Score</p>
            <p className="text-2xl font-black text-green-400">{media.averageScore}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mean Score</p>
            <p className="text-2xl font-black text-blue-400">{media.meanScore}%</p>
          </div>
        </div>
      </section>

      <section className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-8 rounded-[40px] shadow-2xl">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/80 mb-6 flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-anime-primary" /> Anime DNA (Powered by Tags)
        </h3>
        
        <div className="space-y-6">
          {dnaData.map((dna, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-24 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">{dna.label}</span>
              <div className="flex-1 flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-12 text-right">{dna.left}</span>
                <div className="flex-1 h-2 bg-[#212121] rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${dna.val}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`absolute top-0 left-0 h-full ${dna.color}`} 
                  />
                </div>
                <span className="text-xs text-zinc-500 w-16">{dna.right}</span>
              </div>
              <span className="w-8 text-right text-xs font-black text-white/80">{dna.val}%</span>
            </div>
          ))}
        </div>
      </section>

      <div className="p-8 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-sm shadow-2xl">
        <h3 className="text-sm font-black uppercase tracking-widest text-white/80 mb-8 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" /> Score Distribution
        </h3>
        <div className="space-y-4">
          {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10].map((scoreValue, i) => {
            const entry = scoreDist.find((d: any) => d.score === scoreValue);
            const amount = entry ? entry.amount : 0;
            const width = (amount / maxAmount) * 100;
            return (
              <div key={scoreValue} className="flex items-center gap-4 group">
                <span className="text-xs font-black text-zinc-300 w-8 text-right">{scoreValue/10}</span>
                <div className="flex-1 h-2.5 bg-[#212121] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${width}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="h-full bg-anime-primary rounded-full group-hover:bg-anime-accent transition-colors" 
                  />
                </div>
                <span className="text-[10px] font-bold text-white/20 w-16">{amount.toLocaleString('en-US')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
