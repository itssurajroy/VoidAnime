'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { useListStore } from '@/store/listStore';
import { slugify } from '@/lib/utils/slugify';

interface ContinueWatchingAnime {
  id: number;
  title: string;
  image: string;
  ep: number;
  total: number | null;
}

export function ContinueWatchingSection() {
  const { entries } = useListStore();
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingAnime[]>([]);

  useEffect(() => {
    const watching = Object.values(entries)
      .filter(entry => entry.status === 'WATCHING' && entry.progress > 0)
      .slice(0, 10);

    if (watching.length === 0) {
      return;
    }

    const mapped: ContinueWatchingAnime[] = watching.map(entry => ({
      id: entry.anilistId,
      title: entry.title || `Anime ${entry.anilistId}`,
      image: entry.coverImage || '',
      ep: entry.progress,
      total: entry.totalEpisodes || entry.totalEp || null
    })).filter(a => a.image);

    setContinueWatching(mapped);
  }, [entries]);

  if (continueWatching.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-black text-white flex items-center gap-2 sm:gap-3">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-anime-primary" /> Continue Watching
        </h2>
        <Link href="/list" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
          View Full List
        </Link>
      </div>
      <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-2">
        {continueWatching.map(anime => (
          <Link 
            key={anime.id} 
            href={`/anime/${slugify(anime.title)}-${anime.id}`}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl glass-panel group transition-all hover:border-anime-primary/50 min-h-[44px] w-[240px] sm:w-[280px] md:w-[320px] flex-shrink-0 neon-border"
          >
            <div className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-[#2A2A2A] group-hover:scale-105 transition-transform">
              {anime.image && (
                <Image src={anime.image} alt={anime.title} fill sizes="80px" className="object-cover" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-white line-clamp-1 group-hover:text-anime-primary transition-colors">{anime.title}</h4>
              <p className="text-xs text-zinc-400 mt-1 font-medium tracking-tight">
                Episode {anime.ep} {anime.total ? `/ ${anime.total}` : ''}
              </p>
              {anime.total && (
                <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-anime-primary shadow-[0_0_10px_rgba(157,78,221,0.4)]" style={{ width: `${(anime.ep / anime.total) * 100}%` }} />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
