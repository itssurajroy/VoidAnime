import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getNewsBySlugAction } from '@/actions/news';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, Calendar, User, Tag, Clock, Share2, MessageSquare } from 'lucide-react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const news = await getNewsBySlugAction(slug);
    if (!news) return { title: 'Article Not Found' };

    return {
        title: `${news.title} | VoidAnime News`,
        description: news.description,
        openGraph: {
            title: news.title,
            description: news.description,
            images: news.image ? [news.image] : [],
        }
    };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const news = await getNewsBySlugAction(slug);

    if (!news) return notFound();

    return (
        <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 pb-32 relative overflow-hidden">
            {/* ─── ANIMATED BACKGROUND MESH ─── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <div className="container max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 pt-28">
                <div className="mb-12">
                    <Breadcrumbs items={[
                        { label: "News", href: "/news" },
                        { label: news.title }
                    ]} />
                </div>

                <Link href="/news" className="inline-flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-8 group uppercase text-[10px] font-black tracking-widest">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Feed
                </Link>

                <article className="space-y-12">
                    {/* Header Section */}
                    <div className="space-y-8">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-[1000] uppercase tracking-widest">
                                {news.type === 'megaphone' ? 'Announcement' : 'Editorial'}
                            </span>
                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDistanceToNow(new Date(news.createdAt), { addSuffix: true })}
                            </div>
                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                <Clock className="w-3.5 h-3.5" />
                                5 min read
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-[1000] text-white uppercase tracking-tighter italic leading-[0.9] drop-shadow-2xl">
                            {news.title}
                        </h1>

                        <p className="text-white/50 text-xl md:text-2xl font-medium leading-relaxed italic border-l-4 border-primary/20 pl-8">
                            &quot;{news.description}&quot;
                        </p>

                        <div className="flex items-center justify-between py-8 border-y border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shadow-xl">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Written by</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-white uppercase italic tracking-tight">{news.authorName || 'VoidAnime Staff'}</span>
                                        {news.authorRole && news.authorRole !== 'USER' && (
                                            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-[7px] font-black uppercase px-2 py-0.5 rounded-md">Staff Official</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {news.image && (
                        <div className="relative aspect-video rounded-[48px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 group">
                            <Image 
                                src={news.image} 
                                alt={news.title} 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                    )}

                    {/* Content Section */}
                    <GlassPanel intensity="medium" className="p-8 md:p-16 rounded-[48px] border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
                        
                        <div 
                            className="prose prose-invert prose-p:text-white/80 prose-p:leading-relaxed prose-p:text-lg md:prose-p:text-xl max-w-none font-medium selection:bg-primary/30 tracking-wide prose-headings:font-[1000] prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-a:text-primary prose-strong:text-white"
                            dangerouslySetInnerHTML={{ __html: news.content || news.description }}
                        />

                        {/* Tags */}
                        {news.tags && news.tags.length > 0 && (
                            <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-3">
                                {news.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-primary transition-colors cursor-pointer group">
                                        <Tag className="w-3 h-3 group-hover:text-primary transition-colors" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </GlassPanel>

                    {/* Related Module Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <GlassPanel intensity="light" className="p-8 rounded-[40px] border-white/5 flex flex-col gap-6 group hover:border-primary/20 transition-all duration-500">
                            <div className="flex items-center gap-4">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-[1000] text-white uppercase tracking-tighter italic">Join Discussion</h3>
                            </div>
                            <p className="text-white/40 text-sm font-medium leading-relaxed italic">
                                Share your thoughts about this update with the VoidAnime community.
                            </p>
                            <Link href="/community">
                                <Button className="w-full h-14 rounded-2xl bg-white text-black font-[1000] uppercase text-[11px] tracking-[0.2em] hover:bg-primary transition-all shadow-xl">Community Hub</Button>
                            </Link>
                        </GlassPanel>

                        <GlassPanel intensity="light" className="p-8 rounded-[40px] border-white/5 flex flex-col gap-6 group hover:border-primary/20 transition-all duration-500">
                            <div className="flex items-center gap-4">
                                <ChevronLeft className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-[1000] text-white uppercase tracking-tighter italic">Explore More</h3>
                            </div>
                            <p className="text-white/40 text-sm font-medium leading-relaxed italic">
                                Check out other recent announcements and editorials.
                            </p>
                            <Link href="/news">
                                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white/60 hover:text-white font-black uppercase text-[11px] tracking-[0.2em] transition-all">Latest Feed</Button>
                            </Link>
                        </GlassPanel>
                    </div>
                </article>
            </div>
        </div>
    );
}
