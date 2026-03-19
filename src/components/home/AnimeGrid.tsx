'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Tv, Clock, Star, Zap, Layers, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimeCard {
  id: string;
  name: string;
  jname?: string;
  poster: string;
  type?: string;
  duration?: string;
  rating?: string;
  episodes?: {
    sub?: number;
    dub?: number;
  };
  otherInfo?: string[];
}

export function AnimeGrid({ 
  animes, 
  title, 
  icon, 
  className 
}: { 
  animes: AnimeCard[], 
  title?: string, 
  icon?: React.ReactNode, 
  className?: string 
}) {
  if (!animes?.length) return null;

  return (
    <section className={`mb-16 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-8 group/title">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <div className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl transition-transform group-hover/title:scale-110 duration-500">
                {icon ? icon : <Zap className="w-6 h-6 text-primary" />}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                {title}
              </h2>
              <div className="h-1 w-12 bg-primary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="h-full w-full bg-white/50"
                />
              </div>
            </div>
          </div>
          
          <Link 
            href={`/category/${title.toLowerCase().replace(/ /g, '-')}`} 
            className="group flex items-center gap-3 bg-white/5 hover:bg-primary transition-all duration-500 px-5 py-2.5 rounded-2xl border border-white/5 hover:border-primary/50"
          >
            <span className="text-[11px] font-black text-white/50 group-hover:text-white uppercase tracking-[0.2em] transition-colors">
              Explore All
            </span>
            <Plus className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-4 gap-y-10">
        {animes.map((anime, index) => (
          <AnimeCardItem key={anime.id} anime={anime} index={index} />
        ))}
      </div>
    </section>
  );
}

function AnimeCardItem({ anime, index }: { anime: AnimeCard, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 7) * 0.05, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/anime/${anime.id}`} className="group block relative">
        {/* Card Body */}
        <div className="relative aspect-[3/4.5] w-full rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] group-hover:-translate-y-2">
          
          {/* Image with High Contrast Filter */}
          <div className="absolute inset-0 z-0">
            <Image
              src={anime.poster}
              alt={anime.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
              className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1 brightness-[0.9] contrast-[1.1] group-hover:brightness-110"
              loading="lazy"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-60" />
          </div>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
            <div className="flex flex-col gap-1.5">
              {anime.episodes?.sub && (
                <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-2xl flex items-center gap-1 uppercase tracking-tighter">
                  <Layers className="w-3 h-3 text-primary" />
                  SUB {anime.episodes.sub}
                </div>
              )}
              {anime.episodes?.dub && (
                <div className="bg-primary/20 backdrop-blur-md border border-primary/30 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-2xl flex items-center gap-1 uppercase tracking-tighter">
                  <Layers className="w-3 h-3 text-white" />
                  DUB {anime.episodes.dub}
                </div>
              )}
            </div>

            {anime.rating && (
              <div className="bg-white/90 text-black text-[9px] font-black px-2.5 py-1 rounded-lg shadow-2xl uppercase tracking-tighter">
                {anime.rating}
              </div>
            )}
          </div>

          {/* Hover Overlay Content */}
          <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px]" />
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-transform duration-500"
            >
              <div className="absolute inset-0 bg-white rounded-3xl animate-ping opacity-20" />
              <Play className="w-7 h-7 text-primary fill-primary" />
            </motion.div>
          </div>

          {/* Bottom Info Overlay (On Card) */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-3 text-[10px] font-black text-white/70 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Tv className="w-3 h-3 text-primary" />
                {anime.type || anime.otherInfo?.[0] || 'TV'}
              </span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-primary" />
                {anime.duration || anime.otherInfo?.[1] || '24m'}
              </span>
            </div>
          </div>
        </div>

        {/* External Title for readability */}
        <div className="mt-4 px-1">
          <h3 className="text-[14px] font-black text-white/90 leading-[1.3] line-clamp-2 transition-all duration-500 group-hover:text-primary group-hover:tracking-tight uppercase tracking-tight">
            {anime.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
