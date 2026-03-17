import { AnimeCard } from './AnimeCard';
import type { AnimeCard as AnimeCardType } from '@/types';
import { cn } from '@/lib/utils';

interface AnimeGridProps {
  animes: AnimeCardType[];
  columns?: number;
  className?: string;
}

export function AnimeGrid({ animes, columns = 5, className }: AnimeGridProps) {
  return (
    <div className={cn(
      "grid gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8",
      columns === 6
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
      className
    )}>
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
}
