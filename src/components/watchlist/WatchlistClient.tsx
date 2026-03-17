'use client';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoreHorizontal, GripVertical, PlayCircle, CheckCircle2, Clock, PauseCircle, XCircle, LucideIcon } from 'lucide-react';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { WatchlistItem, WatchlistStatus } from '@/types';
import { useWatchlist } from '@/hooks/use-watchlist';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const listOrder: WatchlistStatus[] = ['WATCHING', 'COMPLETED', 'PLAN_TO_WATCH', 'ON_HOLD', 'DROPPED'];

const STATUS_CONFIG: Record<WatchlistStatus, { label: string; icon: LucideIcon }> = {
    WATCHING: { label: 'Watching', icon: PlayCircle },
    COMPLETED: { label: 'Completed', icon: CheckCircle2 },
    PLAN_TO_WATCH: { label: 'Plan to Watch', icon: Clock },
    ON_HOLD: { label: 'On Hold', icon: PauseCircle },
    DROPPED: { label: 'Dropped', icon: XCircle },
};

export function WatchlistClient() {
  const { watchlist, loading, updateStatus, removeItem } = useWatchlist();
  const { toast } = useToast();

  const lists = useMemo(() => {
    return watchlist.reduce((acc, item) => {
      if (!acc[item.status]) {
        acc[item.status] = [];
      }
      acc[item.status].push(item);
      return acc;
    }, {} as Record<WatchlistStatus, WatchlistItem[]>);
  }, [watchlist]);

  const handleStatusChange = (animeId: string, newStatus: WatchlistStatus) => {
    updateStatus(animeId, newStatus);
    toast({ title: 'Watchlist updated' });
  };

  const handleRemove = (animeId: string) => {
      if(confirm('Are you sure you want to remove this item?')) {
        removeItem(animeId);
        toast({ variant: 'destructive', title: 'Item removed from watchlist' });
      }
  }
  
  const WatchlistCard = ({ item }: { item: WatchlistItem }) => (
    <div className="flex items-center gap-4 group">
        <GripVertical className="w-5 h-5 text-muted-foreground/50 cursor-grab" />
        <Link href={`/watch/${item.id}`} className="flex-shrink-0">
            <Image src={item.poster} alt={item.name} width={60} height={85} className="rounded-md object-cover w-[60px] h-[85px]" />
        </Link>
        <div className="flex-1 min-w-0">
            <Link href={`/watch/${item.id}`} className="font-bold text-white hover:text-primary transition-colors line-clamp-2">{item.name}</Link>
            <p className="text-sm text-muted-foreground">{item.type}</p>
            <div className="flex items-center gap-2 mt-1">
                <Progress value={(item.progress / item.totalEpisodes) * 100} className="w-24 h-1.5" />
                <span className="text-xs text-muted-foreground">{item.progress} / {item.totalEpisodes}</span>
            </div>
        </div>
        <div className="ml-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Update Progress</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Move to...</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                           {listOrder.map(status => (
                                <DropdownMenuItem key={status} onSelect={() => handleStatusChange(item.id, status)}>
                                    {status.replace('_', ' ')}
                                </DropdownMenuItem>
                           ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem className="text-destructive" onSelect={() => handleRemove(item.id)}>Remove</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  );

  if (loading) {
      return (
          <div className="container py-8">
              <SectionTitle>My Watchlist</SectionTitle>
              <div className="space-y-4">
                  {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-lg">
                          <Skeleton className="w-5 h-5" />
                          <Skeleton className="w-[60px] h-[85px] rounded-md" />
                          <div className="flex-1 space-y-2">
                              <Skeleton className="h-5 w-3/4" />
                              <Skeleton className="h-4 w-1/4" />
                              <Skeleton className="h-4 w-1/2" />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )
  }

  return (
    <div className="container py-8">
      <SectionTitle>My Watchlist</SectionTitle>
      <Tabs defaultValue="WATCHING" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 h-auto flex-wrap sm:flex-nowrap rounded-[20px]">
            {listOrder.map(status => {
                const count = lists[status]?.length || 0;
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;
                return (
                    <TabsTrigger 
                        key={status} 
                        value={status} 
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all data-[state=active]:bg-primary data-[state=active]:text-black"
                    >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">{config.label}</span>
                        <span className="text-[10px] opacity-50">({count})</span>
                    </TabsTrigger>
                )
            })}
        </TabsList>
        
        {listOrder.map(status => (
            <TabsContent key={status} value={status} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-[#0B0C10] border-white/5 rounded-[32px] overflow-hidden saas-shadow">
                    <CardContent className="p-8 space-y-6">
                        {(lists[status] && lists[status].length > 0) ? (
                            lists[status].map(item => <WatchlistCard key={item.id} item={item} />)
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                                    {(() => {
                                        const StatusIcon = STATUS_CONFIG[status].icon;
                                        return <StatusIcon className="w-8 h-8 text-white/10" />;
                                    })()}
                                </div>
                                <p className="text-white/20 font-black uppercase tracking-widest text-[11px]">List is currently empty</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
