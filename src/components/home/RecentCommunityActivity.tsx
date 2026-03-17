'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, Star, User } from 'lucide-react';
import { slugify } from '@/lib/utils/slugify';

interface RecentCommunityActivityProps {
  reviews: any[];
}

export function RecentCommunityActivity({ reviews }: RecentCommunityActivityProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl sm:text-2xl font-heading font-black text-white flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-anime-accent" /> Recent Reviews
        </h2>
        <Link href="/feed" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
          View All Feed
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-5 rounded-[32px] bg-[#1A1A1A] border border-[#2A2A2A] backdrop-blur-sm group hover:bg-[#212121] transition-all min-h-[140px] flex items-start gap-4">
            <div className="relative w-20 h-28 rounded-2xl overflow-hidden border border-[#2A2A2A] shrink-0">
              <Image src={review.media.coverImage.large} alt={review.media.title.romaji} fill className="object-cover transition-transform group-hover:scale-110" />
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#2A2A2A] shrink-0 border border-[#2A2A2A]">
                      {review.user.avatar.large ? (
                        <Image src={review.user.avatar.large} alt={review.user.name} width={24} height={24} className="object-cover" />
                      ) : <User className="w-3 h-3 text-zinc-400 m-1.5" />}
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase truncate">{review.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-black/40 rounded-lg border border-[#2A2A2A]">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black text-white/90">{review.rating}</span>
                  </div>
                </div>

                <Link 
                  href={`/anime/${slugify(review.media.title.english || review.media.title.romaji)}-${review.media.id}`}
                  className="text-sm font-bold text-white mb-2 line-clamp-1 group-hover:text-anime-primary transition-colors block"
                >
                  {review.media.title.english || review.media.title.romaji}
                </Link>
                
                <p className="text-xs text-zinc-500 line-clamp-2 italic leading-relaxed">
                  "{review.summary}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
