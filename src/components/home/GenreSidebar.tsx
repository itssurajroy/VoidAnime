'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutGrid, ChevronRight, Hash } from 'lucide-react';

interface GenreSidebarProps {
  genres: string[];
}

export function GenreSidebar({ genres }: GenreSidebarProps) {
  const [showAll, setShowAll] = useState(false);

  if (!genres || genres.length === 0) return null;

  const displayedGenres = showAll ? genres : genres.slice(0, 21);

  return (
    <section className="bg-[#0B0C10] rounded-[32px] overflow-hidden border border-white/5 saas-shadow transition-all duration-500 hover:border-primary/20">
      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
            <h3 className="text-xl font-[900] text-white uppercase tracking-tighter font-headline leading-none">Genres</h3>
        </div>
        <LayoutGrid className="w-4 h-4 text-white/10" />
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-2">
            {displayedGenres.map((genre) => (
            <Link
                key={genre}
                href={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative px-3 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-primary hover:border-transparent transition-all duration-300 text-center overflow-hidden"
            >
                <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-white/40 group-hover:text-black uppercase tracking-tighter truncate w-full">
                        {genre}
                    </span>
                </div>
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-20 transition-opacity">
                    <Hash className="w-3 h-3 text-black" />
                </div>
            </Link>
            ))}
        </div>

        {genres.length > 21 && (
            <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all group flex items-center justify-center gap-2"
            >
                {showAll ? 'SHOW LESS' : 'EXPLORE MORE'}
                <ChevronRight className={cn(
                    "w-3 h-3 transition-transform",
                    showAll ? "-rotate-90" : "rotate-90 group-hover:translate-y-1"
                )} />
            </button>
        )}
      </div>
    </section>
  );
}
