'use client';

import { useState } from 'react';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import type { AnimeCard } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, LayoutGrid, Captions, Mic, Globe } from 'lucide-react';

type Filter = 'All' | 'Sub' | 'Dub' | 'China';

const FILTER_CONFIG = [
    { name: 'All', icon: LayoutGrid },
    { name: 'Sub', icon: Captions },
    { name: 'Dub', icon: Mic },
    { name: 'China', icon: Globe },
] as const;

export function LatestUpdates({ animes }: { animes: AnimeCard[] }) {
    const [filter, setFilter] = useState<Filter>('All');
    const [page, setPage] = useState(0);
    const perPage = 12;

    if (!animes || animes.length === 0) return null;

    const filteredAnimes = animes.filter(anime => {
        if (filter === 'Sub') return !!anime.episodes?.sub;
        if (filter === 'Dub') return !!anime.episodes?.dub;
        return true;
    });

    const totalPages = Math.ceil(filteredAnimes.length / perPage);
    const animesToShow = filteredAnimes.slice(page * perPage, (page + 1) * perPage);

    return (
        <section className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_20px_rgba(147,51,234,0.6)]" />
                    <h2 className="text-2xl font-[900] text-white uppercase tracking-tighter font-headline">Latest Updates</h2>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Filters - HiAnime Style */}
                    <div className="flex items-center gap-1 bg-card p-1 rounded-full border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                        {FILTER_CONFIG.map((f) => (
                            <button
                                key={f.name}
                                onClick={() => { setFilter(f.name); setPage(0); }}
                                className={cn(
                                    'text-[9px] sm:text-[10px] md:text-[11px] font-black px-3 sm:px-4 py-1.5 rounded-full transition-all uppercase tracking-wider whitespace-nowrap flex items-center gap-2',
                                    filter === f.name ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white/70'
                                )}
                            >
                                <f.icon className="w-3 h-3" />
                                {f.name}
                            </button>
                        ))}
                    </div>

                    {/* Pagination - HiAnime Style */}
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="w-10 h-10 rounded-full bg-card border border-white/5 hover:bg-primary hover:text-black flex items-center justify-center text-white/40 disabled:opacity-20 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="w-10 h-10 rounded-full bg-card border border-white/5 hover:bg-primary hover:text-black flex items-center justify-center text-white/40 disabled:opacity-20 transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <AnimeGrid animes={animesToShow} columns={6} className="gap-x-4 gap-y-10" />
        </section>
    );
}
