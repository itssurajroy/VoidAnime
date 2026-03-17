import { MediaCard } from './MediaCard';
import type { Anime } from '@/types/anime';

interface MediaGridProps {
  items: any[];
  columns?: 2 | 3 | 4 | 5 | 6 | 7;
  loading?: boolean;
  className?: string;
  type?: 'anime' | 'manga';
}

const COLUMN_CLASSES: Record<number, string> = {
  2: 'grid-cols-2 sm:grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  7: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7',
};

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="skeleton aspect-[2/3] w-full rounded-xl" />
      <div className="skeleton h-3 w-3/4 rounded" />
      <div className="skeleton h-2.5 w-1/2 rounded" />
    </div>
  );
}

export function MediaGrid({ items, columns = 6, loading = false, className = '', type = 'anime' }: MediaGridProps) {
  if (loading) {
    return (
      <div className={`grid gap-x-4 gap-y-8 ${COLUMN_CLASSES[columns]} ${className}`}>
        {Array.from({ length: columns * 2 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (!items || !items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-zinc-400 text-sm">No results found</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-x-4 gap-y-8 ${COLUMN_CLASSES[columns]} ${className}`}>
      {items.map((item) => (
        <MediaCard 
          key={item.id}
          id={item.id}
          title={item.title.english || item.title.romaji}
          coverImage={item.coverImage?.extraLarge || item.coverImage?.large}
          score={item.averageScore || 0}
          format={item.format}
          episodes={item.episodes || item.chapters}
          color={item.coverImage?.color}
          type={type}
        />
      ))}
    </div>
  );
}
