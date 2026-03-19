'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { AnimeCard } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronRight, Clock, Calendar, LayoutGrid } from 'lucide-react';

interface TopTrendingProps {
  top10Animes: {
    today: AnimeCard[];
    week: AnimeCard[];
    month: AnimeCard[];
  };
}

export function TopTrending({ top10Animes }: TopTrendingProps) {
  const [filter, setFilter] = useState<'today' | 'week' | 'month'>('today');
  const animes = (top10Animes[filter] || []).slice(0, 10);

  return (
    <div className="relative group bg-[#0B0C10] rounded-[40px] overflow-hidden border border-white/5 saas-shadow transition-all duration-700 hover:border-primary/20">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none transition-all duration-1000 group-hover:bg-primary/20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-600/5 blur-[100px] rounded-full -ml-30 -mb-30 pointer-events-none" />

      <div className="px-6 py-6 border-b border-white/5 flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
            <h3 className="text-xl font-[900] text-white uppercase tracking-tighter font-headline leading-none">Top 10</h3>
          </div>
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Trending Now</p>
        </div>

        <div className="grid grid-cols-3 bg-white/5 p-1 rounded-xl border border-white/5">
          {(['today', 'week', 'month'] as const).map((f) => {
            const Icon = f === 'today' ? Clock : f === 'week' ? Calendar : LayoutGrid;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2",
                  filter === f ? "bg-primary text-black" : "text-white/30 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-3 h-3" />
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col relative z-10">
        {animes.map((anime, index) => {
          return (
            <Link
              href={`/anime/${anime.id}`}
              key={`${filter}-${anime.id}`}
              className="group/item relative flex items-center gap-6 p-6 transition-all duration-700 hover:bg-white/[0.01]"
            >
              {/* Background Poster Overlay on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover/item:opacity-20 transition-all duration-1000 pointer-events-none overflow-hidden">
                {anime.poster && (
                  <Image src={anime.poster} alt="" fill sizes="100vw" className="object-cover blur-xl scale-110 group-hover/item:scale-100 transition-transform duration-1000" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/60 to-transparent" />
              </div>

              {/* Ranking Number */}
              <div className="relative">
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-xl font-black text-2xl transition-all duration-700 relative z-10",
                  index === 0 ? "bg-primary text-black" :
                    index === 1 ? "bg-white/10 text-white/80" :
                      index === 2 ? "bg-white/5 text-white/60" :
                        "text-white/20"
                )}>
                  {index + 1}
                </div>
              </div>

              <div className="relative w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-xl transition-all duration-700 group-hover/item:scale-105 group-hover/item:border-primary/50">
                {anime.poster && (
                  <Image src={anime.poster} alt={anime.name} fill sizes="56px" className="object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10">
                <h4 className="text-[15px] font-black text-white/90 truncate group-hover/item:text-primary transition-all duration-500 uppercase tracking-tighter leading-tight">
                  {anime.name}
                </h4>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{anime.type}</span>
                  {anime.episodes?.sub && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest">{anime.episodes.sub} episodes</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="opacity-0 group-hover/item:opacity-100 transition-all duration-500 -translate-x-4 group-hover/item:translate-x-0 hidden sm:block">
                <ChevronRight className="w-5 h-5 text-primary" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-6 bg-white/[0.01] border-t border-white/5">
        <Link href="/top-airing">
          <button className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all group">
            VIEW FULL LIST
            <ChevronRight className="inline-block w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  );
}
