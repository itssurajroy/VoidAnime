'use client';

import { RankedAnime } from '@/types';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TrendingCarousel({ animes }: { animes: RankedAnime[] }) {
    if (!animes || animes.length === 0) return null;

    return (
        <div className="py-16 bg-[#0B0C10] overflow-hidden">
            <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 xl:px-20">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-2 h-10 bg-primary rounded-full shadow-[0_0_20px_rgba(147,51,234,0.6)]" />
                        <h2 className="text-3xl md:text-4xl font-black text-white font-headline uppercase tracking-tighter">Trending</h2>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <div className="h-px w-20 bg-gradient-to-r from-white/10 to-transparent" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Popular Picks</span>
                    </div>
                </div>

                <div className="relative group/carousel">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4 md:-ml-6">
                            {animes.map((anime, index) => (
                                <CarouselItem key={anime.id} className="pl-4 md:pl-6 basis-[70%] xs:basis-[50%] sm:basis-[33%] md:basis-[25%] lg:basis-[20%] xl:basis-[16.66%] animate-enter" style={{ animationDelay: `${index * 50}ms` }}>
                                    <Link href={`/anime/${anime.id}`} className="group block relative">
                                        <div className="relative aspect-[3/4.5] rounded-3xl md:rounded-[32px] overflow-hidden border-2 border-white/5 shadow-2xl transition-all duration-700 group-hover:border-primary/40 group-hover:-translate-y-3 bg-card saas-shadow">
                                            <Image
                                                src={anime.poster}
                                                alt={anime.name}
                                                fill
                                                sizes="(max-width: 640px) 70vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            />

                                            {/* Background Rank Number - Large Aesthetic */}
                                            <div className="absolute -bottom-4 -left-6 z-10 pointer-events-none transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2">
                                                <span className="text-[100px] md:text-[150px] font-black text-white/[0.03] group-hover:text-primary/[0.08] transition-colors italic tracking-tighter leading-none select-none font-headline">
                                                    {index + 1}
                                                </span>
                                            </div>

                                            {/* Rank Badge - Top Left */}
                                            <div className="absolute top-4 left-4 z-30">
                                                <div className="w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:bg-primary group-hover:border-transparent group-hover:rotate-6">
                                                    <span className="text-xl font-black text-primary group-hover:text-black italic tracking-tighter tabular-nums leading-none">
                                                        #{index + 1}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Text Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20 opacity-80 group-hover:opacity-100 transition-opacity" />

                                            <div className="absolute bottom-0 left-0 w-full p-6 z-30 space-y-3">
                                                <p className="text-[15px] font-black text-white line-clamp-2 uppercase tracking-tight leading-[1.1] group-hover:text-primary transition-colors font-headline">
                                                    {anime.name}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-1 w-8 bg-primary rounded-full shadow-[0_0_10px_#8b5cf6] transition-all group-hover:w-16" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Premium Navigation Buttons */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-6 lg:-left-10 z-40 opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hidden md:block hover:scale-110">
                            <CarouselPrevious className="relative translate-x-0 translate-y-0 w-14 h-14 rounded-2xl bg-card/80 border-white/10 text-white hover:bg-primary hover:text-black transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl" />
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-6 lg:-right-10 z-40 opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hidden md:block hover:scale-110">
                            <CarouselNext className="relative translate-x-0 translate-y-0 w-14 h-14 rounded-2xl bg-card/80 border-white/10 text-white hover:bg-primary hover:text-black transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
}
