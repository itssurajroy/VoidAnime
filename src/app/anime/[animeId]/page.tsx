import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAnimeDetails } from '@/services/anime';
import { getAniListExtras } from '@/services/anilist';
import { logger } from '@/lib/logger';

// Detail Page Components
import { GenreChips } from '@/components/anime/detail/GenreChips';
import { SynopsisSection } from '@/components/anime/detail/SynopsisSection';
import { CharacterCarousel } from '@/components/anime/detail/CharacterCarousel';
import { TrailerSection } from '@/components/anime/detail/TrailerSection';
import { AnimeStats } from '@/components/anime/detail/AnimeStats';
import { RecommendationGrid } from '@/components/anime/detail/RecommendationGrid';
import { ReviewPreview } from '@/components/anime/detail/ReviewPreview';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { HeroBanner } from '@/components/anime/detail/HeroBanner';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ animeId: string }> }): Promise<Metadata> {
    const { animeId } = await params;
    try {
        const detailRes = await getAnimeDetails(animeId);
        const anime = detailRes?.data?.data;
        if (!anime) return {};
        const title = `${anime.name} - VoidAnime`;
        return {
            title,
            description: anime.synopsis?.slice(0, 160),
            openGraph: { title, images: [anime.posterImage] },
        };
    } catch (error) { return { title: 'Anime Details' }; }
}

export default async function AnimeDetailsPage({
    params,
}: {
    params: Promise<{ animeId: string }>;
}) {
    const { animeId } = await params;
    if (!animeId) return notFound();

    let animeDetail: any = null;
    let aniListData: any = null;
    
    try {
        const detailRes = await getAnimeDetails(animeId);
        animeDetail = detailRes?.data;

        if (animeDetail?.data?.name) {
            aniListData = await getAniListExtras(animeDetail.data.name);
        }
    } catch (error) { logger.error(`Failed to fetch data:`, error); }

    if (!animeDetail || !animeDetail.data) return notFound();

    const anime = animeDetail.data;
    const { providerEpisodes, characters, recommendedAnime, relatedAnime, relatedSeasons, promotionVideos } = animeDetail;

    const firstEpisodeId = providerEpisodes?.[0]?.episodeId || `${animeId}?ep=1`;
    const watchLink = `/watch/${firstEpisodeId}`;

    const legacyAnimeFormat = {
        ...anime,
        info: {
            ...anime,
            id: animeId,
            description: anime.synopsis,
            poster: anime.posterImage,
            stats: {
                type: anime.type,
                duration: anime.duration,
                rating: anime.rating,
                quality: anime.quality,
                episodes: {
                    sub: anime.episodes?.sub || 0,
                    dub: anime.episodes?.dub || 0,
                }
            }
        },
        moreInfo: {
            ...anime,
            japanese: anime.japanese,
            synonyms: anime.altnames,
            aired: anime.releaseDate,
            status: anime.status,
            studios: anime.studios?.join(','),
            producers: anime.producers,
            malscore: anime.score,
            rank: '??'
        }
    };

    return (
        <main className="min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 pb-32 relative overflow-hidden">
            {/* ─── ANIMATED BACKGROUND MESH ─── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            {/* ─── BREADCRUMBS ─── */}
            <div className="container mx-auto px-4 md:px-8 max-w-[1920px] relative z-40 pt-6">
                <Breadcrumbs items={[{ label: 'Anime', href: '/search' }, { label: anime.name }]} />
            </div>

            {/* ─── HERO BANNER SECTION ─── */}
            <div className="relative z-30">
                <HeroBanner anime={legacyAnimeFormat} aniListData={aniListData} watchLink={watchLink} />
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="container mx-auto px-4 md:px-8 max-w-[1920px] relative z-20 space-y-24 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 md:gap-20 items-start">
                    
                    {/* LEFT COLUMN: PRIMARY INFO */}
                    <div className="space-y-20">
                        {/* SYNOPSIS & TAGS */}
                        <SynopsisSection 
                            description={aniListData?.description || anime.synopsis} 
                            tags={aniListData?.tags}
                            animeName={anime.name}
                            studios={aniListData?.studios?.nodes?.filter((s: any) => s.isAnimationStudio).map((s: any) => s.name) || anime.studios || []}
                        />
                        
                        {/* CHARACTER CAROUSEL */}
                        <CharacterCarousel characters={aniListData?.characters?.edges || characters?.map((c: any) => ({
                            node: {
                                id: c.id,
                                name: { full: c.name },
                                image: { large: c.posterImage }
                            },
                            role: c.role,
                            voiceActors: [
                                {
                                    id: c.voiceActor?.id,
                                    name: { full: c.voiceActor?.name },
                                    image: { large: c.voiceActor?.posterImage },
                                    language: c.voiceActor?.language
                                }
                            ]
                        }))} />

                        {/* TRAILER SECTION */}
                        <TrailerSection 
                            trailerUrl={aniListData?.trailer?.id ? `https://www.youtube.com/watch?v=${aniListData.trailer.id}` : (promotionVideos?.[0]?.url || null)} 
                            thumbnailUrl={aniListData?.trailer?.thumbnail || promotionVideos?.[0]?.thumbnail} 
                        />

                        {/* REVIEWS PREVIEW */}
                        <ReviewPreview />
                    </div>

                    {/* RIGHT COLUMN: SIDEBAR STATS */}
                    <aside className="space-y-16 lg:sticky lg:top-24">
                        {/* STATS PANEL */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                            <div className="relative">
                                <AnimeStats aniListData={aniListData} moreInfo={legacyAnimeFormat.moreInfo} />
                            </div>
                        </div>

                        {/* GENRE SECTION */}
                        <div className="space-y-8 bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[32px] hover:border-primary/30 transition-all duration-500">
                            <div className="flex items-center gap-3 ml-1">
                                <div className="w-1.5 h-5 bg-primary rounded-full shadow-[0_0_15px_rgba(147,51,234,0.6)]" />
                                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">Categories</h3>
                            </div>
                            <GenreChips genres={aniListData?.genres || anime.genres || []} />
                        </div>

                        {/* INFORMATION GRID */}
                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-[32px] hover:border-primary/30 transition-all duration-500 space-y-8">
                             <div className="flex items-center gap-3 ml-1">
                                <div className="w-1.5 h-5 bg-primary rounded-full shadow-[0_0_15px_rgba(147,51,234,0.6)]" />
                                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white">Information</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {[
                                    { label: 'Japanese', value: anime.japanese },
                                    { label: 'Aired', value: anime.releaseDate },
                                    { label: 'Premiered', value: aniListData?.season ? `${aniListData.season} ${aniListData.seasonYear}` : 'TBA' },
                                    { label: 'Status', value: anime.status },
                                    { label: 'Score', value: aniListData?.averageScore ? `${aniListData.averageScore}%` : anime.score },
                                    { label: 'Studios', value: anime.studios?.join(', ') || 'TBA' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center group/item border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.label}</span>
                                        <span className="text-xs font-bold text-white group-hover/item:text-primary transition-colors text-right max-w-[200px] truncate">{item.value || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* RECOMMENDATIONS & RELATED */}
                <div className="pt-12 border-t border-white/5">
                    <RecommendationGrid 
                        recommendedAnimes={recommendedAnime?.map((a: any) => ({
                            ...a,
                            poster: a.posterImage
                        })) || []} 
                        relatedAnimes={relatedAnime?.map((a: any) => ({
                            ...a,
                            poster: a.posterImage
                        })) || []} 
                        aniListData={aniListData}
                    />
                </div>
            </div>
        </main>
    );
}
