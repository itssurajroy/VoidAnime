'use client';

import { useState, useEffect } from 'react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getAnimeQtip } from '@/services/anime';
import { Star, PlayCircle, Loader2, Info, Activity } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';

interface AnimeQtipProps {
    animeId: string;
    children: React.ReactNode;
}

interface QtipAnimeData {
    id: string;
    name: string;
    poster: string;
    type: string;
    episodes: { sub: number; dub: number };
    rating: string;
    quality: string;
    status: string;
    synopsis: string;
    genres: string[];
}

export function AnimeQtip({ animeId, children }: AnimeQtipProps) {
    const [qtipData, setQtipData] = useState<QtipAnimeData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (isOpen && !qtipData && !loading) {
            setLoading(true);
            getAnimeQtip(animeId)
                .then(res => {
                    // The API returns { success: true, data: { anime: { ... } } }
                    const animeData = res.data?.anime;
                    if (isMounted && animeData) {
                        setQtipData(animeData);
                    }
                })
                .catch(err => console.error("Failed to fetch tooltip data", err))
                .finally(() => {
                    if (isMounted) setLoading(false);
                });
        }

        return () => {
            isMounted = false;
        };
    }, [isOpen, animeId, qtipData, loading]);

    return (
        <HoverCard openDelay={400} closeDelay={150} onOpenChange={setIsOpen}>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent
                side="right"
                align="start"
                sideOffset={16}
                avoidCollisions
                collisionPadding={16}
                className="hidden md:flex flex-col w-[340px] p-0 rounded-2xl border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-300"
            >
                {loading ? (
                    <div className="p-10 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Loading Info...</p>
                    </div>
                ) : qtipData ? (
                    <div className="flex flex-col animate-in fade-in duration-500">
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 space-y-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <h3 className="font-black text-white text-xl leading-tight line-clamp-2 uppercase tracking-tighter relative z-10">{qtipData.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 relative z-10">
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                    <span className="text-[11px] font-black text-yellow-400">{qtipData.rating || 'N/A'}</span>
                                </div>
                                <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 font-black text-[9px] uppercase tracking-widest px-2.5 py-1">
                                    {qtipData.quality || 'HD'}
                                </Badge>
                                <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] uppercase tracking-widest px-2.5 py-1 shadow-lg shadow-primary/10">
                                    {qtipData.type || 'TV'}
                                </Badge>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-white/20">
                                    <Info className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Description</span>
                                </div>
                                <p className="text-white/50 text-[13px] leading-relaxed line-clamp-4 italic font-medium">
                                    &quot;{qtipData.synopsis || 'No description available for this series.'}&quot;
                                </p>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 gap-4 pt-2">
                                <div className="flex items-center justify-between">
                                    {qtipData.status && (
                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                                            <Activity className="w-3 h-3 text-emerald-400" />
                                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{qtipData.status}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {qtipData.genres?.slice(0, 4).map(genre => (
                                    <span key={genre} className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-[9px] font-black text-white/30 uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all cursor-default">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 bg-white/[0.03] border-t border-white/10 flex items-center justify-between backdrop-blur-3xl">
                            <div className="flex items-center gap-4">
                                <Link href={`/anime/${animeId}`}>
                                    <Button size="sm" variant="outline" className="h-10 rounded-2xl border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 font-black uppercase text-[10px] tracking-widest px-4 transition-all active:scale-95 group/btn">
                                        <Info className="w-3.5 h-3.5 mr-2 group-hover/btn:scale-110 transition-transform" /> Details
                                    </Button>
                                </Link>
                                <Link href={`/watch/${animeId}`}>
                                    <Button size="sm" className="h-10 rounded-2xl bg-primary text-black hover:bg-primary/90 font-black uppercase text-[11px] tracking-widest px-6 shadow-2xl shadow-primary/20 transition-all active:scale-95 group/btn">
                                        <PlayCircle className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" /> Watch Now
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-12 text-center space-y-4">
                        <Info className="w-8 h-8 text-white/10 mx-auto" />
                        <div className="space-y-1">
                            <p className="text-white text-[11px] font-black uppercase tracking-widest">Info Not Available</p>
                            <p className="text-white/20 text-[9px] font-medium uppercase tracking-[0.2em] italic">Could not load info for this anime</p>
                        </div>
                    </div>
                )}
            </HoverCardContent>
        </HoverCard>
    );
}
