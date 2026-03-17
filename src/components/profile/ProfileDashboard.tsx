'use client';

import React, { useMemo } from 'react';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { getXpForNextLevel, AVAILABLE_BADGES } from '@/types/gamification';
import { useWatchlist } from '@/hooks/use-watchlist';
import { useWatchHistory } from '@/hooks/use-watch-history';
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
import { doc } from 'firebase/firestore';
import { RankBadge } from './RankBadge';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUserStats } from '@/hooks/use-user-stats';

const iconMap: Record<string, React.ReactNode> = {
    Play: <Play className="w-5 h-5" />,
    Flame: <Flame className="w-5 h-5" />,
    CalendarDays: <CalendarDays className="w-5 h-5" />,
    Users: <Users className="w-5 h-5" />,
    MessageSquare: <MessageSquare className="w-5 h-5" />,
};

export default function ProfileDashboard() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const firestore = useFirestore();
    const { watchlist, loading: watchlistLoading } = useWatchlist();
    const { history, loading: historyLoading } = useWatchHistory();
    const { rank, rankColor, level: statsLevel } = useUserStats(watchlist);

    const userDocRef = useMemo(() => {
        const uid = user?.uid;
        if (!firestore || !uid) return null;
        return doc(firestore, 'users', uid);
    }, [firestore, user?.uid]);

    const { data: userDoc, isLoading: isUserDocLoading } = useDoc(userDocRef);

    const handleLogout = async () => {
        if (auth) await signOut(auth);
    };

    if (isUserLoading || isUserDocLoading || watchlistLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-background gap-4 text-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <Loader2 className="w-20 h-20 animate-spin text-primary relative z-10" />
                </div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Accessing User Records...</p>
            </div>
        );
    }

    if (!user || !userDoc) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-background px-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                    <Shield className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">Identity Required</h2>
                <p className="text-white/40 max-w-xs mb-10">Sign in to your account to view your personalized dashboard, stats, and earned achievements.</p>
                <Link href="/welcome" className="px-10 py-4 bg-primary text-black font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Login / Sign Up
                </Link>
            </div>
        );
    }

    const xp = userDoc.xp || 0;
    const level = userDoc.level || statsLevel || 1;
    const { currentLevelXp, nextLevelXp, progress } = getXpForNextLevel(xp);
    const earnedBadgeIds = userDoc.badges || [];
    const coins = userDoc.voidCoins || 0;
    const streak = userDoc.currentStreak || 0;

    const watchingCount = watchlist.filter(w => w.status === 'WATCHING').length;
    const completedCount = watchlist.filter(w => w.status === 'COMPLETED').length;

    return (
        <div className="min-h-screen bg-background pb-32 pt-10 md:pt-20">
            
            {/* Dynamic Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none z-0">
                <div 
                    className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[140%] opacity-[0.05] blur-[140px] rounded-full"
                    style={{ background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)` }}
                />
            </div>

            <div className="container max-w-2xl mx-auto px-4 relative z-10 space-y-10">
                
                {/* 1. Header & Identity */}
                <div className="flex items-center gap-6">
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] overflow-hidden border-4 border-white/5 saas-shadow relative bg-white/5">
                            {user.photoURL ? (
                                <Image src={user.photoURL} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary/40 bg-white/5">
                                    {user.displayName?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background shadow-lg">
                            <span className="text-black font-black text-xs">{level}</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter truncate leading-tight">
                            {user.displayName || 'Guest User'}
                        </h1>
                        <div className="flex items-center gap-3 mt-1.5">
                            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5", rankColor)}>
                                <RankBadge rank={rank} className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{rank}</span>
                            </div>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                JOINED {new Date(user.metadata.creationTime || '').getFullYear()}
                            </span>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" className="text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-2xl" onClick={handleLogout}>
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>

                {/* 2. XP Progression Bar */}
                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[32px] p-6 space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Current Progression</p>
                            <p className="text-lg font-black text-white tracking-tighter uppercase leading-none">Level {level}</p>
                        </div>
                        <p className="text-[10px] font-black text-primary tracking-[0.1em] uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20 italic">
                            {currentLevelXp} / {nextLevelXp} XP
                        </p>
                    </div>
                    <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* 3. Quick Action Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/account?section=watchlist" className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[32px] p-6 group hover:bg-primary transition-all duration-500">
                        <div className="flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-black group-hover:text-white group-hover:border-transparent transition-all">
                                <ListVideo className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white group-hover:text-black font-black uppercase tracking-tighter text-lg leading-none">Watchlist</p>
                                <p className="text-[10px] text-white/30 group-hover:text-black/40 font-bold uppercase tracking-widest mt-1.5">{watchingCount} Series Active</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/account?section=history" className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[32px] p-6 group hover:bg-white/10 transition-all duration-500">
                        <div className="flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white transition-all">
                                <History className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white font-black uppercase tracking-tighter text-lg leading-none">History</p>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1.5">View Recent Activity</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/account?section=settings" className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[32px] p-6 group hover:bg-white/10 transition-all duration-500">
                        <div className="flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white transition-all">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white font-black uppercase tracking-tighter text-lg leading-none">Settings</p>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1.5">Manage Account</p>
                            </div>
                        </div>
                    </Link>

                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[32px] p-6 group">
                        <div className="flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                <Coins className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-white font-black uppercase tracking-tighter text-lg leading-none">{coins}</p>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1.5">Void Coins</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Statistics Block */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-black text-white uppercase tracking-widest">Global Stats</h2>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 grid grid-cols-2 gap-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />
                        <div className="space-y-1 border-l-2 border-primary/20 pl-6">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Anime Completed</p>
                            <p className="text-3xl font-black text-white tabular-nums">{completedCount}</p>
                        </div>
                        <div className="space-y-1 border-l-2 border-white/10 pl-6">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Total Titles</p>
                            <p className="text-3xl font-black text-white tabular-nums">{watchlist.length}</p>
                        </div>
                    </div>
                </div>

                {/* 5. Achievements Preview */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">Trophy Room</h2>
                        </div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                            {earnedBadgeIds.length} / {AVAILABLE_BADGES.length}
                        </span>
                    </div>

                    <div className="flex overflow-x-auto gap-4 pb-4 custom-scrollbar snap-x">
                        {AVAILABLE_BADGES.map(badge => {
                            const isEarned = earnedBadgeIds.includes(badge.id);
                            return (
                                <div key={badge.id} className={cn(
                                    "flex-shrink-0 w-40 p-6 rounded-[32px] flex flex-col items-center text-center gap-4 snap-center transition-all duration-500 border",
                                    isEarned ? "bg-white/[0.04] border-primary/30" : "bg-white/[0.01] border-white/5 opacity-40 grayscale"
                                )}>
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                                        isEarned ? "bg-primary/20 text-primary shadow-[0_0_20px_rgba(244,63,94,0.3)]" : "bg-white/5 text-white/20"
                                    )}>
                                        {iconMap[badge.icon] || <Trophy className="w-6 h-6" />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black text-white uppercase tracking-tight">{badge.name}</p>
                                        <p className="text-[8px] text-white/30 font-bold uppercase leading-tight line-clamp-2">{badge.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 6. Footer Links */}
                <div className="pt-10 flex flex-col gap-3">
                    <Link href="/terms" className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Terms of Service</span>
                        <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                    </Link>
                    <Link href="/privacy" className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Privacy Policy</span>
                        <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                    </Link>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Project Source</span>
                            <ExternalLink className="w-3 h-3 text-white/10" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
                    </a>
                </div>

                <div className="text-center pt-6 opacity-20">
                    <p className="text-[9px] font-black text-white uppercase tracking-[0.5em]">Void User Panel v2.0</p>
                </div>
            </div>
        </div>
    );
}
