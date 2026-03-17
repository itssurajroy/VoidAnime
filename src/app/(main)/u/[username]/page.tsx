'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { User as FirebaseUser } from 'firebase/auth';
import { ProfileHeader } from '@/components/user/ProfileHeader';
import { ProfileTabs } from '@/components/user/ProfileTabs';
import { StatsBar } from '@/components/user/StatsBar';
import { useUserStore } from '@/store/userStore';
import { getUserProfileByUsername } from '@/lib/firebase/firestore';
import { PublicProfile, UserStats, GamificationData } from '@/types/user';

const AchievementShowcase = dynamic(
  () => import('@/components/gamification/AchievementShowcase').then(mod => mod.AchievementShowcase),
  { loading: () => <div className="h-48 skeleton rounded-3xl" /> }
);

export default function PublicProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const tab = searchParams.get('tab') || 'overview';
  const { firebaseUser } = useUserStore();
  
  const [userData, setUserData] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      if (!username) return;
      
      try {
        const data = await getUserProfileByUsername(username);
        if (data) {
          setUserData(data as PublicProfile);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, [username]);

  const isOwnProfile = firebaseUser?.uid === userData?.uid;

  const stats = useMemo(() => {
    return userData?.stats || {
      totalAnimeWatched: 0,
      totalEpisodesWatched: 0,
      totalMangaRead: 0,
      totalChaptersRead: 0,
      averageScore: 0,
      totalDaysWatched: 0,
      completionRate: 0,
      genreBreakdown: {},
      scoreDistribution: {},
    } as UserStats;
  }, [userData]);

  const gamification = useMemo(() => {
    return userData?.gamification || {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      streak: 0,
      lastActiveDate: '',
      achievements: [],
      badges: [],
    } as GamificationData;
  }, [userData]);

  const tabStats = useMemo(() => ({
    animeCount: stats.totalAnimeWatched,
    mangaCount: stats.totalMangaRead,
    reviewCount: 0,
    followerCount: userData?.followersCount || 0,
    followingCount: userData?.followingCount || 0,
  }), [stats, userData]);

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

  if (error || !userData) {
    return (
      <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-3xl font-heading font-black text-white mb-4">
              {error || 'User Not Found'}
            </h1>
            <p className="text-zinc-400 mb-8">
              {error ? 'Please try again later' : "This user doesn't exist"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <ProfileHeader user={userData} isOwnProfile={isOwnProfile} />

        <ProfileTabs 
          activeTab={tab as any} 
          username={username}
          isOwnProfile={isOwnProfile}
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
              
              <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
                <h3 className="text-xl font-heading font-black text-white mb-6">Achievements</h3>
                <AchievementShowcase />
              </div>
            </div>
          )}

          {tab === 'anime' && (
            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-heading font-black text-white mb-6">Anime List</h3>
              <p className="text-zinc-400">
                {isOwnProfile ? 'Your anime list' : `${userData.displayName}'s anime list`}
              </p>
            </div>
          )}

          {tab === 'manga' && (
            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-heading font-black text-white mb-6">Manga List</h3>
              <p className="text-zinc-400">
                {isOwnProfile ? 'Your manga list' : `${userData.displayName}'s manga list`}
              </p>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-heading font-black text-white mb-6">Reviews</h3>
              <p className="text-zinc-400">
                {isOwnProfile ? 'Your reviews' : `${userData.displayName}'s reviews`}
              </p>
            </div>
          )}

          {tab === 'achievements' && (
            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-heading font-black text-white mb-6">Achievements & Badges</h3>
              <AchievementShowcase />
            </div>
          )}

          {tab === 'followers' && (
            <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
              <h3 className="text-xl font-heading font-black text-white mb-6">Followers</h3>
              <p className="text-zinc-400">
                {userData.followersCount || 0} followers
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
