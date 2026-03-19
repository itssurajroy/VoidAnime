'use client';

import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Plus, Bookmark } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, type ButtonProps } from '@/components/ui/button';
import { useWatchlist } from '@/hooks/use-supabase-watchlist';
import { AnimeCard, WatchlistStatus } from '@/types';
import { AuthTrigger } from '../auth/AuthTrigger';
import { cn } from '@/lib/utils';

interface AddToListButtonProps {
    anime: AnimeCard;
    size?: ButtonProps['size'];
    variant?: ButtonProps['variant'];
    iconOnly?: boolean;
    className?: string;
    iconClassName?: string;
}

export function AddToListButton({ anime, size, variant, iconOnly, className, iconClassName }: AddToListButtonProps) {
    const { user } = useSupabaseAuth();
    const { watchlist, addItem, updateStatus } = useWatchlist();

    const watchlistItem = watchlist.find(item => item.anime_id === anime.id);
    const currentStatus = watchlistItem?.status;

    if (!user) {
        return (
            <AuthTrigger>
                {iconOnly ? (
                     <Button variant={variant || 'outline'} size="icon" className={className}>
                        <Bookmark className={cn(iconClassName || "w-5 h-5")} />
                    </Button>
                ) : (
                    <Button variant={variant || 'secondary'} size={size} className={className}>
                        <Plus className={cn(iconClassName || "w-5 h-5", "mr-2")}/>Add to List
                    </Button>
                )}
            </AuthTrigger>
        );
    }
    
    const handleSelect = (status: WatchlistStatus) => {
        if (watchlistItem) {
            updateStatus(anime.id, status);
        } else {
            addItem(anime, status);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 {iconOnly ? (
                     <Button variant={variant || 'outline'} size="icon" className={className}>
                        <Bookmark className={cn(iconClassName || "w-5 h-5", watchlistItem && "fill-current text-primary")} />
                    </Button>
                ) : (
                    <Button variant={variant || "secondary"} size={size} className={className}>
                        <Plus className={cn(iconClassName || "w-5 h-5", "mr-2")}/>
                        {currentStatus ? currentStatus.replace(/_/g, ' ') : 'Add to List'}
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleSelect('WATCHING')}>Watching</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('PLAN_TO_WATCH')}>Plan to Watch</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('COMPLETED')}>Completed</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('ON_HOLD')}>On Hold</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('DROPPED')}>Dropped</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
