'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Trophy } from 'lucide-react';
import { slugify } from '@/lib/utils/slugify';

interface TopRankingsProps {
  animes: any[];
}

export function TopRankings({ animes }: TopRankingsProps) {
  return (
    <div className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] rounded-[32px] p-6 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-anime-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center gap-2 mb-6 text-anime-secondary relative z-10">
        <Trophy className="w-5 h-5" />
        <span className="text-xs font-black uppercase tracking-widest">Global Rankings</span>
      </div>

      <div className="space-y-4 relative z-10">
        {animes.map((anime, i) => (
          <Link 
            key={anime.id} 
            href={`/anime/${slugify(anime.title.english || anime.title.romaji)}-${anime.id}`}
            className="flex items-center gap-4 group"
          >
            <div className="relative w-6 text-center shrink-0">
              <span className={`text-lg font-black ${i < 3 ? 'text-anime-primary' : 'text-white/20'}`}>{i + 1}</span>
            </div>
            
            <div className="relative w-12 h-16 rounded-xl overflow-hidden border border-[#2A2A2A] shrink-0 group-hover:scale-105 transition-transform">
              <Image src={anime.coverImage.large} alt={anime.title.romaji} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white/80 line-clamp-1 group-hover:text-white transition-colors">
                {anime.title.english || anime.title.romaji}
              </h4>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-black text-zinc-400">{(anime.averageScore / 10).toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link 
        href="/search?sort=SCORE_DESC" 
        className="block mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
      >
        View Full Charts
      </Link>
    </div>
  );
}
