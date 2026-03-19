'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
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
        <div className={cn("bg-[#0a0b10]/90 backdrop-blur-3xl rounded-[40px] border border-white/5 overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group/eplist", className)}>
            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover/eplist:bg-primary/10 transition-colors duration-1000" />

            <div className="p-8 border-b border-white/5 space-y-8 bg-white/[0.02] relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_20px_#9333ea]" />
                        <h3 className="text-2xl font-[1000] text-white uppercase tracking-tighter italic leading-none">Episodes</h3>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 border-primary/20 text-[11px] text-primary font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/10">{episodes.length} Total</Badge>
                </div>

                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors duration-300" />
                    <input
                        id={isMobile ? "ep-search-mobile" : "ep-search-desktop"}
                        type="text"
                        placeholder="Search Episode..."
                        value={epSearch}
                        onChange={(e) => setEpSearch(e.target.value)}
                        className="w-full h-16 bg-black/60 border border-white/10 rounded-[24px] pl-16 pr-6 text-[14px] font-[900] text-white focus:border-primary/50 focus:bg-black/80 focus:shadow-[0_0_30px_rgba(147,51,234,0.15)] outline-none placeholder:text-white/20 transition-all duration-300 italic tracking-wide"
                    />
                </div>

                {episodeRanges.length > 0 && !epSearch && (
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 text-xs">
                        {episodeRanges.map((range, idx) => (
                            <button
                                key={range.label}
                                onClick={() => setActiveRange(idx)}
                                className={cn(
                                    "whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 border",
                                    activeRange === idx
                                        ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                                        : "bg-white/[0.03] text-white/40 border-white/5 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="overflow-y-auto custom-scrollbar p-8 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-black/40 content-start min-h-[400px] max-h-[600px] relative z-10">
                <AnimatePresence>
                    {filteredEpisodes.map((ep, i) => {
                        const isActive = normalizeEpisodeId(ep.episodeId) === normalizedTargetEpId;
                        return (
                            <motion.div
                                key={ep.episodeId}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.5) }}
                            >
                                <Link
                                    href={`/watch/${animeId}?ep=${normalizeEpisodeId(ep.episodeId)}&category=${selectedCategory}`}
                                    className={cn(
                                        "aspect-square flex flex-col items-center justify-center rounded-[24px] transition-all duration-300 group relative border overflow-hidden",
                                        isActive
                                            ? "bg-primary/20 border-primary/50 shadow-[0_0_30px_rgba(147,51,234,0.3)] z-10 scale-105"
                                            : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.08]"
                                    )}
                                >
                                    <span className={cn("text-[16px] font-[1000] tabular-nums z-10 transition-colors", isActive ? "text-primary" : "text-white/60 group-hover:text-white")}>{ep.number}</span>
                                    
                                    {isActive && (
                                        <>
                                            <motion.div layoutId={isMobile ? "active-ep-mobile" : "active-ep-desktop"} className="absolute inset-0 border-2 border-primary rounded-[24px]" />
                                            <div className="absolute bottom-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                            </div>
                                        </>
                                    )}
                                    
                                    {!isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
