'use client';

import { motion } from "framer-motion";
import { Star, TrendingUp, Heart, Award } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface AnimeStatsProps {
  aniListData: any;
  moreInfo: any;
}

export function AnimeStats({ aniListData, moreInfo }: AnimeStatsProps) {
  const getRank = () => {
    // Attempt to find the overall rating rank from scoreDistribution or other fields if possible
    // AniList Media rankings are usually in a separate field, but we didn't fetch them.
    // However, averageScore vs Popularity are different.
    
    // If we don't have a separate 'Rank', we can show something else or N/A
    // The user said POPULARITY and RANK are the same currently.
    // Let's see if we can get a better 'Rank' from moreInfo if it's not '??'
    if (moreInfo.rank && moreInfo.rank !== '??' && moreInfo.rank !== moreInfo.popularity) {
        return `#${moreInfo.rank}`;
    }
    return 'N/A';
  };

  const getScore = () => {
    if (aniListData?.averageScore) return `${aniListData.averageScore}%`;
    if (moreInfo.malscore && moreInfo.malscore !== '?' && moreInfo.malscore !== 'N/A') return moreInfo.malscore;
    return 'Pending';
  };

  const stats = [
    {
      label: "Average Score",
      value: getScore(),
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Popularity",
      value: aniListData?.popularity ? `#${aniListData.popularity.toLocaleString()}` : 'N/A',
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Favorites",
      value: aniListData?.favourites ? aniListData.favourites.toLocaleString() : 'N/A',
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Rank",
      value: getRank(),
      icon: Award,
      color: "text-primary",
      bg: "bg-primary/10",
    }
  ];

  // Filter out stats with no meaningful data
  const visibleStats = stats.filter(s => !['N/A', 'Pending', '?', '??'].includes(s.value));

  return (
    <section>
      <SectionHeader title="Information" subtitle="Details" />
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {visibleStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <GlassPanel intensity="light" className="p-4 md:p-6 flex flex-col items-center justify-center text-center gap-3 hover:bg-white/[0.08] hover:border-primary/30 transition-all duration-500 group rounded-2xl md:rounded-[32px]">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.bg} flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all duration-500`}>
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color} fill-current`} />
              </div>
              <div>
                <h4 className="text-lg md:text-2xl font-black text-white italic tracking-tighter group-hover:text-primary transition-colors">{stat.value}</h4>
                <p className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
