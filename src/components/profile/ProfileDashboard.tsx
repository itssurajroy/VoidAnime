'use client';

import React, { useMemo } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { getXpForNextLevel, AVAILABLE_BADGES } from '@/types/gamification';
import { useWatchlist } from '@/hooks/use-supabase-watchlist';
import { useWatchHistory } from '@/hooks/use-supabase-watch-history';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
    Trophy, 
    Flame, 
    Coins, 
    Loader2, 
    Play, 
    Users, 
    MessageSquare, 
    History, 
    ListVideo, 
    Settings, 
    ChevronRight,
    TrendingUp,
    Shield,
    LogOut,
    ExternalLink,
    CalendarDays
} from 'lucide-react';
import { RankBadge } from './RankBadge';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
    Play: <Play className="w-5 h-5" />,
    Flame: <Flame className="w-5 h-5" />,
    CalendarDays: <CalendarDays className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    MessageSquare: <MessageSquare className="w-5 h-5" />,
};

export default function ProfileDashboard() {
    const { user, loading: userLoading, signOut } = useSupabaseAuth();
    const { watchlist, loading: watchlistLoading } = useWatchlist();
    const { history, loading: historyLoading } = useWatchHistory();

    const xp = watchlist.length * 10;
    const level = Math.floor(xp / 100) + 1;
    const { currentLevelXp, nextLevelXp, progress } = getXpForNextLevel(xp);
    const rank = level >= 50 ? 'GOD' : level >= 40 ? 'LEGEND' : level >= 30 ? 'MASTER' : level >= 20 ? 'ELITE' : level >= 10 ? 'PRO' : 'NOVICE';
    const rankColor = level >= 50 ? 'bg-yellow-400' : level >= 40 ? 'bg-purple-400' : level >= 30 ? 'bg-red-400' : level >= 20 ? 'bg-blue-400' : level >= 10 ? 'bg-green-400' : 'bg-gray-400';

    const handleLogout = async () => {
        await signOut();
    };

    if (userLoading || watchlistLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-background gap-4 text-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <Loader2 className="w-20 h-20 animate-spin text-primary relative z-10" />
                </div>
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs animate-pulse">Loading Profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-background gap-4 text-center">
                <Shield className="w-16 h-16 text-white/20" />
                <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-xs">Please log in to view your profile</p>
                <Link href="/">
                    <Button className="bg-primary text-black font-bold uppercase tracking-wider">Go Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header Banner */}
            <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/20 via-background to-background">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            </div>

            {/* Profile Header */}
            <div className="container max-w-6xl mx-auto px-4 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-background shadow-2xl">
                            <Image 
                                src={user.user_metadata?.avatar_url || '/placeholder-avatar.png'}
                                alt={user.user_metadata?.username || 'User'}
                                width={160}
                                height={160}
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-background rounded-xl border-2 border-primary flex items-center justify-center shadow-lg">
                            <RankBadge rank={rank} className={cn("w-6 h-6", rankColor)} />
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-2 pb-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{user.user_metadata?.username || 'User'}</h1>
                            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-black uppercase tracking-widest rounded-full">Level {level}</span>
                        </div>
                        <p className="text-white/40 font-medium">{user.email}</p>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/settings">
                            <Button variant="outline" className="gap-2">
                                <Settings className="w-4 h-4" />
                                Settings
                            </Button>
                        </Link>
                        <Button variant="ghost" onClick={handleLogout} className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-white/40">
                            <Trophy className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Rank</span>
                        </div>
                        <p className="text-2xl font-black text-primary">{rank}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-white/40">
                            <Flame className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">XP</span>
                        </div>
                        <p className="text-2xl font-black">{xp.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-white/40">
                            <ListVideo className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Watching</span>
                        </div>
                        <p className="text-2xl font-black">{watchlist.filter(w => w.status === 'WATCHING').length}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-white/40">
                            <History className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                        </div>
                        <p className="text-2xl font-black">{watchlist.filter(w => w.status === 'COMPLETED').length}</p>
                    </div>
                </div>

                {/* XP Progress */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/60 font-medium">Level Progress</span>
                        <span className="text-primary font-bold">{xp} / {nextLevelXp} XP</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-white/10" />
                    <div className="flex justify-between text-xs text-white/30 mt-2">
                        <span>Level {level}</span>
                        <span>Level {level + 1}</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <Link href="/watchlist" className="group">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                            <ListVideo className="w-8 h-8 text-primary mb-2" />
                            <p className="font-bold">Watchlist</p>
                            <p className="text-xs text-white/40">{watchlist.length} items</p>
                        </div>
                    </Link>
                    <Link href="/history" className="group">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                            <History className="w-8 h-8 text-blue-400 mb-2" />
                            <p className="font-bold">History</p>
                            <p className="text-xs text-white/40">{history.length} episodes</p>
                        </div>
                    </Link>
                    <Link href="/community" className="group">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                            <Users className="w-8 h-8 text-green-400 mb-2" />
                            <p className="font-bold">Community</p>
                            <p className="text-xs text-white/40">Join discussion</p>
                        </div>
                    </Link>
                    <Link href="/leaderboard" className="group">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                            <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                            <p className="font-bold">Leaderboard</p>
                            <p className="text-xs text-white/40">Compete now</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
