'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Zap, Info, Shuffle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import type { EpisodeServersData } from '@/types';

// Generate random 4-character server name
function generateServerName(index: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

interface UnifiedServer {
    id: string;
    name: string;
    displayName: string;
    category: string;
    provider: string;
}

interface StreamingSettingsProps {
    servers: EpisodeServersData | null;
    selectedCategory: string;
    selectedServer: string;
    handleCategoryChange: (cat: string) => void;
    handleServerChange: (serverId: string, serverName: string) => void;
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
    // Combine all servers from all providers into one unified list
    const unifiedServers = useMemo(() => {
        const allServers: UnifiedServer[] = [];
        if (!servers) return allServers;

        const categories = ['sub', 'dub', 'raw'] as const;
        
        categories.forEach(category => {
            const categoryServers = servers[category];
            if (categoryServers && Array.isArray(categoryServers)) {
                categoryServers.forEach((srv: any, idx: number) => {
                    const serverId = `${category}-${srv.serverId || srv.serverName || idx}-${generateServerName(idx)}`;
                    allServers.push({
                        id: serverId,
                        name: srv.serverName,
                        displayName: generateServerName(allServers.length),
                        category,
                        provider: srv.provider || 'unknown'
                    });
                });
            }
        });

        return allServers;
    }, [servers]);

    // Get servers for selected category
    const categoryServers = useMemo(() => {
        return unifiedServers.filter(s => s.category === selectedCategory);
    }, [unifiedServers, selectedCategory]);

    // Get available categories
    const availableCategories = useMemo(() => {
        const cats: string[] = [];
        if (servers) {
            if ((servers.sub as any[])?.length > 0) cats.push('sub');
            if ((servers.dub as any[])?.length > 0) cats.push('dub');
            if ((servers.raw as any[])?.length > 0) cats.push('raw');
        }
        return cats;
    }, [servers]);

    return (
        <GlassPanel intensity="medium" className="p-8 md:p-12 rounded-[40px] border-white/5 space-y-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group/settings">
            {/* AMBIENT GLOWS */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10 border-b border-white/[0.05] pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-5">
                        <div className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#9333ea]" />
                        <h2 className="text-3xl sm:text-5xl font-[1000] text-white uppercase tracking-tighter italic leading-none">
                            Episode <span className="text-primary">{currentEpisodeNumber}</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 bg-white/[0.03] px-5 py-2 rounded-full border border-white/5 w-fit">
                         <Activity className="w-4 h-4 text-primary animate-pulse" />
                         <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] italic leading-none">Transmission Control</p>
                    </div>
                </div>
                
                {/* CATEGORY SELECTOR */}
                {availableCategories.length > 0 && (
                    <div className="flex items-center gap-2 bg-black/40 p-2 rounded-[24px] border border-white/10 backdrop-blur-3xl shadow-2xl">
                        {availableCategories.map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => handleCategoryChange(cat)} 
                                className={cn(
                                    "px-6 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative overflow-hidden", 
                                    selectedCategory === cat 
                                        ? "bg-primary text-black shadow-[0_0_25px_rgba(147,51,234,0.4)]" 
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <span className="relative z-10">{cat}</span>
                                {selectedCategory === cat && (
                                    <motion.div layoutId="cat-active" className="absolute inset-0 bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* SERVER GRID */}
            <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                    <Shuffle className="w-4 h-4 text-primary" />
                    <p className="text-[11px] text-white/40 font-black uppercase tracking-[0.3em]">
                        All Servers ({categoryServers.length})
                    </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categoryServers.length > 0 ? (
                        categoryServers.map((srv, i) => (
                            <motion.button 
                                key={srv.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => handleServerChange(srv.id, srv.name)} 
                                className={cn(
                                    "group relative h-16 sm:h-20 flex flex-col items-center justify-center px-4 rounded-2xl border transition-all duration-500 overflow-hidden", 
                                    selectedServer === srv.id 
                                        ? "bg-primary/10 border-primary/40 shadow-[0_0_30px_rgba(147,51,234,0.15)]" 
                                        : failedServers.current.has(`${selectedCategory}-${srv.id}`) 
                                            ? "bg-red-500/5 border-red-500/20 opacity-40 cursor-not-allowed" 
                                            : "bg-white/[0.02] border-white/5 hover:border-primary/30 hover:bg-white/[0.05]"
                                )}
                            >
                                {/* HOVER GLOW EFFECT */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                                <div className="flex flex-col items-center gap-2 relative z-10">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg", 
                                        selectedServer === srv.id ? "bg-primary text-black" : "bg-white/5 text-white/40 group-hover:bg-primary/20 group-hover:text-primary"
                                    )}>
                                        {srv.name.toLowerCase().includes('hd') || srv.name.toLowerCase().includes('vid') ? (
                                            <Zap className="w-5 h-5" />
                                        ) : (
                                            <Shield className="w-5 h-5" />
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-sm font-black uppercase tracking-wider",
                                        selectedServer === srv.id ? "text-primary" : "text-white/60 group-hover:text-white"
                                    )}>
                                        {srv.displayName}
                                    </p>
                                </div>
                                
                                {selectedServer === srv.id && (
                                    <div className="absolute top-2 right-2">
                                        <Activity className="w-4 h-4 text-primary animate-pulse" />
                                    </div>
                                )}
                            </motion.button>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-white/40 text-sm font-medium">
                                No servers available for {selectedCategory}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-[24px] bg-white/[0.02] border border-white/5 relative z-10">
                <Info className="w-5 h-5 text-primary/60 shrink-0 mt-0.5" />
                <p className="text-[11px] text-white/30 font-medium leading-relaxed italic">
                    Switch between servers if buffering occurs. Each server is automatically optimized for streaming.
                </p>
            </div>
        </GlassPanel>
    );
}
