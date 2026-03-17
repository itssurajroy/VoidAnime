'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Edit2, Calendar, Award, Flame, Zap, Star, Eye, 
  BookOpen, Twitter, ExternalLink
} from 'lucide-react';
import { UserProfile, PublicProfile, GamificationData, SocialLinks } from '@/types/user';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { DailyStreak } from '@/components/gamification/DailyStreak';

interface ProfileHeaderProps {
  user: UserProfile | PublicProfile;
  isOwnProfile?: boolean;
}

const ACHIEVEMENT_ICONS: Record<string, string> = {
  'first_anime': '🎬',
  'completed_100': '🏆',
  'streak_master': '🔥',
  'critic': '⭐',
  'collector': '📚',
};

function calculateLevel(xp: number): { level: number; progress: number; xpToNext: number } {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpForLevel = level * level * 100;
  const xpForNext = (level + 1) * (level + 1) * 100;
  const progress = ((xp - xpForLevel) / (xpForNext - xpForLevel)) * 100;
  return { level, progress: Math.min(100, Math.max(0, progress)), xpToNext: xpForNext - xp };
}

function formatDate(timestamp: any): string {
  if (!timestamp) return 'Unknown';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function ProfileHeader({ user, isOwnProfile = false }: ProfileHeaderProps) {
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  
  const gamification = user.gamification;
  const stats = user.stats;
  
  const levelData = gamification ? calculateLevel(gamification.xp) : { level: 1, progress: 0, xpToNext: 100 };
  const achievements = gamification?.achievements || [];

  return (
    <div className="relative w-full">
      {/* Banner Background */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-anime-primary/30 via-anime-secondary/20 to-anime-cyan/30" />
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
      </div>

      <div className="relative px-4 md:px-8 lg:px-12 -mt-32 md:-mt-40">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-3xl overflow-hidden border-4 border-[#1a1a2e] shadow-2xl bg-[#0f0f1a]">
                <Image
                  src={user.photoURL || '/avatar-placeholder.png'}
                  alt={user.displayName}
                  fill
                  className="object-cover"
                />
              </div>
              {user.isPro && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-[#1a1a2e]">
                  <Zap className="w-5 h-5 text-white fill-current" />
                </div>
              )}
            </motion.div>

            {/* Level Badge */}
            <div className="mt-4 flex items-center gap-2">
              <LevelBadge level={levelData.level} xp={gamification?.xp || 0} />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white">
                    {user.displayName}
                  </h1>
                  <p className="text-zinc-500 font-bold mt-1">@{user.username}</p>
                </div>
                
                {isOwnProfile && (
                  <Link 
                    href="/profile/edit" 
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="text-sm font-bold">Edit Profile</span>
                  </Link>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-zinc-400 font-medium max-w-2xl mb-6">
                  {user.bio}
                </p>
              )}

              {/* Stats Row */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 mb-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-bold">{stats?.totalAnimeWatched || 0} Anime</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-bold">{stats?.totalMangaRead || 0} Manga</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-bold">Joined {formatDate(user.createdAt)}</span>
                </div>
                {gamification?.streak && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-bold">{gamification.streak} Day Streak</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {user.socialLinks && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {user.socialLinks.twitter && (
                    <a 
                      href={`https://twitter.com/${user.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#1da1f2]/10 text-[#1da1f2] rounded-lg hover:bg-[#1da1f2]/20 transition-all text-sm font-bold"
                    >
                      <Twitter className="w-4 h-4" />
                      @{user.socialLinks.twitter}
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Side Stats */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:w-72 space-y-4"
          >
            {/* XP Progress */}
            <div className="bg-[#1a1a2e]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Level Progress</span>
                <span className="text-xs font-bold text-anime-primary">Level {levelData.level}</span>
              </div>
              <div className="h-3 bg-black/40 rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${levelData.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-anime-primary to-anime-secondary rounded-full"
                />
              </div>
              <p className="text-[10px] font-bold text-zinc-500">
                {gamification?.xp || 0} / {levelData.xpToNext + (gamification?.xp || 0)} XP to next level
              </p>
            </div>

            {/* Achievements Preview */}
            {achievements.length > 0 && (
              <div className="bg-[#1a1a2e]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Achievements</span>
                  <span className="text-xs font-bold text-zinc-400">{achievements.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(showAllAchievements ? achievements : achievements.slice(0, 5)).map((achievement, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-lg border border-amber-500/30"
                      title={achievement}
                    >
                      {ACHIEVEMENT_ICONS[achievement] || '🏅'}
                    </div>
                  ))}
                  {achievements.length > 5 && !showAllAchievements && (
                    <button 
                      onClick={() => setShowAllAchievements(true)}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-zinc-400 hover:bg-white/10"
                    >
                      +{achievements.length - 5}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
