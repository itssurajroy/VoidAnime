'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import type { EpisodeServersData } from '@/types';

interface StreamingSettingsProps {
    servers: EpisodeServersData | null;
    selectedCategory: string;
    selectedServer: string;
    handleCategoryChange: (cat: string) => void;
    handleServerChange: (server: string, cat: string) => void;
    failedServers: React.MutableRefObject<Set<string>>;
    currentEpisodeNumber: number | string;
}

export function StreamingSettings({
    servers,
    selectedCategory,
    selectedServer,
    handleCategoryChange,
    handleServerChange,
    failedServers,
    currentEpisodeNumber
}: StreamingSettingsProps) {
    return (
        <GlassPanel intensity="medium" className="p-8 md:p-12 rounded-[48px] border-white/5 space-y-10 shadow-2xl relative border-t-primary/20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-1 h-5 bg-primary rounded-full shadow-[0_0_15px_#9333ea]" />
                        <h2 className="text-2xl sm:text-3xl font-[1000] text-white uppercase tracking-tighter italic leading-none">
                            Episode <span className="text-primary">{currentEpisodeNumber}</span>
                        </h2>
                    </div>
                    <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3 italic">
                        <Activity className="w-4 h-4 text-primary" />Streaming Servers
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                    {['sub', 'dub', 'raw'].map(cat => (servers && (servers[cat as keyof EpisodeServersData] as any[])?.length > 0) && (
                        <button 
                            key={cat} 
                            onClick={() => handleCategoryChange(cat)} 
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500", 
                                selectedCategory === cat ? "bg-primary text-black shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {servers && (servers[selectedCategory as keyof EpisodeServersData] as any[])?.map((srv, i) => (
                    <motion.button 
                        key={`${srv.serverId}-${i}`} 
                        onClick={() => handleServerChange(srv.serverName, selectedCategory)} 
                        className={cn(
                            "group relative h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 rounded-2xl border transition-all duration-500 overflow-hidden", 
                            selectedServer === srv.serverName 
                                ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/5" 
                                : failedServers.current.has(`${selectedCategory}-${srv.serverName}`) 
                                    ? "bg-red-500/5 border-red-500/20 opacity-50 cursor-not-allowed" 
                                    : "bg-white/[0.02] border-white/5 hover:border-primary/30 hover:bg-white/[0.05]"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500", 
                                selectedServer === srv.serverName ? "bg-primary text-black" : "bg-white/5 text-white/40 group-hover:bg-primary/20 group-hover:text-primary"
                            )}>
                                <Activity className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-2">
                                    <p className={cn("text-[11px] font-black uppercase tracking-widest", selectedServer === srv.serverName ? "text-primary" : "text-white/60")}>
                                        {srv.serverName}
                                    </p>
                                    {srv.serverName.toLowerCase() === 'hd-2' && (
                                        <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[7px] font-black uppercase tracking-tighter">Recommended</span>
                                    )}
                                </div>
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-0.5">High Speed</p>
                            </div>
                        </div>
                        {selectedServer === srv.serverName && (
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#9333ea]" />
                        )}
                    </motion.button>
                ))}
            </div>
        </GlassPanel>
    );
}
