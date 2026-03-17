'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, Clock, Calendar, Info 
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

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
        <div className="bg-[#12131a] rounded-[48px] p-8 md:p-12 border border-white/5 space-y-12 relative overflow-hidden group/info shadow-3xl">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">
                <div className="relative w-full md:w-[280px] shrink-0">
                    <div className="relative aspect-[2/3] rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group-hover/info:scale-[1.03] transition-transform duration-700">
                        <Image src={anime.info.poster} alt={anime.info.name} fill sizes="280px" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent opacity-80" />
                    </div>
                </div>
                <div className="flex-1 space-y-10">
                    <div className="space-y-6">
                        <div className="flex flex-wrap gap-3 items-center">
                            <Badge className="bg-primary text-black text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-xl shadow-primary/20">{anime.info.stats?.quality || 'HD'}</Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 text-[10px] font-black uppercase px-4 py-1.5 rounded-full italic tracking-widest">PG-13</Badge>
                            <div className="h-5 w-px bg-white/10 mx-2" />
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] italic">{anime.info.stats?.type || 'TV'} Series</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-[1000] text-white uppercase tracking-tighter leading-[0.9] italic drop-shadow-2xl">{anime.info.name}</h1>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {genresList.map((genre: string, i: number) => genre && <Link key={`${genre}-${i}`} href={`/genre/${genre.toLowerCase().replace(/\s+/g, '-')}`} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">{genre}</Link>)}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div className="space-y-2"><p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">MAL Rating</p><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Star className="w-5 h-5 text-yellow-500 fill-current" /></div><span className="text-2xl font-black text-white italic tracking-tighter">{anime.moreInfo?.malscore || '8.4'}</span></div></div>
                        <div className="space-y-2"><p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Duration</p><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Clock className="w-5 h-5 text-primary" /></div><span className="text-2xl font-black text-white italic tracking-tighter">{anime.info.stats?.duration || '24m'}</span></div></div>
                        <div className="space-y-2"><p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Status</p><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-400" /></div><span className="text-2xl font-black text-white italic tracking-tighter truncate">{anime.moreInfo?.status || 'Finished'}</span></div></div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3"><Info className="w-4 h-4 text-primary" /><h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Story Summary</h4></div>
                        <p className="text-white/40 text-[15px] leading-relaxed font-medium italic border-l-2 border-primary/20 pl-8">{anime.info.description}</p>
                    </div>
                    <div className="pt-4 flex flex-wrap gap-4">
                        <Link href={`/anime/${animeId}`}><Button className="h-14 px-10 rounded-2xl bg-white text-black font-[1000] uppercase text-[11px] tracking-widest hover:bg-primary hover:text-black shadow-2xl">View Full Details</Button></Link>
                        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="h-14 px-10 rounded-2xl border-white/10 bg-white/5 text-white/60 hover:text-white font-black uppercase text-[11px] tracking-widest">{inWatchlist ? watchlistItem?.status.replace('_', ' ') : 'Add to List'}</Button></DropdownMenuTrigger><DropdownMenuContent className="bg-[#1a1b1e] border-white/10 rounded-2xl p-2 w-56">{watchlistStatuses.map((status) => (<DropdownMenuItem key={status.value} onClick={() => handleWatchlistAction(status.value)} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer mb-1 last:mb-0", watchlistItem?.status === status.value ? "bg-primary/10 text-primary" : "text-white/60 hover:bg-white/5 hover:text-white")}><div className={cn("w-2 h-2 rounded-full", status.color)} /><span className="text-[11px] font-black uppercase tracking-widest">{status.label}</span></DropdownMenuItem>))}</DropdownMenuContent></DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
}
