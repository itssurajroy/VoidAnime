'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AdminPageContainerProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    className?: string;
}

export function AdminPageContainer({ children, title, description, className }: AdminPageContainerProps) {
    return (
        <div className={cn("min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 relative overflow-x-hidden", className)}>
            {/* ─── ANIMATED BACKGROUND MESH ─── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <div className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10">
                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#9333ea]" />
                        <h1 className="text-4xl md:text-6xl font-[1000] text-white uppercase tracking-tighter italic font-headline leading-none">
                            {title}
                        </h1>
                    </div>
                    {description && (
                        <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] max-w-2xl leading-relaxed italic ml-6">
                            {description}
                        </p>
                    )}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 relative z-20">
                    {children}
                </div>
            </div>
        </div>
    );
}
