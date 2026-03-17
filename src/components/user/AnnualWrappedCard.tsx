'use client';

import { motion } from 'framer-motion';
import { Share2, Download, Zap, Award, Sparkles, TrendingUp, Clock, History } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

interface WrappedData {
  year: number;
  topAnime: { title: string, image: string };
  totalHours: number;
  episodesWatched: number;
  topGenre: string;
  personality: string;
  rank: string;
}

export function AnnualWrappedCard({ data }: { data: WrappedData }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#0D0D0D',
      scale: 2,
      useCORS: true,
    });
    const link = document.createElement('a');
    link.download = `voidanime-wrapped-${data.year}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <div 
        ref={cardRef}
        className="w-full max-w-[400px] aspect-[9/16] bg-[#0D0D0D] rounded-[40px] border-8 border-[#2A2A2A] p-8 relative overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Abstract Background Art */}
        <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-anime-primary rounded-full blur-[100px]" />
          <div className="absolute bottom-20 -left-20 w-64 h-64 bg-anime-secondary rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-[#2A2A2A] rounded-full scale-150 animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-anime-primary" />
              </div>
              <span className="text-xs font-black tracking-widest text-zinc-400 uppercase">VoidAnime {data.year}</span>
            </div>
            <Sparkles className="w-6 h-6 text-white/20" />
          </div>

          <h2 className="text-4xl font-heading font-black text-white leading-none mb-10">
            YOUR YEAR IN <span className="glow-text">ANIME</span>.
          </h2>

          <div className="space-y-8 flex-1">
            {/* Top Show */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Most Obsessed With</p>
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-xl">
                <Image src={data.topAnime.image} alt={data.topAnime.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <p className="text-lg font-black text-white line-clamp-1">{data.topAnime.title}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                <Clock className="w-4 h-4 text-anime-accent mb-2" />
                <p className="text-xl font-black text-white">{data.totalHours}</p>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Hours Logged</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                <TrendingUp className="w-4 h-4 text-anime-secondary mb-2" />
                <p className="text-xl font-black text-white">{data.episodesWatched}</p>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Episodes</p>
              </div>
            </div>

            {/* Genre & DNA */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-anime-primary/20 to-anime-secondary/20 border border-[#2A2A2A] relative overflow-hidden">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">Anime DNA Archetype</p>
              <p className="text-xl font-black text-white mb-1">{data.personality}</p>
              <p className="text-[10px] text-zinc-300">Dominant Genre: <span className="text-anime-primary font-bold">{data.topGenre}</span></p>
              <div className="absolute bottom-[-10px] right-[-10px] opacity-10">
                <History className="w-20 h-20 rotate-[-15deg]" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#2A2A2A] flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Tier Status</p>
              <p className="text-sm font-black text-anime-primary uppercase tracking-tighter">{data.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-bold text-white/10 uppercase mb-1">Generated On</p>
              <p className="text-[10px] font-mono text-white/20">VOIDANIME.APP</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={downloadCard}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
        >
          <Download className="w-4 h-4" /> Download
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#212121] transition-all">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
}
