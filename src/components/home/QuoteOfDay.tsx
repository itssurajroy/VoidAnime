import Link from 'next/link';
import { fetchDailyQuote } from '@/lib/api/quotes';
import { Quote } from 'lucide-react';

export async function QuoteOfDay() {
  const quote = await fetchDailyQuote();

  if (!quote) {
    return (
      <div className="w-full py-12 text-center">
        <Quote className="w-12 h-12 text-white/10 mx-auto mb-4" />
        <p className="text-zinc-500">No quote available</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <Quote className="w-10 h-10 text-anime-primary/30 mx-auto mb-4" />
        <blockquote className="text-lg sm:text-xl text-zinc-300 font-outfit italic leading-relaxed">
          "{quote.quote}"
        </blockquote>
        <p className="mt-4 text-sm text-zinc-500">
          — <span className="text-white font-medium">{quote.character.name}</span>, {quote.character.anime.name}
        </p>
        <Link 
          href="/quotes"
          className="inline-block mt-4 text-sm text-anime-primary hover:text-white transition-colors"
        >
          More Quotes →
        </Link>
      </div>
    </div>
  );
}
