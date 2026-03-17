'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { AnimeCard } from '@/types';
import { Play } from 'lucide-react';

interface TopAiringSidebarProps {
  animes: AnimeCard[];
}

export function TopAiringSidebar({ animes }: TopAiringSidebarProps) {
  return (
    <section className="bg-card rounded-xl overflow-hidden border border-white/5 saas-shadow">
      <div className="px-5 py-4 border-b border-white/5">
        <h3 className="text-[18px] font-black text-white uppercase tracking-tighter font-headline">Top Airing</h3>
      </div>
      <div className="flex flex-col">
        {animes.slice(0, 5).map((anime) => {
          return (
            <Link
              href={`/anime/${anime.id}`}
              key={anime.id}
              className="group flex gap-4 p-4 hover:bg-white/[0.03] border-b border-white/5 last:border-0 transition-colors"
            >
              <div className="relative w-16 aspect-[2/3] rounded-md overflow-hidden shrink-0 border border-white/5">
                <Image src={anime.poster} alt={anime.name} fill sizes="64px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-current" />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="text-[13px] font-bold text-white truncate group-hover:text-primary transition-colors uppercase tracking-tight">
                  {anime.name}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-black text-white/30 uppercase tracking-widest tabular-nums">
                  <span>{anime.type || 'TV'}</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span>{anime.episodes?.sub || 0} EPS</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
