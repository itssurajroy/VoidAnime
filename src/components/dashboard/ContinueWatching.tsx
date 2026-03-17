'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { SectionTitle } from '../shared/SectionTitle';
import { useWatchHistory } from '@/hooks/use-watch-history';
import { Skeleton } from '../ui/skeleton';


export function ContinueWatching() {
    const { history, loading } = useWatchHistory();
    
    if (loading) {
        return (
            <section>
                <SectionTitle>Continue Watching</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i}>
                            <Skeleton className="aspect-video w-full rounded-md" />
                            <Skeleton className="h-4 w-3/4 mt-2" />
                            <Skeleton className="h-3 w-1/2 mt-1" />
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    if (history.length === 0) {
        return (
             <section>
                <SectionTitle>Continue Watching</SectionTitle>
                <div className="bg-card p-8 rounded-lg text-center">
                    <p className="text-muted-foreground">You have no watch history yet.</p>
                    <p className="text-sm text-muted-foreground">Start watching an anime to see it here!</p>
                </div>
            </section>
        )
    }


  return (
    <section>
        <SectionTitle>Continue Watching</SectionTitle>
        <Carousel
            opts={{
                align: 'start',
                slidesToScroll: 'auto',
            }}
            className="w-full"
        >
        <CarouselContent className="-ml-4">
            {history.map((item) => (
            <CarouselItem key={item.episodeId} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4">
                <Link href={`/watch/${item.animeId}?ep=${item.episodeId}`} className="group block relative">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-secondary">
                        <Image
                            src={item.animePoster}
                            alt={item.animeName}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#8b5cf6] flex items-center justify-center shadow-[0_0_20px_rgba(255,184,2,0.4)] transition-transform duration-300 transform scale-50 group-hover:scale-100">
                                <Play className="w-6 h-6 text-black fill-current ml-1" />
                            </div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                             <p className="text-white font-bold text-sm truncate">{item.animeName}</p>
                             <p className="text-xs text-muted-foreground">Episode {item.episodeNumber}</p>
                        </div>
                    </div>
                </Link>
            </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="left-[-1rem] disabled:hidden" />
        <CarouselNext className="right-[-1rem] disabled:hidden" />
        </Carousel>
    </section>
  );
}
