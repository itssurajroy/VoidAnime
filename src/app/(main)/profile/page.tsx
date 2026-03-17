'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Award, Users } from 'lucide-react';
import { ProfileHeader } from '@/components/user/ProfileHeader';
import { ProfileTabs } from '@/components/user/ProfileTabs';
import { StatsBar } from '@/components/user/StatsBar';
import { useUserStore } from '@/store/userStore';
import { useListStore } from '@/store/listStore';
import { UserStats, UserProfile, GamificationData } from '@/types/user';
import { GamificationProfile } from '@/types/gamification';

const AchievementShowcase = dynamic(
  () => import('@/components/gamification/AchievementShowcase').then(mod => mod.AchievementShowcase),
  { loading: () => <div className="h-48 skeleton rounded-3xl" /> }
);

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';
  const { firebaseUser, profile } = useUserStore();
  const { entries } = useListStore();
  
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!firebaseUser?.uid) {
        setLoading(false);
        return;
      }
      
      try {
        const { getUserProfile } = await import('@/lib/firebase/firestore');
        const data = await getUserProfile(firebaseUser.uid);
        if (data) {
          setUserData(data as UserProfile);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, [firebaseUser?.uid]);

  const stats = useMemo(() => {
    const entriesArray = Object.values(entries);
    const animeEntries = entriesArray.filter(e => e.format !== 'MANGA');
    const mangaEntries = entriesArray.filter(e => e.format === 'MANGA');
    
    const totalEpisodes = animeEntries.reduce((sum, e) => sum + (e.progress || 0), 0);
    const totalChapters = mangaEntries.reduce((sum, e) => sum + (e.progress || 0), 0);
    const completedCount = animeEntries.filter(e => e.status === 'COMPLETED').length;
    
    return {
      totalAnimeWatched: animeEntries.length,
      totalEpisodesWatched: totalEpisodes,
      totalMangaRead: mangaEntries.length,
      totalChaptersRead: totalChapters,
      averageScore: entriesArray.length > 0 
        ? entriesArray.reduce((sum, e) => sum + (e.score || 0), 0) / entriesArray.length 
        : 0,
      totalDaysWatched: totalEpisodes * 0.04,
      completionRate: entriesArray.length > 0 ? (completedCount / entriesArray.length) * 100 : 0,
    } as UserStats;
  }, [entries]);

  const gamification = useMemo(() => ({
    level: profile?.gamification?.level || 1,
    xp: profile?.gamification?.xp || 0,
    xpToNextLevel: 100,
    streak: profile?.gamification?.streak || 0,
    lastActiveDate: profile?.gamification?.lastActiveDate || '',
    achievements: [] as string[],
    badges: profile?.gamification?.badges || [],
  }), [profile]);

  const mergedUser = useMemo(() => {
    if (!userData) return null;
    return {
      ...userData,
      stats,
      gamification,
      displayName: userData.displayName || firebaseUser?.displayName || 'User',
      photoURL: userData.photoURL || firebaseUser?.photoURL || '/avatar-placeholder.png',
    };
  }, [userData, stats, gamification, firebaseUser]);

  const tabStats = useMemo(() => ({
    animeCount: stats.totalAnimeWatched,
    mangaCount: stats.totalMangaRead,
    reviewCount: 0,
    followerCount: 0,
    followingCount: 0,
  }), [stats]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="h-64 skeleton rounded-3xl" />
          <div className="h-16 skeleton rounded-2xl" />
          <div className="h-96 skeleton rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-3xl font-heading font-black text-white mb-4">Sign In Required</h1>
            <p className="text-zinc-400 mb-8">Please sign in to view your profile</p>
            <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-anime-primary text-white rounded-xl font-bold">
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {mergedUser && (
          <ProfileHeader user={mergedUser} isOwnProfile />
        )}

        <ProfileTabs 
          activeTab={tab as any} 
          isOwnProfile 
          stats={tabStats}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {tab === 'overview' && (
            <div className="space-y-8">
              <StatsBar stats={stats} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-heading font-black text-white">Achievements</h3>
                  </div>
                  <AchievementShowcase />
                </div>
                
                <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-anime-cyan" />
                    <h3 className="text-lg font-heading font-black text-white">Recent Activity</h3>
                  </div>
                  <p className="text-zinc-400 text-sm">Your recent activity will appear here</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'anime' && (
            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-heading font-black text-white mb-6">Anime List</h3>
              <p className="text-zinc-400">Your anime list will be displayed here</p>
            </div>
          )}

          {tab === 'manga' && (
            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-heading font-black text-white mb-6">Manga List</h3>
              <p className="text-zinc-400">Your manga list will be displayed here</p>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-heading font-black text-white mb-6">Reviews</h3>
              <p className="text-zinc-400">Your reviews will be displayed here</p>
            </div>
          )}

          {tab === 'achievements' && (
            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-heading font-black text-white mb-6">Achievements & Badges</h3>
              <AchievementShowcase />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
