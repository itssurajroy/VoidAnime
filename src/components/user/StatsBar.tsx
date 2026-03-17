'use client';

import { motion } from 'framer-motion';
import { 
  Eye, Tv, BookOpen, Clock, Star, Target, 
  TrendingUp, Calendar, Award, Zap, Flame
} from 'lucide-react';
import { UserStats } from '@/types/user';

interface StatsBarProps {
  stats: UserStats;
  compact?: boolean;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export function StatsBar({ stats, compact = false }: StatsBarProps) {
  const statItems: StatItem[] = [
    { 
      label: 'Anime Watched', 
      value: stats.totalAnimeWatched || 0, 
      icon: Eye, 
      color: 'text-anime-primary',
      bgColor: 'bg-anime-primary/10'
    },
    { 
      label: 'Episodes', 
      value: stats.totalEpisodesWatched || 0, 
      icon: Tv, 
      color: 'text-anime-secondary',
      bgColor: 'bg-anime-secondary/10'
    },
    { 
      label: 'Manga Read', 
      value: stats.totalMangaRead || 0, 
      icon: BookOpen, 
      color: 'text-anime-cyan',
      bgColor: 'bg-anime-cyan/10'
    },
    { 
      label: 'Chapters', 
      value: stats.totalChaptersRead || 0, 
      icon: Clock, 
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10'
    },
    { 
      label: 'Days Watched', 
      value: Math.round(stats.totalDaysWatched || 0), 
      icon: Calendar, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    { 
      label: 'Avg Score', 
      value: stats.averageScore ? stats.averageScore.toFixed(1) : '-', 
      icon: Star, 
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10'
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {statItems.slice(0, 6).map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center justify-center p-4 bg-[#1a1a2e]/60 rounded-2xl border border-white/5"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
            <span className="text-lg font-black text-white">{stat.value}</span>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-anime-primary" />
        <h2 className="text-xl font-heading font-black text-white uppercase tracking-tight">Your Statistics</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-[#1a1a2e]/60 backdrop-blur-xl rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1"
          >
            <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity`} />
            
            <div className="relative z-10">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-black text-white">{stat.value}</span>
              </div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Rate */}
      {stats.completionRate !== undefined && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-5 bg-[#1a1a2e]/60 backdrop-blur-xl rounded-2xl border border-white/5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-anime-accent" />
              <span className="text-sm font-bold text-zinc-400">Completion Rate</span>
            </div>
            <span className="text-lg font-black text-anime-accent">{stats.completionRate.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-black/40 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-anime-accent to-anime-primary rounded-full"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
