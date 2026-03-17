'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Play, Plus, BookOpen, Search } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { slugify } from '@/lib/utils/slugify';
import React, { useRef } from 'react';

export interface MediaCardProps {
  id: number;
  title: string;
  coverImage: string;
  score: number;
  format?: string;
  episodes?: number;
  color?: string;
  type?: 'anime' | 'manga';
}

export function MediaCard({ id, title, coverImage, score, format, episodes, color, type = 'anime' }: MediaCardProps) {
  const accentColor = color || (type === 'anime' ? '#9D4EDD' : '#5A189A');
  const slug = `${slugify(title)}-${id}`;

  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ opacity: { duration: 0.4 }, y: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative flex flex-col gap-3 transition-colors duration-300 z-10 hover:z-20 [perspective:1000px]"
    >
      <Link href={`/${type}/${slug}`} 
        className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[var(--color-dark-surface)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        style={{ 
          '--hover-color': accentColor,
          transform: "translateZ(30px)",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px -10px ${accentColor}40`
        } as React.CSSProperties}
      >
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 md:group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        />
        
        {/* Dynamic Light Reflection Layer */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              () => `radial-gradient(circle at ${(x.get() + 0.5) * 100}% ${(y.get() + 0.5) * 100}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
            )
          }}
        />

        {/* Glass Score Badge */}
        <div 
          style={{ transform: "translateZ(40px)" }}
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-xl glass-panel px-2.5 py-1.5 text-[10px] font-black text-white opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-30"
        >
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
          <span>{score > 0 ? (score / 10).toFixed(1) : 'NR'}</span>
        </div>

        {/* Format Badge (Always visible) */}
        <div 
          style={{ transform: "translateZ(35px)" }}
          className="absolute top-3 left-3 px-2 py-1 glass-panel rounded-lg text-[10px] font-black text-white/90 tracking-widest uppercase z-30"
        >
          {format || (type === 'anime' ? 'TV' : 'MANGA')}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] via-[var(--color-dark-bg)]/40 to-transparent opacity-0 transition-opacity duration-500 md:group-hover:opacity-100 flex items-end justify-center pb-6 gap-3 z-30">
           <button 
             style={{ transform: "translateZ(50px)" }}
             className={`p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-white rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-110 ${type === 'anime' ? 'bg-anime-primary' : 'bg-anime-secondary'}`}
           >
             <Search className="w-5 h-5" />
           </button>
           <button 
             style={{ transform: "translateZ(40px)" }}
             className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center glass-panel hover:border-white/40 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-xl"
           >
             <Plus className="w-5 h-5" />
           </button>
        </div>
      </Link>

      <div 
        className="px-1 sm:px-2 space-y-1 relative z-20 pointer-events-none"
        style={{ transform: "translateZ(25px)" }}
      >
        <h3 className="line-clamp-1 text-sm font-bold text-white md:group-hover:text-anime-primary transition-colors duration-300 leading-tight drop-shadow-md">
          {title}
        </h3>
        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
           <span>{episodes ? `${episodes} ${type === 'anime' ? 'Episodes' : 'Chapters'}` : 'Ongoing'}</span>
        </div>
      </div>
    </motion.div>
  );
}
