'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';
import type { Episode } from '@/types';

interface BreadcrumbsProps {
  anime: {
    id: string;
    name: string;
  };
  episode: Episode;
}

export function Breadcrumbs({ anime, episode }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <Link 
        href="/home" 
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-primary transition-all shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      
      <ChevronRight className="w-3 h-3 text-white/10 shrink-0" />
      
      <Link 
        href="/home" 
        className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all whitespace-nowrap shrink-0"
      >
        Anime
      </Link>

      <ChevronRight className="w-3 h-3 text-white/10 shrink-0" />

      <Link 
        href={`/watch/${anime.id}`} 
        className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all max-w-[120px] truncate shrink-0"
      >
        {anime.name}
      </Link>

      <ChevronRight className="w-3 h-3 text-white/10 shrink-0" />

      <span className="text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap shrink-0">
        Episode {episode.number}
      </span>
    </nav>
  );
}
