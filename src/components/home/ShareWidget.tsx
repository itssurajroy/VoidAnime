'use client';

import { Heart, Facebook, Twitter, MessageCircle, Send } from 'lucide-react';
import type { ShareStats } from '@/types/site';

interface ShareWidgetProps {
    stats?: ShareStats;
}

export function ShareWidget({ stats }: ShareWidgetProps) {
    const defaultStats: ShareStats = {
        facebook: '34.6k',
        twitter: '31.7k',
        telegram: '37.4k',
        whatsapp: '42.1k',
        total: '195,420',
    };

    const displayStats = stats || defaultStats;

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4 py-5">
            {/* Love this site - HiAnime Style */}
            <div className="flex items-center gap-4 mr-auto min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="currentColor" />
                </div>
                <div className="space-y-0.5 min-w-0">
                    <p className="text-primary text-[13px] sm:text-[14px] font-black uppercase tracking-tighter leading-none truncate">Love VoidAnime?</p>
                    <p className="text-white/30 text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-none truncate">Share with friends</p>
                </div>
            </div>

            {/* Share count - HiAnime Style */}
            <div className="hidden lg:flex flex-col items-center px-6 border-x border-white/5">
                <span className="text-white/60 text-[16px] font-black tabular-nums tracking-tighter">{displayStats.total}</span>
                <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Total Shares</span>
            </div>

            {/* Social Cluster - HiAnime Style */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center w-full sm:w-auto gap-2 sm:gap-3">
                <button className="flex-1 sm:flex-none h-10 px-4 rounded-xl flex items-center justify-center gap-2.5 bg-[#1877f2] hover:brightness-110 text-white transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-[#1877f2]/20">
                    <Facebook className="w-4 h-4 fill-current" />
                    <span className="text-[11px] font-black uppercase tracking-wider">{displayStats.facebook}</span>
                </button>
                <button className="flex-1 sm:flex-none h-10 px-4 rounded-xl flex items-center justify-center gap-2.5 bg-[#1da1f2] hover:brightness-110 text-white transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-[#1da1f2]/20">
                    <Twitter className="w-4 h-4 fill-current" />
                    <span className="text-[11px] font-black uppercase tracking-wider">{displayStats.twitter}</span>
                </button>
                <button className="flex-1 sm:flex-none h-10 px-4 rounded-xl flex items-center justify-center gap-2.5 bg-[#0088cc] hover:brightness-110 text-white transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-[#0088cc]/20">
                    <Send className="w-4 h-4 fill-current" />
                    <span className="text-[11px] font-black uppercase tracking-wider">{displayStats.telegram}</span>
                </button>
                <button className="flex-1 sm:flex-none h-10 px-4 rounded-xl flex items-center justify-center gap-2.5 bg-[#25d366] hover:brightness-110 text-white transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-[#25d366]/20">
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span className="text-[11px] font-black uppercase tracking-wider">{displayStats.whatsapp}</span>
                </button>
            </div>
        </div>
    );
}
