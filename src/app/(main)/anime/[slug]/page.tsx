import { notFound } from 'next/navigation';
import { getAnimeById, searchAnime } from '@/lib/api/anilist';
import { extractIdFromSlug } from '@/lib/utils/slugify';
import { DetailHero } from '@/components/anime/detail/DetailHero';
import { DetailContent } from '@/components/anime/detail/DetailContent';
import { MediaCarousel } from '@/components/shared/MediaCarousel';
import { ExternalTrackingLinks } from '@/components/shared/ExternalTrackingLinks';
import { Sparkles } from 'lucide-react';
import { AdUnit } from '@/components/ads/AdUnit';

import { 
  RankingsSidebar, 
  StatsSidebar, 
  StreamingSidebar, 
  RelatedSidebar 
} from '@/components/anime/detail/sidebar';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

async function getMediaData(slug: string) {
  const extractedId = extractIdFromSlug(slug);
  
  // 1. Try fetching by extracted ID first
  if (extractedId) {
    try {
      const data = await getAnimeById(extractedId);
      if (data?.Media) {
        return data.Media;
      }
    } catch (e) {
      console.error(`[Detail] ID Fetch failed for ${extractedId}:`, e);
    }
  }

  // 2. Fallback: Search by clean slug string
  try {
    const cleanQuery = slug.replace(/-(\d+)$/, '').replace(/-/g, ' ').trim();
    const searchData = await searchAnime(cleanQuery, 1);
    const firstResult = searchData?.Page?.media?.[0];
    
    if (firstResult?.id) {
      const data = await getAnimeById(firstResult.id);
      if (data?.Media) {
        return data.Media;
      }
    }
  } catch (e) {
    console.error(`[Detail] Fallback search failed for ${slug}:`, e);
  }
  
  return null;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const media = await getMediaData(slug);
  if (!media) return { title: 'Not Found | VoidAnime' };

  return {
    title: `${media.title.english || media.title.romaji} - Watch & Track | VoidAnime`,
    description: media.description?.replace(/<[^>]+>/g, '').substring(0, 160) + '...',
    openGraph: {
      images: [media.coverImage.extraLarge],
    }
  };
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const media = await getMediaData(slug);
  
  if (!media) notFound();

  const recommendations = media.recommendations?.nodes?.map((node: any) => node.mediaRecommendation).filter(Boolean) || [];
  const characters = media.characters?.nodes || [];
  const relations = media.relations?.nodes || [];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-dark-bg)] selection:bg-anime-primary/30">
      <DetailHero media={media} color={media.coverImage.color} />
      
      <div className="w-full px-4 md:px-8 lg:px-12 relative z-30 mt-6 lg:mt-8">
        <div className="max-w-[2400px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          <div className="min-w-0">
            <DetailContent media={media} />
          </div>
          <div className="hidden xl:block space-y-6 lg:space-y-8 sticky top-24 h-fit">
            <RankingsSidebar rankings={media.rankings} />
            <StatsSidebar stats={{ scoreDistribution: media.stats?.scoreDistribution, statusDistribution: media.stats?.statusDistribution }} favorites={media.favourites} />
            <StreamingSidebar externalLinks={media.externalLinks} />
            <RelatedSidebar relations={relations} />
            
            <ExternalTrackingLinks 
              id={media.id}
              malId={media.idMal}
              siteUrl={media.siteUrl}
              externalLinks={media.externalLinks}
              title={media.title.english || media.title.romaji}
              type="anime"
            />
            <div className="rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-2xl">
              <AdUnit slot="anime-sidebar-ad" format="rectangle" />
            </div>
          </div>
        </div>
      </div>

      {characters.length > 0 && (
        <div className="w-full px-4 md:px-8 lg:px-12 mt-12 mb-8">
          <div className="max-w-[2400px] mx-auto">
            <div className="flex items-center gap-3 mb-6 px-2 text-anime-primary">
              <Sparkles className="w-6 h-6 fill-current" />
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white">Characters & Voice Actors</h2>
            </div>
            <MediaCarousel title="" items={characters.slice(0, 20)} />
          </div>
        </div>
      )}

      <div className="w-full px-4 md:px-8 lg:px-12 mt-12 mb-24 relative z-30">
        <div className="max-w-[2400px] mx-auto">
          {recommendations.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6 px-2 text-anime-primary">
                <Sparkles className="w-6 h-6 fill-current" />
                <h2 className="text-xl sm:text-2xl font-heading font-black text-white">More Like This</h2>
              </div>
              <div className="-mx-4 sm:mx-0">
                <MediaCarousel title="" items={recommendations} />
              </div>
            </div>
          )}

          <div className="w-full">
            <AdUnit slot="anime-detail-bottom" format="auto" className="min-h-[90px] border border-[#2A2A2A] rounded-3xl overflow-hidden shadow-lg bg-[#1A1A1A] backdrop-blur-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
