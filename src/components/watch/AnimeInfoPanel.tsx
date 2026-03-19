'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, Clock, Calendar, ChevronRight, Play, Heart, Bookmark
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AnimeInfoPanelProps {
    animeId: string;
    anime: any;
    genresList: string[];
    inWatchlist: boolean;
    watchlistItem: any;
    watchlistStatuses: any[];
    handleWatchlistAction: (status: any) => void;
}

export function AnimeInfoPanel({
    animeId,
    anime,
    genresList,
    inWatchlist,
    watchlistItem,
    watchlistStatuses,
    handleWatchlistAction
}: AnimeInfoPanelProps) {
    return (
        <div className="bg-[#0a0b10]/80 backdrop-blur-3xl rounded-[48px] p-8 md:p-16 border border-white/5 space-y-16 relative overflow-hidden group/info shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
            {/* AMBIENT BACKGROUND DECORATION */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none group-hover/info:bg-primary/10 transition-colors duration-1000" />
            
            <div className="flex flex-col lg:flex-row gap-12 md:gap-20 relative z-10">
                {/* POSTER SECTION */}
                <div className="relative w-full lg:w-[320px] shrink-0 mx-auto lg:mx-0">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="relative aspect-[2/3] rounded-[48px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 group-hover/info:scale-[1.02] transition-transform duration-700"
                    >
                        <Image src={anime.info.poster} alt={anime.info.name} fill sizes="320px" className="object-cover" priority />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-transparent to-transparent opacity-90" />
                        
                        {/* FLOATING BADGES ON POSTER */}
                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
                             <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-black text-white italic tracking-tighter">{anime.moreInfo?.malscore || '8.4'}</span>
                             </div>
                             <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-lg shadow-primary/30">
                                <Play className="w-6 h-6 fill-current" />
                             </div>
                        </div>
                    </motion.div>
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-1 space-y-12">
                    <div className="space-y-8">
                        <div className="flex flex-wrap gap-4 items-center">
                            <Badge className="bg-primary text-black text-[11px] font-[1000] uppercase px-6 py-2 rounded-full shadow-[0_10px_20px_rgba(147,51,234,0.3)] tracking-widest">{anime.info.stats?.quality || 'HD'}</Badge>
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-xl">
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] italic">{anime.info.stats?.type || 'TV'} Series</span>
                            </div>
                            <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">{anime.moreInfo?.status || 'Airing'}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <h1 className="text-5xl md:text-7xl lg:text-8xl font-[1000] text-white uppercase tracking-tighter leading-[0.85] italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover/info:text-primary transition-colors duration-700">
                                {anime.info.name}
                             </h1>
                             <p className="text-white/20 text-sm font-black uppercase tracking-[0.5em] italic">{anime.info.name?.split(' ').slice(0, 3).join(' ')} • Original</p>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-4">
                            {genresList.map((genre: string, i: number) => genre && (
                                <Link 
                                    key={`${genre}-${i}`} 
                                    href={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`} 
                                    className="px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] hover:bg-primary hover:text-black hover:border-primary hover:shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all duration-500 italic"
                                >
                                    {genre}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16 border-y border-white/[0.05] py-12">
                        <div className="space-y-4">
                            <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic">Network Score</p>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shadow-lg">
                                    <Star className="w-7 h-7 text-yellow-500 fill-current" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-[1000] text-white italic tracking-tighter leading-none">{anime.moreInfo?.malscore || '8.4'}</span>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">MAL Ranking</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic">Ep Duration</p>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg">
                                    <Clock className="w-7 h-7 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-[1000] text-white italic tracking-tighter leading-none">{anime.info.stats?.duration || '24m'}</span>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Per Episode</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] italic">Release Year</p>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-lg">
                                    <Calendar className="w-7 h-7 text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-[1000] text-white italic tracking-tighter leading-none truncate">{anime.moreInfo?.aired?.split(',')[1]?.trim() || '2024'}</span>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Premiered</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-primary/40 rounded-full" />
                            <h4 className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic">Synopsis</h4>
                        </div>
                        <div className="relative">
                            <p className="text-white/40 text-lg leading-relaxed font-medium italic border-l-4 border-primary/10 pl-10 py-2 group-hover/info:text-white/60 transition-colors duration-500">
                                {anime.info.description}
                            </p>
                            <div className="absolute top-0 left-0 -ml-1 h-full w-1 bg-gradient-to-b from-primary to-transparent opacity-40" />
                        </div>
                    </div>

                    <div className="pt-8 flex flex-wrap gap-6">
                        <Link href={`/anime/${animeId}`}>
                            <Button className="h-16 px-12 rounded-[24px] bg-white text-black font-[1000] uppercase text-[12px] tracking-[0.2em] hover:bg-primary hover:text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all active:scale-95 group/btn">
                                Intelligence Report
                                <ChevronRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-16 px-12 rounded-[24px] border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/5 font-black uppercase text-[12px] tracking-[0.2em] transition-all active:scale-95">
                                    <Bookmark className={cn("w-5 h-5 mr-3", inWatchlist ? "fill-primary text-primary" : "")} />
                                    {inWatchlist ? watchlistItem?.status.replace('_', ' ') : 'Add to Database'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#0d0e14] border-white/10 rounded-[28px] p-3 w-64 backdrop-blur-3xl shadow-3xl">
                                {watchlistStatuses.map((status) => (
                                    <DropdownMenuItem 
                                        key={status.value} 
                                        onClick={() => handleWatchlistAction(status.value)} 
                                        className={cn(
                                            "flex items-center gap-4 px-5 py-4 rounded-[20px] cursor-pointer mb-1 last:mb-0 transition-all duration-300", 
                                            watchlistItem?.status === status.value ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(147,51,234,0.1)]" : "text-white/40 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <div className={cn("w-3 h-3 rounded-full shadow-lg", status.color)} />
                                        <span className="text-[12px] font-black uppercase tracking-widest italic">{status.label}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button variant="ghost" className="h-16 w-16 rounded-[24px] bg-white/[0.03] border border-white/10 text-white/40 hover:text-primary hover:bg-primary/10 transition-all active:scale-95">
                             <Heart className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
