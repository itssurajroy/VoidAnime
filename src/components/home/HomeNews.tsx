import { NewsItem } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calendar, User, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface HomeNewsProps {
    news: NewsItem[];
}

export function HomeNews({ news }: HomeNewsProps) {
    if (!news || news.length === 0) return null;

    return (
        <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_20px_rgba(244,63,94,0.6)]" />
                    <h2 className="text-2xl font-[900] text-white uppercase tracking-tighter font-headline">Recent Articles</h2>
                </div>
                <Link
                    href="/news"
                    className="group flex items-center gap-2 text-[10px] font-black text-white/30 hover:text-primary transition-all uppercase tracking-[0.3em]"
                >
                    BROWSE STUDIO
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.slice(0, 3).map((item) => (
                    <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="group relative flex flex-col bg-[#0B0C10] rounded-[32px] overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-500 saas-shadow"
                    >
                        <div className="relative aspect-[16/9] overflow-hidden">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
                                    item.gradient || "from-primary/20 to-purple-600/20"
                                )}>
                                    <MessageCircle className="w-12 h-12 text-white/10" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />

                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 rounded-xl bg-primary text-black text-[9px] font-black uppercase tracking-widest shadow-2xl">
                                    {item.type}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-4">
                            <h3 className="text-lg font-black text-white group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
                                {item.title}
                            </h3>
                            <p className="text-white/40 text-sm line-clamp-2 font-medium leading-relaxed italic">
                                {item.description}
                            </p>

                            <div className="pt-4 flex items-center justify-between border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/5">
                                        {item.authorAvatar ? (
                                            <Image src={item.authorAvatar} alt="" width={24} height={24} className="object-cover" />
                                        ) : (
                                            <User className="w-3 h-3 text-white/40" />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest truncate max-w-[80px] sm:max-w-none">{item.authorName || 'Void Staff'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/20 shrink-0">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
