'use client';

import { useState } from 'react';
import { 
    Plus, 
    Share2, 
    BookmarkPlus, 
    Check, 
    Loader2,
    Heart,
    MoreVertical,
    Trash2
} from 'lucide-react';
import { useWatchlist } from '@/hooks/use-watchlist';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { AnimeCard, WatchlistStatus } from '@/types';
import { cn } from '@/lib/utils';

interface DetailActionsProps {
    anime: AnimeCard;
}

const STATUS_OPTIONS: { label: string; value: WatchlistStatus; color: string }[] = [
    { label: 'Watching', value: 'WATCHING', color: 'text-blue-400' },
    { label: 'Completed', value: 'COMPLETED', color: 'text-green-400' },
    { label: 'On Hold', value: 'ON_HOLD', color: 'text-yellow-400' },
    { label: 'Dropped', value: 'DROPPED', color: 'text-red-400' },
    { label: 'Plan to Watch', value: 'PLAN_TO_WATCH', color: 'text-primary' },
];

export function DetailActions({ anime }: DetailActionsProps) {
    const { user } = useUser();
    const { watchlist, addItem, removeItem, updateStatus, isInWatchlist, loading } = useWatchlist();
    const { toast } = useToast();
    const [isSharing, setIsSharing] = useState(false);

    const itemInList = watchlist.find(item => item.id === anime.id);
    const currentStatus = itemInList?.status;

    const handleShare = async () => {
        setIsSharing(true);
        try {
            if (navigator.share) {
                await navigator.share({
                    title: anime.name,
                    text: `Check out ${anime.name} on voidanime.online!`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast({ title: 'Link copied to clipboard!' });
            }
        } catch (error) {
            // User cancelled or error
        } finally {
            setIsSharing(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center gap-4">
                <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-16 px-8 rounded-[32px] bg-white/[0.02] border-white/10 text-white transition-all hover:bg-white/10 active:scale-90 shadow-xl group/save"
                    onClick={() => toast({ title: 'Please login to add to list' })}
                >
                    <BookmarkPlus className="w-6 h-6 group-hover/save:scale-110 transition-transform text-primary" />
                    <span className="ml-3 font-black uppercase tracking-widest text-[12px] hidden sm:inline">Add to List</span>
                </Button>
                <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-16 w-16 rounded-[32px] bg-white/[0.02] border-white/10 text-white transition-all hover:bg-white/10 active:scale-90 shadow-xl group/share"
                    onClick={handleShare}
                >
                    <Share2 className="w-6 h-6 group-hover/share:text-primary transition-colors" />
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            {itemInList ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="h-16 px-8 rounded-[32px] bg-primary/10 border-primary/20 text-primary transition-all hover:bg-primary/20 active:scale-95 shadow-xl group/list"
                        >
                            <Check className="w-6 h-6 group-hover/list:scale-110 transition-transform" />
                            <span className="ml-3 font-black uppercase tracking-widest text-[12px] hidden sm:inline">
                                {STATUS_OPTIONS.find(s => s.value === currentStatus)?.label || 'In List'}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-[#12121d] border-white/10 text-white rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-3 py-2">Update Status</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5" />
                        {STATUS_OPTIONS.map((status) => (
                            <DropdownMenuItem 
                                key={status.value}
                                onClick={() => updateStatus(anime.id, status.value)}
                                className={cn(
                                    "flex items-center justify-between rounded-xl px-3 py-2.5 transition-all cursor-pointer",
                                    currentStatus === status.value ? "bg-white/5" : "hover:bg-white/10"
                                )}
                            >
                                <span className={cn("text-[11px] font-bold uppercase tracking-widest", status.color)}>
                                    {status.label}
                                </span>
                                {currentStatus === status.value && <Check className="w-3 h-3" />}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem 
                            onClick={() => removeItem(anime.id)}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-all cursor-pointer hover:bg-red-500/10 text-red-400"
                        >
                            <span className="text-[11px] font-bold uppercase tracking-widest">Remove from List</span>
                            <Trash2 className="w-3 h-3" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-16 px-8 rounded-[32px] bg-white/[0.02] border-white/10 text-white transition-all hover:bg-white/10 active:scale-95 shadow-xl group/save"
                    onClick={() => addItem(anime, 'PLAN_TO_WATCH')}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <BookmarkPlus className="w-6 h-6 group-hover/save:scale-110 transition-transform text-primary" />}
                    <span className="ml-3 font-black uppercase tracking-widest text-[12px] hidden sm:inline">Add to List</span>
                </Button>
            )}

            <Button 
                variant="outline" 
                size="lg" 
                className="h-16 w-16 rounded-[32px] bg-white/[0.02] border-white/10 text-white transition-all hover:bg-white/10 active:scale-90 shadow-xl group/share"
                onClick={handleShare}
                disabled={isSharing}
            >
                {isSharing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Share2 className="w-6 h-6 group-hover/share:text-primary transition-colors" />}
            </Button>
        </div>
    );
}
