'use client';

import React from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Progress } from '@/components/ui/progress';
import { 
    Trophy, 
    Flame, 
    Loader2, 
    Play, 
    Users, 
    History, 
    ListVideo, 
    Shield,
    Star
} from 'lucide-react';
import { RankBadge } from './RankBadge';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PublicProfileViewProps {
  username: string;
}

export default function PublicProfileView({ username }: PublicProfileViewProps) {
    const { user: currentUser } = useSupabaseAuth();

    const level = 1;
    const rank = 'NOVICE';
    const rankColor = 'bg-gray-400';

    return (
        <div className="min-h-screen bg-background">
            <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary/20 via-background to-background">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            </div>

            <div className="container max-w-6xl mx-auto px-4 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-background shadow-2xl">
                            <Image 
                                src="/placeholder-avatar.png"
                                alt={username}
                                width={160}
                                height={160}
                                className="object-cover"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-2 pb-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{username}</h1>
                            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-black uppercase tracking-widest rounded-full">Level {level}</span>
                        </div>
                    </div>
                </div>

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
                        <p className="text-2xl font-black">0</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-white/40">
                            <ListVideo className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Watching</span>
                        </div>
                        <p className="text-2xl font-black">0</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-white/40">
                            <History className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                        </div>
                        <p className="text-2xl font-black">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
