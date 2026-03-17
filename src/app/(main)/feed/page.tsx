import { Suspense } from 'react';
import { getRecentReviews } from '@/lib/api/anilist';
import { MessageSquare, Star, User, Clock, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { slugify } from '@/lib/utils/slugify';
import { formatDistanceToNow } from 'date-fns';

export const revalidate = 3600;

async function FeedContent() {
  const data = await getRecentReviews(1, 20); // Fetch more reviews for the feed
  const reviews = data?.Page?.reviews || [];

  return (
    <div className="space-y-6">
      {reviews.map((review: any) => (
        <div key={review.id} className="p-6 md:p-8 rounded-[40px] glass-panel border border-[#2A2A2A] shadow-2xl flex flex-col md:flex-row gap-6 md:gap-8 group transition-all hover:border-anime-primary/30">
          <Link href={`/anime/${slugify(review.media.title.english || review.media.title.romaji)}-${review.media.id}`} className="relative w-full md:w-32 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden shadow-xl">
            <Image src={review.media.coverImage.large} alt={review.media.title.romaji} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
          </Link>
          
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2A2A2A] shrink-0 border-2 border-[#1A1A1A]">
                    {review.user.avatar.large ? (
                      <Image src={review.user.avatar.large} alt={review.user.name} width={40} height={40} className="object-cover" />
                    ) : <User className="w-5 h-5 text-zinc-400 m-2.5" />}
                  </div>
                  <div>
                    <span className="block text-sm font-black text-white uppercase tracking-wider">{review.user.name}</span>
                    <span className="block text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {review.createdAt ? formatDistanceToNow(new Date(review.createdAt * 1000), { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-black text-yellow-500 tabular-nums">{review.rating}</span>
                </div>
              </div>

              <Link 
                href={`/anime/${slugify(review.media.title.english || review.media.title.romaji)}-${review.media.id}`}
                className="inline-block text-xl sm:text-2xl font-heading font-black text-white mb-3 hover:text-anime-primary transition-colors"
              >
                {review.media.title.english || review.media.title.romaji}
              </Link>
              
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed line-clamp-4 font-medium italic">
                "{review.summary}"
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] pt-24 sm:pt-32 pb-20 selection:bg-anime-primary/30">
      <div className="w-full px-6 md:px-10 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-anime-accent/10 border border-anime-accent/20 text-anime-accent font-black text-[10px] tracking-widest uppercase mb-6 shadow-lg shadow-anime-accent/20">
              <Zap className="w-4 h-4" /> Global Pulse
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white leading-tight drop-shadow-xl">
              Community <span className="text-anime-accent glow-text">Feed</span>.
            </h1>
            <p className="mt-4 text-zinc-400 font-bold text-sm md:text-base">Real-time reviews and insights from the network.</p>
          </div>

          <Suspense fallback={<div className="h-[500px] w-full bg-[#1A1A1A] animate-pulse rounded-[40px]" />}>
            <FeedContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
