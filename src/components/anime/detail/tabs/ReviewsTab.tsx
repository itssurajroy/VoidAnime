'use client';

import { MessageSquare, Star, User } from 'lucide-react';
import { ReviewCard } from '@/components/social/ReviewCard';

export function ReviewsTab({ media }: { media: any }) {
  const reviews = media.reviews?.nodes || [];

  if (!reviews.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#2A2A2A] rounded-[40px] bg-[#1A1A1A]/20">
        <MessageSquare className="w-12 h-12 text-white/10 mb-4" />
        <h3 className="text-xl font-heading font-black text-zinc-400 mb-2 uppercase tracking-widest">No Reviews Yet</h3>
        <p className="text-sm text-white/20 max-w-xs mx-auto mb-8">Be the first to share your field report on this series.</p>
        <button className="px-8 py-4 bg-[#212121] hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-[#2A2A2A]">
          Write a Review
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-slide-up">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-heading font-black text-white flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-anime-primary" /> Community Reviews
        </h2>
        <button className="px-6 py-3 bg-anime-primary hover:bg-anime-secondary text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-anime-primary/20">
          Submit Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {reviews.map((review: any) => (
          <ReviewCard 
            key={review.id}
            author={{ username: review.user.name, avatar: review.user.avatar.large }}
            content={review.summary}
            rating={review.rating}
            isSpoiler={review.summary.toLowerCase().includes('spoiler')}
            likes={review.ratingAmount}
            date={new Date(review.createdAt * 1000).toLocaleDateString()}
          />
        ))}
      </div>
    </div>
  );
}
