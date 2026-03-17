'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sword, Compass, Smile, Drama, Ghost, Search, Brain, Heart, Rocket, Sparkles, Coffee, Trophy } from 'lucide-react';

const GENRES = [
  { name: 'Action', icon: Sword, color: 'from-red-500/20 to-red-900/40', textColor: 'text-red-400' },
  { name: 'Adventure', icon: Compass, color: 'from-orange-500/20 to-orange-900/40', textColor: 'text-orange-400' },
  { name: 'Comedy', icon: Smile, color: 'from-yellow-500/20 to-yellow-900/40', textColor: 'text-yellow-400' },
  { name: 'Drama', icon: Drama, color: 'from-blue-500/20 to-blue-900/40', textColor: 'text-blue-400' },
  { name: 'Fantasy', icon: Sparkles, color: 'from-purple-500/20 to-purple-900/40', textColor: 'text-purple-400' },
  { name: 'Horror', icon: Ghost, color: 'from-gray-500/20 to-gray-900/40', textColor: 'text-gray-400' },
  { name: 'Mystery', icon: Search, color: 'from-indigo-500/20 to-indigo-900/40', textColor: 'text-indigo-400' },
  { name: 'Psychological', icon: Brain, color: 'from-pink-500/20 to-pink-900/40', textColor: 'text-pink-400' },
  { name: 'Romance', icon: Heart, color: 'from-rose-500/20 to-rose-900/40', textColor: 'text-rose-400' },
  { name: 'Sci-Fi', icon: Rocket, color: 'from-cyan-500/20 to-cyan-900/40', textColor: 'text-cyan-400' },
  { name: 'Slice of Life', icon: Coffee, color: 'from-emerald-500/20 to-emerald-900/40', textColor: 'text-emerald-400' },
  { name: 'Sports', icon: Trophy, color: 'from-green-500/20 to-green-900/40', textColor: 'text-green-400' },
];

export function GenreQuickLinks() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {GENRES.map((genre, i) => (
        <motion.div
          key={genre.name}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link 
            href={`/search?genre=${genre.name}`}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-br ${genre.color} border border-[#2A2A2A] backdrop-blur-sm transition-all hover:border-white/20 shadow-lg min-h-[100px]`}
          >
            <genre.icon className={`w-6 h-6 ${genre.textColor}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 transition-colors text-center">
              {genre.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
