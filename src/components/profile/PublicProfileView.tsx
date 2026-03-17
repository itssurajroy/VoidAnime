'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { Progress } from '@/components/ui/progress';
import { 
    Trophy, 
    Flame, 
    Loader2, 
    Play, 
    Users, 
    MessageSquare, 
    History, 
    ListVideo, 
    Shield,
    TrendingUp,
    CalendarDays,
    Star
} from 'lucide-react';
import { RankBadge } from './RankBadge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useUserStats } from '@/hooks/use-user-stats';
import { createNotification } from '@/actions/notifications';
import { CommentsSection } from '@/components/watch/Comments';

interface PublicProfileViewProps {
  username: string;
}

export default function PublicProfileView({ username }: PublicProfileViewProps) {
    const { user: currentUser } = useUser();
    const { profile, loading, error } = usePublicProfile(username);
    const [hasNotified, setHasNotified] = useState(false);

    // Get rank and level from stats (mocked logic as we don't have full stats in public profile yet)
    const level = 1; // Default
    const rank = 'Trainee'; // Default
    const rankColor = 'text-gray-400';

    useEffect(() => {
        if (profile && currentUser && profile.uid !== currentUser.uid && !hasNotified) {
            // Trigger visit notification
            createNotification({
                recipientId: profile.uid,
                senderId: currentUser.uid,
                senderName: currentUser.displayName,
                senderAvatar: currentUser.photoURL,
                type: 'PROFILE_VISIT',
                title: 'Profile Visited',
                content: `${currentUser.displayName || 'Someone'} visited your profile`,
                link: `/profile/${currentUser.displayName || currentUser.uid}`,
            });
            setHasNotified(true);
        }
    }, [profile, currentUser, hasNotified]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 text-center">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                    <Loader2 className="w-20 h-20 animate-spin text-primary relative z-10" />
                </div>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Accessing User Records...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                    <Shield className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">Identity Not Found</h2>
                <p className="text-white/40 max-w-xs mb-10">We couldn't find the user profile you're looking for. They may have changed their username or deleted their account.</p>
            </div>
        );
    }

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
                            {profile.avatarUrl ? (
                                <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary/40 bg-white/5">
                                    {profile.username?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background shadow-lg">
                            <span className="text-black font-black text-xs">{level}</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter truncate leading-tight">
                            {profile.username}
                        </h1>
                        <div className="flex items-center gap-3 mt-1.5">
                            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg border border-white/5", rankColor)}>
                                <RankBadge rank={rank} className="w-3 h-3" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{rank}</span>
                            </div>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                MEMBER SINCE {profile.memberSince ? new Date(profile.memberSince).getFullYear() : 'Unknown'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Bio Section */}
                {profile.bio && (
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[32px] p-6">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Identification Bio</p>
                        <p className="text-white/70 text-sm leading-relaxed italic">{profile.bio}</p>
                    </div>
                )}

                {/* 3. Global Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-5 text-center">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Titles</p>
                        <p className="text-xl font-black text-white">{profile.stats.totalAnime}</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-5 text-center">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Completed</p>
                        <p className="text-xl font-black text-white">{profile.stats.completed}</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-5 text-center">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Episodes</p>
                        <p className="text-xl font-black text-white">{profile.stats.episodesWatched}</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-5 text-center">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Hours</p>
                        <p className="text-xl font-black text-white">{profile.stats.hoursWatched}</p>
                    </div>
                </div>

                {/* 4. Public Favorites */}
                {profile.publicFavorites.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">Favorites</h2>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {profile.publicFavorites.map((anime) => (
                                <div key={anime.id} className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 group">
                                    <Image src={anime.poster} alt={anime.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                                        <p className="text-[8px] font-black text-white uppercase truncate">{anime.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Public Reviews */}
                {profile.publicReviews.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-black text-white uppercase tracking-widest">Recent Reviews</h2>
                        </div>
                        <div className="space-y-4">
                            {profile.publicReviews.map((review) => (
                                <div key={review.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-8 h-10 rounded-lg overflow-hidden border border-white/10">
                                                <Image src={review.animePoster} alt={review.animeTitle} fill className="object-cover" />
                                            </div>
                                            <p className="text-[12px] font-black text-white uppercase tracking-tight">{review.animeTitle}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                                            <Star className="w-3 h-3 text-primary fill-current" />
                                            <span className="text-[10px] font-black text-primary">{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-white/50 leading-relaxed italic line-clamp-3">"{review.content}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. Profile Comments */}
                <div className="pt-10 border-t border-white/5">
                    <CommentsSection animeId={profile.uid} animeTitle={`${profile.username}'s Profile`} />
                </div>
            </div>
        </div>
    );
}
