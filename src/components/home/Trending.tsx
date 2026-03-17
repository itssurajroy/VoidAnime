'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { RankedAnime } from '@/types';
import { AnimeCard } from '@/components/anime/AnimeCard';
import { cn } from '@/lib/utils';

interface TrendingProps {
  animes: RankedAnime[];
}

export function Trending({ animes }: TrendingProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!animes || animes.length === 0) return null;

  return (
    <section className="relative w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#8b5cf6] rounded-full" />
          <h2 className="text-2xl font-black text-white font-headline uppercase tracking-tight">Trending</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-[#8b5cf6] hover:text-black transition-all border border-white/5"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-[#8b5cf6] hover:text-black transition-all border border-white/5"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-6 scroll-smooth"
      >
        {animes.map((anime, index) => (
          <div key={anime.id} className="w-[160px] sm:w-[180px] md:w-[200px] flex-shrink-0 relative group/trending">
            <div className="absolute -left-2 bottom-10 z-0 pointer-events-none select-none">
              <span className={cn(
                "text-[70px] md:text-[100px] font-black italic leading-none tracking-tighter transition-colors",
                index < 3 ? "text-[#8b5cf6]/20" : "text-white/10"
              )}>
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="relative z-10">
              <AnimeCard anime={anime} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
