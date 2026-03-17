'use client';

import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import type { NewsItem } from '@/types';

interface NewsCardProps {
    item: NewsItem;
    index: number;
}

export function NewsCard({ item, index }: NewsCardProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <GlassPanel 
                intensity="medium" 
                className={cn(
                    "p-6 md:p-8 rounded-[40px] border-white/5 hover:border-primary/30 transition-all duration-700 group flex flex-col md:flex-row gap-8 overflow-hidden",
                    index === 0 && "md:flex-col p-10 bg-gradient-to-br from-primary/5 to-transparent border-primary/20"
                )}
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                {/* Thumbnail */}
                <div className={cn(
                    "relative rounded-3xl overflow-hidden shrink-0 shadow-2xl border border-white/10 group-hover:border-primary/20 transition-colors duration-700",
                    index === 0 ? "w-full aspect-[21/9]" : "w-full md:w-[320px] aspect-video"
                )}>
                    {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover transition-transform group-hover:scale-105 duration-1000" />
                    ) : (
                        <div className={cn("w-full h-full bg-gradient-to-br", item.gradient || 'from-zinc-800 to-black')} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[9px] font-[1000] uppercase tracking-widest text-primary">
                        {item.type === 'megaphone' ? 'Official' : 'Insight'}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center space-y-6 relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                5 min read
                            </div>
                        </div>
                        <h3 className={cn(
                            "font-[1000] text-white uppercase tracking-tighter italic leading-none transition-colors group-hover:text-primary",
                            index === 0 ? "text-4xl md:text-5xl lg:text-6xl" : "text-2xl md:text-3xl"
                        )}>
                            {item.title}
                        </h3>
                        <p className={cn(
                            "text-white/40 font-medium leading-relaxed italic line-clamp-3",
                            index === 0 ? "text-lg md:text-xl md:line-clamp-none max-w-4xl" : "text-sm"
                        )}>
                            &quot;{item.description}&quot;
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <User className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{item.authorName || 'VOID STAFF'}</span>
                                {item.authorRole && item.authorRole !== 'USER' && (
                                    <span className="text-[7px] font-black text-primary uppercase tracking-widest mt-0.5">Staff Official</span>
                                )}
                            </div>
                        </div>
                        <Link href={`/news/${item.slug || item.id}`}>
                            <Button className="h-12 px-8 rounded-2xl bg-white text-black font-[1000] uppercase text-[10px] tracking-widest hover:bg-primary transition-all shadow-xl group/btn overflow-hidden relative">
                                <span className="relative z-10">Access Article</span>
                                <ArrowRight className="w-4 h-4 ml-3 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </GlassPanel>
        </motion.div>
    );
}
