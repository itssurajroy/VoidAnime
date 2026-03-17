'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocalHistoryItem {
    animeId: string;
    animeName: string;
    animePoster: string;
    epId: string;
    epNum: number;
    category: string;
    time: number;
    duration: number;
    updatedAt: number;
}

export function ContinueWatching() {
    const [history, setHistory] = useState<LocalHistoryItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const dataStr = localStorage.getItem('voidanime_local_history');
        if (dataStr) {
            try {
                const dataObj: Record<string, LocalHistoryItem> = JSON.parse(dataStr);
                // Convert to array, sort by newest first, and take top 10
                const sortedHistory = Object.values(dataObj)
                    .sort((a, b) => b.updatedAt - a.updatedAt)
                    .filter(item => item.duration > 0 && (item.time / item.duration) < 0.95) // Don't show if basically finished
                    .slice(0, 10);

                setHistory(sortedHistory);
            } catch (e) {
                console.error("Failed to parse local history", e);
            }
        }
    }, []);

    if (!mounted || history.length === 0) return null;

    return (
        <section className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_20px_rgba(147,51,234,0.6)]" />
                <h2 className="text-xl md:text-2xl font-[900] text-white uppercase tracking-tighter font-headline leading-none">
                    Continue Watching
                </h2>
            </div>

            <div className="relative group">
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <AnimatePresence>
                        {history.map((item, index) => {
                            const progressPct = Math.min(100, Math.max(0, (item.time / item.duration) * 100));
                            const epParam = `${item.epId.replace(`${item.animeId}-episode-`, '')}`;

                            return (
                                <motion.div
                                    key={item.animeId}
                                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                                    className="snap-start flex-none w-[260px] md:w-[320px] relative group/card"
                                >
                                    <Link href={`/watch/${item.animeId}?ep=${epParam}&category=${item.category || 'sub'}`} className="block">
                                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover/card:border-primary/50 transition-colors">
                                            {/* Thumbnail / Poster */}
                                            <Image
                                                src={item.animePoster}
                                                alt={item.animeName}
                                                fill
                                                className="object-cover object-top opacity-70 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700"
                                            />

                                            {/* Overlay Gradients */}
                                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/card:opacity-100 mix-blend-overlay transition-opacity duration-500" />

                                            {/* Play Hover Icon */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform group-hover/card:scale-100 scale-75">
                                                <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur shadow-[0_0_30px_rgba(147,51,234,0.6)] flex items-center justify-center">
                                                    <Play className="w-5 h-5 text-white ml-1 fill-white" />
                                                </div>
                                            </div>

                                            {/* Progress Bar (Bottom Edge) */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progressPct}%` }}
                                                    transition={{ duration: 1, ease: 'easeOut' }}
                                                    className="h-full bg-primary shadow-[0_0_10px_rgba(147,51,234,0.8)]"
                                                />
                                            </div>

                                            {/* Text overlays */}
                                            <div className="absolute bottom-4 left-4 right-4 text-left">
                                                <div className="flex items-center gap-2 mb-1 hidden group-hover/card:flex">
                                                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary uppercase text-white tracking-widest leading-none">
                                                        Resume
                                                    </div>
                                                </div>
                                                <h3 className="text-white font-bold truncate shadow-black drop-shadow-md text-sm md:text-base">
                                                    {item.animeName}
                                                </h3>
                                                <p className="text-xs text-white/70 font-medium">
                                                    Episode {item.epNum} • {Math.round(progressPct)}%
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
