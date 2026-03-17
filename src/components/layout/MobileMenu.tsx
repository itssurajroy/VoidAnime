'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, MessageCircle, Shuffle, Loader2, Home, Film, Tv, Zap, Star, LayoutGrid, Calendar, Trophy, Rss, Mic, LucideIcon, Users, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useSiteConfig } from '@/components/SettingsProvider';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const GENRES = [
    { text: 'Action', url: '/genre/action', color: 'text-[#a3e635]' },
    { text: 'Adventure', url: '/genre/adventure', color: 'text-[#f472b6]' },
    { text: 'Comedy', url: '/genre/comedy', color: 'text-[#fb923c]' },
    { text: 'Drama', url: '/genre/drama', color: 'text-[#c084fc]' },
    { text: 'Fantasy', url: '/genre/fantasy', color: 'text-[#93c5fd]' },
    { text: 'Horror', url: '/genre/horror', color: 'text-[#fda4af]' },
    { text: 'Romance', url: '/genre/romance', color: 'text-[#f87171]' },
    { text: 'Sci-Fi', url: '/genre/sci-fi', color: 'text-[#2dd4bf]' },
    { text: 'Slice of Life', url: '/genre/slice-of-life', color: 'text-[#fbbf24]' },
    { text: 'Supernatural', url: '/genre/supernatural', color: 'text-[#818cf8]' },
];

const IconMap: Record<string, LucideIcon> = {
    Home,
    Film,
    Tv,
    Star,
    Zap,
    Rss
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { config, loading: configLoading } = useSiteConfig();

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-in fade-in duration-300" onClick={onClose} />
            <div 
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-[#0B0C10] z-[210] flex flex-col overflow-y-auto animate-in slide-in-from-left duration-500 border-r border-white/5 shadow-2xl",
                    !isOpen && "hidden"
                )}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-md sticky top-0 z-10">
                    <button onClick={onClose} className="flex items-center gap-2 text-white/40 font-black uppercase tracking-[0.2em] text-[11px] hover:text-primary transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Close Menu
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <Link href="/community" onClick={onClose} className="block">
                        <button className="w-full flex items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all rounded-2xl py-4 group shadow-lg shadow-primary/5">
                            <MessageCircle className="w-5 h-5 text-primary fill-primary/20" />
                            <span className="text-white font-[900] text-[13px] uppercase tracking-[0.2em] italic">Community</span>
                        </button>
                    </Link>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Party', href: '/watch-together', icon: Users },
                            { label: 'Random', href: '/random', icon: Shuffle },
                            { label: 'News', href: '/news', icon: Newspaper },
                        ].map((item) => (
                            <Link key={item.label} href={item.href} onClick={onClose} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all group">
                                <item.icon className="w-5 h-5 text-white/40 group-hover:text-primary mb-2 transition-colors" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="px-3 pb-8 space-y-1">
                    <div className="px-4 py-2 mb-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Navigation</span>
                    </div>
                    {config?.navLinks.map((link) => {
                        const Icon = link.icon ? IconMap[link.icon] : Home;
                        return (
                            <Link key={link.id} href={link.url} onClick={onClose} className="flex items-center gap-4 px-4 py-3 text-white/60 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group">
                                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                <span className="font-black text-[14px] uppercase tracking-tighter">{link.text}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="px-3 pb-12">
                    <div className="px-4 py-4 border-t border-white/5 mt-4 mb-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Genres</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 px-2">
                        {GENRES.map((genre) => (
                            <Link key={genre.text} href={genre.url} onClick={onClose} className="flex items-center px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-primary/20 transition-all group">
                                <span className={cn("text-[12px] font-bold truncate uppercase tracking-tight", genre.color)}>{genre.text}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="p-8 mt-auto border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3 mb-4">
                        <Image src="/logo-icon.png" alt="VoidAnime" width={24} height={24} className="opacity-40" />
                        <span className="text-white/20 font-black uppercase tracking-tighter text-sm">VoidAnime v2.0</span>
                    </div>
                </div>
            </div>
        </>
    );
}
