'use client';

import { Play, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useWatchlist } from '@/hooks/use-supabase-watchlist';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WatchNowButtonProps {
    animeId: string;
    firstEpisodeId: string;
    episodes: any[];
}

export function WatchNowButton({ animeId, firstEpisodeId, episodes }: WatchNowButtonProps) {
    const { user } = useSupabaseAuth();
    const { watchlist } = useWatchlist();
    
    const watchlistItem = watchlist.find(item => item.anime_id === animeId);
    const progress = watchlistItem?.progress || 0;
    
    // Find the episode based on progress
    let targetEpisodeId = firstEpisodeId;
    let buttonText = "Watch Now";
    let isResuming = false;

    if (progress > 0 && episodes && episodes.length > 0) {
        const nextEp = episodes.find(ep => parseInt(ep.number) === progress) || 
                       episodes.find(ep => parseInt(ep.number) === progress + 1) ||
                       episodes[0];
        
        if (nextEp) {
            targetEpisodeId = nextEp.episodeId;
            buttonText = `Continue — Ep ${nextEp.number}`;
            isResuming = true;
        }
    }

    const watchLink = `/watch/${animeId}?ep=${targetEpisodeId}`;

    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link href={watchLink} className="flex-1">
                <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[13px] shadow-[0_8px_32px_rgba(147,51,234,0.3)] transition-all hover:-translate-y-1 group">
                    {isResuming ? <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" /> : <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />}
                    {buttonText}
                </Button>
            </Link>
            {isResuming && (
                <Link href={`/watch/${animeId}?ep=${firstEpisodeId}`}>
                    <Button variant="outline" className="w-full sm:w-14 h-14 rounded-2xl border-white/10 bg-white/[0.02] text-white/40 hover:text-white hover:bg-white/10 transition-all" title="Restart from Episode 1">
                        <RotateCcw className="w-5 h-5" />
                        <span className="sm:hidden ml-2 font-black uppercase tracking-widest text-[10px]">Restart</span>
                    </Button>
                </Link>
            )}
        </div>
    );
}
