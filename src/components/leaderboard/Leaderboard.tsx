'use client';

import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Trophy, Medal, Loader2, Star, TrendingUp, Sparkles, User, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { calculateLevel, getXpForNextLevel } from '@/types/gamification';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LeaderboardUser {
    id: string;
    username: string;
    photoURL?: string;
    xp: number;
    level: number;
}

export function Leaderboard() {
    const firestore = useFirestore();
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!firestore) return;
            try {
                const q = query(
                    collection(firestore, 'users'),
                    orderBy('xp', 'desc'),
                    limit(50)
                );
                const snapshot = await getDocs(q);
                const fetchedUsers: LeaderboardUser[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    fetchedUsers.push({
                        id: doc.id,
                        username: data.username || data.name || 'Anonymous Void',
                        photoURL: data.photoURL || data.profileImageUrl,
                        xp: data.xp || 0,
                        level: data.level || calculateLevel(data.xp || 0)
                    });
                });
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [firestore]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-background gap-4 text-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <Loader2 className="w-20 h-20 animate-spin text-primary relative z-10" />
                </div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Loading Rankings...</p>
            </div>
        );
    }

    const topThree = users.slice(0, 3);
    const restOfUsers = users.slice(3);

    return (
        <div className="min-h-screen bg-background pb-32 pt-10 md:pt-20 relative overflow-x-hidden">
            
            {/* Dynamic Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none z-0">
                <div 
                    className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[140%] opacity-[0.05] blur-[140px] rounded-full"
                    style={{ background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)` }}
                />
            </div>

            <div className="container max-w-5xl mx-auto px-4 relative z-10 space-y-12">
                
                {/* Header */}
                <div className="text-center space-y-6 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                        <Trophy className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Leaderboard</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                        Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 text-shadow-sm">Rankings</span>
                    </h1>
                    <p className="text-white/40 text-sm md:text-base font-medium italic">
                        Real-time ranking of the top 50 users across the VoidAnime community. Ranked by total experience points (XP).
                    </p>
                </div>

                {/* Top 3 Podium */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10">
                    {/* Rank 2 */}
                    {topThree[1] && (
                        <PodiumCard user={topThree[1]} rank={2} color="text-slate-300" bg="bg-slate-300/10" border="border-slate-300/20" />
                    )}
                    {/* Rank 1 */}
                    {topThree[0] && (
                        <PodiumCard user={topThree[0]} rank={1} color="text-yellow-500" bg="bg-yellow-500/10" border="border-yellow-500/20" isLarge />
                    )}
                    {/* Rank 3 */}
                    {topThree[2] && (
                        <PodiumCard user={topThree[2]} rank={3} color="text-amber-700" bg="bg-amber-700/10" border="border-amber-700/20" />
                    )}
                </div>

                {/* List of Remaining Users */}
                <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[40px] overflow-hidden saas-shadow">
                    <div className="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <h2 className="text-sm font-black text-white uppercase tracking-widest">Active Users</h2>
                        </div>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Active Users: {users.length}</span>
                    </div>

                    <div className="divide-y divide-white/5">
                        {restOfUsers.map((u, index) => {
                            const actualRank = index + 4;
                            const { currentLevelXp, nextLevelXp, progress } = getXpForNextLevel(u.xp);

                            return (
                                <div key={u.id} className="flex items-center gap-4 md:gap-8 p-6 md:p-8 hover:bg-white/[0.03] transition-all duration-500 group">
                                    {/* Rank */}
                                    <div className="w-10 text-center shrink-0">
                                        <span className="text-xl font-black text-white/10 group-hover:text-primary transition-colors italic">#{actualRank}</span>
                                    </div>

                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden border-2 border-white/5 relative bg-white/5">
                                            {u.photoURL ? (
                                                <Image src={u.photoURL} alt={u.username} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl font-black text-primary/40">
                                                    {u.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-lg flex items-center justify-center border-2 border-background shadow-lg">
                                            <span className="text-black font-black text-[8px]">{u.level}</span>
                                        </div>
                                    </div>

                                    {/* User Info & Progress */}
                                    <div className="flex-1 min-w-0 space-y-3">
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className="font-black text-sm md:text-base text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                                                {u.username}
                                            </h3>
                                            <div className="text-right">
                                                <span className="font-black text-sm md:text-lg text-white tabular-nums tracking-tighter">
                                                    {u.xp.toLocaleString()}
                                                </span>
                                                <span className="text-white/20 text-[8px] font-black uppercase tracking-widest ml-1.5">XP</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.2em] font-black text-white/20">
                                                <span>Level Progress</span>
                                                <span className="group-hover:text-primary transition-colors">{progress.toFixed(0)}%</span>
                                            </div>
                                            <Progress value={progress} className="h-1 bg-white/5" indicatorClassName="bg-primary shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="hidden md:block shrink-0">
                                        <Link href={`/api/users/${u.username}`}>
                                            <Button variant="ghost" size="icon" className="text-white/10 hover:text-white hover:bg-white/5 rounded-xl">
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}

                        {users.length === 0 && (
                            <div className="text-center py-20 bg-white/[0.01]">
                                <Sparkles className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                <p className="text-white/20 text-xs font-black uppercase tracking-widest italic">No users ranked yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
                    {[
                        { label: "Top Rank XP", value: users[0]?.xp.toLocaleString() || '0' },
                        { label: "Average Level", value: Math.round(users.reduce((acc, curr) => acc + curr.level, 0) / (users.length || 1)) },
                        { label: "Site Status", value: "Optimal" },
                        { label: "Site Status", value: "Online" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-center space-y-1">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">{stat.label}</p>
                            <p className="text-sm font-black text-white uppercase tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface PodiumProps {
    user: LeaderboardUser;
    rank: number;
    color: string;
    bg: string;
    border: string;
    isLarge?: boolean;
}

function PodiumCard({ user, rank, color, bg, border, isLarge }: PodiumProps) {
    const { progress } = getXpForNextLevel(user.xp);
    
    return (
        <div className={cn(
            "relative group transition-all duration-700 hover:-translate-y-2",
            isLarge ? "order-1 md:order-2 z-20" : rank === 2 ? "order-2 md:order-1 z-10" : "order-3 md:order-3 z-10"
        )}>
            <div className={cn(
                "bg-white/[0.02] backdrop-blur-3xl border rounded-[40px] p-8 flex flex-col items-center text-center gap-6 saas-shadow",
                border,
                isLarge ? "py-12 bg-gradient-to-b from-primary/5 to-transparent border-primary/20" : ""
            )}>
                {/* Rank Badge */}
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border transition-transform duration-500 group-hover:rotate-12",
                    bg, border, color
                )}>
                    {rank === 1 ? <Trophy className="w-6 h-6 fill-current" /> : <Medal className="w-6 h-6" />}
                </div>

                {/* Avatar */}
                <div className="relative">
                    <div className={cn(
                        "rounded-[32px] overflow-hidden border-4 border-white/5 saas-shadow relative bg-white/5 transition-all duration-700 group-hover:rounded-2xl",
                        isLarge ? "w-28 h-28 md:w-36 md:h-36" : "w-24 h-24"
                    )}>
                        {user.photoURL ? (
                            <Image src={user.photoURL} alt={user.username} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary/40 bg-white/5">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background shadow-lg">
                        <span className="text-black font-black text-xs">{user.level}</span>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-2 w-full">
                    <h3 className={cn(
                        "font-black uppercase tracking-tighter truncate w-full",
                        isLarge ? "text-2xl md:text-3xl" : "text-lg"
                    )}>
                        {user.username}
                    </h3>
                    <div className="flex flex-col items-center gap-3">
                        <p className={cn("font-black tabular-nums tracking-tighter", isLarge ? "text-3xl" : "text-xl")}>
                            {user.xp.toLocaleString()} <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] ml-1">XP</span>
                        </p>
                        <div className="w-full max-w-[120px] space-y-1.5">
                            <Progress value={progress} className="h-1 bg-white/5" indicatorClassName="bg-primary" />
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Progress to Lvl {user.level + 1}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Rank Indicator Label (Mobile) */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-background border border-white/5 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest shadow-xl">
                Rank #{rank}
            </div>
        </div>
    );
}
