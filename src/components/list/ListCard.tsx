'use client';

import { useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Check, Edit2, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ListCardProps {
  id: number;
  title: string;
  image: string;
  progress: number;
  totalEpisodes?: number;
  status: string;
  onIncrement: (id: number) => void;
  onEdit: (id: number) => void;
}

export function ListCard({ id, title, image, progress, totalEpisodes, status, onIncrement, onEdit }: ListCardProps) {
  const controls = useAnimation();
  const [swipeAction, setSwipeAction] = useState<'increment' | 'edit' | null>(null);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped Right -> Increment
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      onIncrement(id);
      controls.set({ x: 0, opacity: 1 });
    } else if (info.offset.x < -threshold) {
      // Swiped Left -> Edit
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onEdit(id);
      controls.set({ x: 0, opacity: 1 });
    } else {
      // Return to center
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
    setSwipeAction(null);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    if (info.offset.x > 50) setSwipeAction('increment');
    else if (info.offset.x < -50) setSwipeAction('edit');
    else setSwipeAction(null);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[var(--color-dark-bg)] group select-none">
      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-between items-center px-6">
        <div className={`flex items-center gap-2 font-bold ${swipeAction === 'increment' ? 'text-green-400 scale-110' : 'text-white/20'} transition-all`}>
          <Check className="w-5 h-5" /> +1 Episode
        </div>
        <div className={`flex items-center gap-2 font-bold ${swipeAction === 'edit' ? 'text-anime-primary scale-110' : 'text-white/20'} transition-all`}>
          <Edit2 className="w-5 h-5" /> Edit Status
        </div>
      </div>

      {/* Swipeable Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative glass-panel p-4 rounded-2xl flex items-center gap-4 shadow-xl z-10 neon-border"
      >
        <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-[#2A2A2A]">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        
        <div className="flex-1 min-w-0">
          <Link href={`/anime/${id}`} className="text-sm font-bold text-white line-clamp-1 hover:text-anime-primary transition-colors">
            {title}
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
              status === 'WATCHING' ? 'bg-green-500/20 text-green-400' :
              status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400' :
              'bg-white/10 text-zinc-300'
            }`}>
              {status}
            </span>
            <span className="text-xs font-medium text-zinc-300">
              EP {progress} <span className="text-zinc-500">/ {totalEpisodes || '?'}</span>
            </span>
          </div>
        </div>

        {/* Mobile visual hint */}
        <div className="flex flex-col gap-1 px-2 opacity-30 md:hidden">
          <div className="w-1 h-1 bg-white rounded-full" />
          <div className="w-1 h-1 bg-white rounded-full" />
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
        
        {/* Desktop Quick Action */}
        <button 
          onClick={() => onIncrement(id)}
          className="hidden md:flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl glass-panel hover:bg-anime-primary/20 text-zinc-400 hover:text-anime-primary transition-all ml-2"
        >
          <Play className="w-4 h-4 fill-current" />
        </button>
      </motion.div>
    </div>
  );
}
