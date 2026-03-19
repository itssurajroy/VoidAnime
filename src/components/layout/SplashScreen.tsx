'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';
import { ANIME_QUOTES } from '@/lib/quotes';

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);
    const [quote, setQuote] = useState({ text: "", author: "" });

    useEffect(() => {
        // Pick a random quote
        const randomIndex = Math.floor(Math.random() * ANIME_QUOTES.length);
        setQuote(ANIME_QUOTES[randomIndex]);

        // Show for 2s to let user read the quote
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Remove from DOM after transition
            setTimeout(() => setShouldRender(false), 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!shouldRender) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0e0f11] transition-opacity duration-500",
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="flex flex-col items-center gap-8 z-10 max-w-4xl px-6 text-center">
                <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
                    <div className="relative w-20 h-20 md:w-24 md:h-24">
                        <NextImage
                            src="/logo-icon.png"
                            alt="VoidAnime"
                            fill
                            sizes="96px"
                            className="object-contain drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]"
                            priority
                        />
                    </div>
                    <div className="flex flex-col items-center -space-y-4">
                        <span className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase font-headline">Void</span>
                        <span className="text-primary text-4xl md:text-6xl font-black tracking-tighter uppercase font-headline">Anime</span>
                    </div>
                </div>

                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                    <h3 className="text-white/90 text-lg md:text-2xl font-medium italic leading-relaxed tracking-tight max-w-2xl mx-auto">
                        "{quote.text}"
                    </h3>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/30" />
                        <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">
                            {quote.author}
                        </p>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/30" />
                    </div>
                </div>

                <div className="mt-12">
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary animate-shimmer" style={{ width: '40%', backgroundSize: '200% 100%' }} />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-4">
                <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.4em]">
                    voidanime.online
                </p>
            </div>
        </div>
    );
}
