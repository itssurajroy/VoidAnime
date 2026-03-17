'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Play } from 'lucide-react';
import type { AnimeCard } from '@/types';

interface AnimeListProps {
  title: string;
  animes: AnimeCard[];
  icon?: ReactNode;
  viewMoreHref: string;
}

export function AnimeList({ title, animes, icon, viewMoreHref }: AnimeListProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
          <div className="flex items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            <h2 className="text-[22px] font-[900] text-white uppercase tracking-tighter font-headline leading-none">{title}</h2>
          </div>
        </div>
        <Link
          href={viewMoreHref}
          className="group flex items-center gap-1.5 text-[10px] font-black text-white/30 hover:text-primary transition-all uppercase tracking-[0.2em]"
        >
          View More
          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {animes.slice(0, 5).map((anime) => {
          return (
            <Link
              href={`/anime/${anime.id}`}
              key={anime.id}
              className="group flex gap-4 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all duration-500 saas-shadow"
            >
              <div className="relative w-14 aspect-[2/3] rounded-xl overflow-hidden shrink-0 border border-white/5">
                <Image
                  src={anime.poster}
                  alt={anime.name}
                  fill
                  sizes="56px"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className="text-[13px] font-bold text-white truncate leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
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
