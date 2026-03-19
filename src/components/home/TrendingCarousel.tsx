'use client';

import React, { useRef } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Star, Play, Mic, Monitor } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TrendingAnime {
  id: string;
  name: string;
  poster: string;
  rank: number;
  episodes?: {
    sub: number;
    dub: number;
  };
  rating?: string;
}

function TrendingCard({ anime, index }: { anime: TrendingAnime; index: number }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full aspect-[3/4.5] group cursor-pointer perspective-1000"
        >
            <Link href={`/anime/${anime.id}`} className="block h-full w-full">
                <div 
                    style={{ transform: "translateZ(50px)" }}
                    className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/10 bg-[#0a0a0a] transition-all duration-500 group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]"
                >
                    <Image
                        src={anime.poster}
                        alt={anime.name}
                        fill
                        sizes="(max-width: 640px) 70vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                    />

                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                    {/* Top Right Badges */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 transform translate-z-20">
                        {anime.rating && (
                            <div className="glass-morphism-heavy px-3 py-1.5 rounded-xl flex items-center gap-1.5 border-white/20">
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                <span className="text-[10px] font-black text-white">{anime.rating}</span>
                            </div>
                        )}
                    </div>

                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 z-20 transform translate-z-30">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.6)] border border-white/20 -rotate-6 group-hover:rotate-0 transition-transform">
                            <span className="text-xl font-black text-white italic tracking-tighter">#{index + 1}</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="absolute bottom-0 left-0 w-full p-6 z-30 space-y-4 transform translate-z-40">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white line-clamp-2 uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                                {anime.name}
                            </h3>
                            <div className="flex items-center gap-3">
                                {anime.episodes?.sub && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-white/50 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                                        <Monitor className="w-3 h-3 text-primary" />
                                        <span>SUB: {anime.episodes.sub}</span>
                                    </div>
                                )}
                                {anime.episodes?.dub && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-white/50 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                                        <Mic className="w-3 h-3 text-primary" />
                                        <span>DUB: {anime.episodes.dub}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                             <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-primary"
                                />
                             </div>
                             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                <Play className="w-4 h-4 text-white fill-white" />
                             </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export function TrendingCarousel({ animes }: { animes: TrendingAnime[] }) {
    if (!animes || animes.length === 0) return null;

    return (
        <section className="py-24 bg-black overflow-hidden relative">
            {/* Immersive Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
                <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full" />
            </div>
            
            <div className="max-w-[1600px] mx-auto px-6 sm:px-10 relative z-10">
                <div className="flex items-end justify-between mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-0.5 bg-primary" />
                            <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">Global Rankings</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="p-4 rounded-3xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                              <Flame className="w-8 h-8 text-primary fill-primary animate-bounce" />
                            </div>
                            <h2 className="text-5xl md:text-6xl text-headline text-white">
                                Trending <span className="text-primary italic">Now</span>
                            </h2>
                        </div>
                    </div>
                    
                    <div className="hidden lg:block pb-4">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em] text-right">Updated Real-Time • AI Powered</p>
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
                        <CarouselContent className="-ml-8">
                            {animes.map((anime, index) => (
                                <CarouselItem key={anime.id} className="pl-8 basis-[85%] xs:basis-[55%] sm:basis-[40%] md:basis-[30%] lg:basis-[22%] xl:basis-[18%]">
                                    <TrendingCard anime={anime} index={index} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="absolute top-1/2 -translate-y-1/2 -left-4 lg:-left-12 z-40 opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hidden md:block">
                            <CarouselPrevious className="relative translate-x-0 translate-y-0 w-16 h-16 rounded-3xl bg-white/5 border border-white/10 text-white hover:bg-primary transition-all backdrop-blur-2xl" />
                        </div>
                        <div className="absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-12 z-40 opacity-0 group-hover/carousel:opacity-100 transition-all duration-500 hidden md:block">
                            <CarouselNext className="relative translate-x-0 translate-y-0 w-16 h-16 rounded-3xl bg-white/5 border border-white/10 text-white hover:bg-primary transition-all backdrop-blur-2xl" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
