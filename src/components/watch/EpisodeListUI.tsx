'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Tv } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, normalizeEpisodeId } from '@/lib/utils';
import type { Episode } from '@/types';

interface EpisodeListUIProps {
    episodes: Episode[];
    epSearch: string;
    setEpSearch: (v: string) => void;
    episodeRanges: any[];
    activeRange: number;
    setActiveRange: (v: number) => void;
    filteredEpisodes: Episode[];
    normalizedTargetEpId: string;
    animeId: string;
    selectedCategory: string;
    className?: string;
    isMobile?: boolean;
}

export function EpisodeListUI({
    episodes,
    epSearch,
    setEpSearch,
    episodeRanges,
    activeRange,
    setActiveRange,
    filteredEpisodes,
    normalizedTargetEpId,
    animeId,
    selectedCategory,
    className,
    isMobile = false
}: EpisodeListUIProps) {
    return (
        <div className={cn("bg-[#12131a] rounded-[48px] border border-white/5 overflow-hidden flex flex-col shadow-2xl", className)}>
            <div className="p-8 border-b border-white/5 space-y-6 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_#9333ea]" />
                        <h3 className="text-base font-[1000] text-white uppercase tracking-tighter italic">Episode List</h3>
                    </div>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-[10px] text-white/40 font-black px-3 py-1 rounded-full uppercase tracking-widest">{episodes.length} Total</Badge>
                </div>

                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input
                        id={isMobile ? "ep-search-mobile" : "ep-search-desktop"}
                        type="text"
                        placeholder="Find episode number..."
                        value={epSearch}
                        onChange={(e) => setEpSearch(e.target.value)}
                        className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 text-[13px] font-bold text-white focus:border-primary/40 outline-none placeholder:text-white/10"
                    />
                </div>

                {episodeRanges.length > 0 && !epSearch && (
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                        {episodeRanges.map((range, idx) => (
                            <button
                                key={range.label}
                                onClick={() => setActiveRange(idx)}
                                className={cn(
                                    "whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                    activeRange === idx
                                        ? "bg-primary text-black border-primary shadow-lg shadow-primary/10"
                                        : "bg-white/5 text-white/30 border-white/5 hover:bg-white/10"
                                )}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="overflow-y-auto custom-scrollbar p-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-3 bg-black/20 content-start min-h-[400px] max-h-[600px]">
                {filteredEpisodes.map((ep) => {
                    const isActive = normalizeEpisodeId(ep.episodeId) === normalizedTargetEpId;
                    return (
                        <Link
                            key={ep.episodeId}
                            href={`/watch/${animeId}?ep=${normalizeEpisodeId(ep.episodeId)}&category=${selectedCategory}`}
                            className={cn(
                                "aspect-square flex items-center justify-center rounded-2xl text-[13px] font-black transition-all group relative border",
                                isActive
                                    ? "bg-primary text-black border-primary shadow-xl scale-110 z-10"
                                    : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {ep.number}
                            {isActive && <motion.div layoutId={isMobile ? "active-ep-mobile" : "active-ep-desktop"} className="absolute inset-0 border-2 border-white/20 rounded-2xl" />}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
