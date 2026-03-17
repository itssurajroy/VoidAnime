'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Home, Tv } from 'lucide-react';

export default function AnimeNotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 selection:bg-anime-primary/30">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Animated Anime Panel */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-64 h-64"
        >
          {/* Panel border effect */}
          <div className="absolute inset-0 border-4 border-[#2A2A2A] rounded-[40px]
                          bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden shadow-2xl">

            {/* Screentone dots background */}
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '8px 8px'
              }}
            />

            {/* Sad character illustration via CSS */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="text-8xl select-none filter drop-shadow-[0_0_20px_rgba(157,78,221,0.4)]">📺</div>
              <div className="text-white/10 text-6xl font-black tracking-tighter">
                404
              </div>
            </div>

            {/* Speed lines top corner */}
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden opacity-20">
              {[...Array(6)].map((_, i) => (
                <div key={i}
                  className="absolute bg-white h-px origin-bottom-left"
                  style={{
                    width: `${60 + i * 10}px`,
                    top: `${i * 6}px`,
                    right: 0,
                    transform: `rotate(${-30 + i * 5}deg)`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Floating exclamation bubble */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-anime-primary rounded-full
                       flex items-center justify-center text-white font-black text-xl
                       shadow-[0_0_30px_rgba(157,78,221,0.6)]"
          >
            !
          </motion.div>
        </motion.div>

        {/* Error Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="inline-block bg-anime-primary/10 border border-anime-primary/20 rounded-full
                          px-4 py-1 text-[10px] font-black text-anime-accent tracking-[0.2em] uppercase backdrop-blur-xl">
            Not Found
          </div>

          <h1 className="text-4xl font-heading font-black text-white leading-tight">
            Anime <span className="glow-text text-anime-primary">Not Found</span>
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto font-medium">
            The episode you're seeking has vanished from our library. It may have been removed or the ID is incorrect.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/search?type=anime"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl
                       bg-white text-black font-black uppercase tracking-widest text-xs
                       hover:bg-gray-200 transition-all shadow-xl hover:-translate-y-1">
            <Search size={16} />
            Search Library
          </Link>
          <Link href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl
                       bg-[#1A1A1A]/50 border border-[#2A2A2A] text-white font-black uppercase tracking-widest text-xs
                       hover:bg-[#212121] transition-all hover:-translate-y-1 backdrop-blur-xl">
            <Home size={16} />
            Back Home
          </Link>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-8 border-t border-[#2A2A2A]"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-4">Trending Suggestions</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Attack on Titan', 'Jujutsu Kaisen', 'One Piece', 'Solo Leveling', 'Naruto'].map(title => (
              <Link key={title}
                href={`/search?q=${encodeURIComponent(title)}`}
                className="px-4 py-2 rounded-xl bg-[#212121] border border-[#2A2A2A] text-zinc-400 text-[10px] font-black uppercase tracking-widest
                           hover:bg-anime-primary/10 hover:text-anime-accent hover:border-anime-primary/20 transition-all"
              >
                {title}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
