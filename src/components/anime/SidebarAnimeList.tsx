'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { AnimeCard } from '@/types';

interface SidebarAnimeListProps {
    title: string;
    animes: AnimeCard[];
}

export function SidebarAnimeList({ title, animes }: SidebarAnimeListProps) {
    return (
        <section className="space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">{title}</h3>
            <div className="grid grid-cols-1 gap-3">
                {animes.slice(0, 5).map((anime) => {
                    return (
                        <Link
                            key={anime.id}
                            href={`/anime/${anime.id}`}
                            className="group flex gap-4 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/10 transition-all duration-500 saas-shadow"
                        >
                            <div className="relative w-12 aspect-[2/3] rounded-xl overflow-hidden shrink-0 border border-white/5">
                                <Image src={anime.poster} alt={anime.name} fill sizes="48px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-primary transition-colors">
                                    {anime.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-white/30 uppercase tabular-nums">{anime.type || 'TV'}</span>
                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                    <span className="text-[9px] font-black text-white/30 uppercase tabular-nums">{anime.episodes?.sub || 0} EPS</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
