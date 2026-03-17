'use client';

import { useState } from 'react';
import { Eye, EyeOff, ThumbsUp, MessageCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface ReviewProps {
  author: { username: string, avatar: string };
  content: string;
  rating: number;
  isSpoiler: boolean;
  episode?: number;
  likes: number;
  date: string;
}

export function ReviewCard({ author, content, rating, isSpoiler: initialIsSpoiler, episode, likes, date }: ReviewProps) {
  const [showSpoiler, setShowSpoiler] = useState(!initialIsSpoiler);

  return (
    <div className="p-6 rounded-3xl bg-[#1A1A1A]/30 border border-[#2A2A2A] backdrop-blur-sm relative group overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#2A2A2A]">
            <Image src={author.avatar} alt={author.username} fill className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-black text-white">{author.username}</p>
            <p className="text-[10px] text-zinc-500 uppercase font-bold">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#212121] rounded-lg border border-[#2A2A2A]">
          <span className="text-sm font-black text-anime-primary">{rating}</span>
          <span className="text-[10px] text-zinc-400 uppercase font-bold">/ 10</span>
        </div>
      </div>

      <div className="relative">
        <div className={`text-sm text-white/70 leading-relaxed transition-all duration-500 ${!showSpoiler ? 'blur-md select-none pointer-events-none' : ''}`}>
          {content}
        </div>

        {!showSpoiler && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Spoiler Alert</span>
            </div>
            <p className="text-[10px] text-zinc-400 max-w-[200px] text-center">
              {episode ? `Contains details about Episode ${episode}` : 'Contains major plot reveals'}
            </p>
            <button 
              onClick={() => setShowSpoiler(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl"
            >
              <Eye className="w-3 h-3" /> Reveal Content
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-white/20 hover:text-anime-primary transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-xs font-bold">{likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-white/20 hover:text-white transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-bold">Reply</span>
          </button>
        </div>
        {initialIsSpoiler && showSpoiler && (
          <button 
            onClick={() => setShowSpoiler(false)}
            className="text-[10px] font-bold text-white/20 hover:text-white transition-colors flex items-center gap-1"
          >
            <EyeOff className="w-3 h-3" /> Hide
          </button>
        )}
      </div>
    </div>
  );
}
