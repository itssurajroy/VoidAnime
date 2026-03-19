'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from "@supabase/ssr";
import { Trophy, Medal, Loader2, Star, TrendingUp, Sparkles, User, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { calculateLevel, getXpForNextLevel } from '@/types/gamification';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

interface LeaderboardUser {
    id: string;
    username: string;
    avatar_url?: string;
    xp: number;
    level: number;
}

export function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('id, username, avatar_url, xp, level')
                    .order('xp', { ascending: false })
                    .limit(50);

                if (error) throw error;
                
                const fetchedUsers: LeaderboardUser[] = (data || []).map((user: any) => ({
                    id: user.id,
                    username: user.username || 'Anonymous Void',
                    avatar_url: user.avatar_url,
                    xp: user.xp || 0,
                    level: user.level || calculateLevel(user.xp || 0)
                }));
                
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
                // Fallback mock data
                setUsers([
                    { id: '1', username: 'VoidLegend', xp: 2500000, level: 99 },
                    { id: '2', username: 'JinWoo_Hunter', xp: 1200000, level: 85 },
                    { id: '3', username: 'Mugiwara_Luffy', xp: 980000, level: 72 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {users.slice(0, 3).map((user, index) => (
                    <div 
                        key={user.id}
                        className={cn(
                            "relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center",
                            index === 0 && "md:-mt-8 md:scale-105 bg-yellow-500/10 border-yellow-500/30",
                            index === 1 && "md:-mt-4 md:scale-102 bg-gray-400/10 border-gray-400/30",
                            index === 2 && "bg-orange-500/10 border-orange-500/30"
                        )}
                    >
                        {index < 3 && (
                            <div className={cn(
                                "absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                                index === 0 && "bg-yellow-500 text-black",
                                index === 1 && "bg-gray-400 text-black",
                                index === 2 && "bg-orange-500 text-black"
                            )}>
                                {index + 1}
                            </div>
                        )}
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 mb-4 bg-white/10">
                            <Image 
                                src={user.avatar_url || '/placeholder-avatar.png'}
                                alt={user.username}
                                width={80}
                                height={80}
                                className="object-cover"
                            />
                        </div>
                        <h3 className="font-black text-lg uppercase truncate">{user.username}</h3>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <Trophy className={cn("w-4 h-4", index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-orange-500")} />
                            <span className="text-primary font-bold">{user.xp.toLocaleString()} XP</span>
                        </div>
                        <div className="mt-2 text-xs text-white/40 font-bold uppercase tracking-wider">Level {user.level}</div>
                    </div>
                ))}
            </div>

            {/* Rest of leaderboard */}
            <div className="space-y-2">
                {users.slice(3).map((user, index) => (
                    <div 
                        key={user.id}
                        className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                    >
                        <span className="w-8 text-center font-black text-white/30">{index + 4}</span>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0">
                            <Image 
                                src={user.avatar_url || '/placeholder-avatar.png'}
                                alt={user.username}
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{user.username}</p>
                            <p className="text-xs text-white/40">Level {user.level}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-primary font-black">{user.xp.toLocaleString()}</p>
                            <p className="text-xs text-white/40">XP</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
