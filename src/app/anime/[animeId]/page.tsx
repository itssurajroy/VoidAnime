import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAnimeDetails } from '@/services/anime';
import { getAniListExtras } from '@/services/anilist';
import { logger } from '@/lib/logger';

// Detail Page Components
import { HeroBanner } from '@/components/anime/detail/HeroBanner';
import { AnimeInfoPanel } from '@/components/anime/detail/AnimeInfoPanel';
import { GenreChips } from '@/components/anime/detail/GenreChips';
import { SynopsisSection } from '@/components/anime/detail/SynopsisSection';
import { CharacterCarousel } from '@/components/anime/detail/CharacterCarousel';
import { TrailerSection } from '@/components/anime/detail/TrailerSection';
import { AnimeStats } from '@/components/anime/detail/AnimeStats';
import { RecommendationGrid } from '@/components/anime/detail/RecommendationGrid';
import { ReviewPreview } from '@/components/anime/detail/ReviewPreview';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { getAnimeEpisodes } from '@/services/anime';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ animeId: string }> }): Promise<Metadata> {
    const { animeId } = await params;
    try {
        const detailRes = await getAnimeDetails(animeId);
        const anime = detailRes.data?.anime;
        if (!anime) return {};
        const title = `${anime.info.name} - VoidAnime`;
        return {
            title,
            description: anime.info.description?.slice(0, 160),
            openGraph: { title, images: [anime.info.poster] },
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

    let animeData: any = null;
    let aniListData: any = null;
    let episodeData: any = null;
    
    try {
        const [detailRes, episodesRes] = await Promise.all([
            getAnimeDetails(animeId),
            getAnimeEpisodes(animeId)
        ]);

        animeData = detailRes.data;
        episodeData = episodesRes.data;

        if (animeData?.anime?.info?.name) {
            aniListData = await getAniListExtras(animeData.anime.info.name);
        }
    } catch (error) { logger.error(`Failed to fetch data:`, error); }

    if (!animeData || !animeData.anime) return notFound();

    const { anime, recommendedAnimes, relatedAnimes } = animeData;
    const { info } = anime;
    const episodes = episodeData?.episodes || [];

    // Determine first episode link for "Watch Now"
    // The episodeId from hi-anime usually includes the anime slug, e.g., "anime-slug?ep=123"
    const firstEpisodeId = episodes[0]?.episodeId || `${animeId}?ep=1`;
    const watchLink = `/watch/${firstEpisodeId}`;

    return (
        <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 pb-32 relative overflow-hidden">
            {/* ─── ANIMATED BACKGROUND MESH ─── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-[1920px] relative z-30 pt-4 -mb-12">
                <Breadcrumbs items={[{ label: info.name }]} />
            </div>

            <HeroBanner anime={anime} aniListData={aniListData} watchLink={watchLink} />

            <div className="container mx-auto px-4 md:px-8 max-w-[1920px] relative z-20 space-y-16 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 md:gap-16 items-start">
                    {/* Main Content Column */}
                    <div className="space-y-12 md:space-y-20">
                        <SynopsisSection 
                            description={aniListData?.description || info.description} 
                            tags={aniListData?.tags}
                            animeName={info.name}
                            studios={aniListData?.studios?.nodes?.filter((s: any) => s.isAnimationStudio).map((s: any) => s.name) || (anime.moreInfo?.studios ? anime.moreInfo.studios.split(',') : [])}
                        />
                        
                        <CharacterCarousel characters={aniListData?.characters?.edges} />
                        <TrailerSection trailerUrl={aniListData?.trailer?.id ? `https://www.youtube.com/watch?v=${aniListData.trailer.id}` : null} thumbnailUrl={aniListData?.trailer?.thumbnail} />
                    </div>

                    {/* Sidebar Info Column */}
                    <aside className="space-y-16 lg:sticky lg:top-24">
                        <AnimeStats aniListData={aniListData} moreInfo={anime.moreInfo} />
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 ml-2">
                                <div className="w-1 h-4 bg-primary rounded-full" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Genres</h3>
                            </div>
                            <GenreChips genres={aniListData?.genres || []} />
                        </div>
                        <AnimeInfoPanel anime={anime} aniListData={aniListData} />
                    </aside>
                </div>

                <ReviewPreview />
                <RecommendationGrid 
                    recommendedAnimes={recommendedAnimes} 
                    relatedAnimes={relatedAnimes} 
                    aniListData={aniListData}
                />
            </div>
        </div>
    );
}
