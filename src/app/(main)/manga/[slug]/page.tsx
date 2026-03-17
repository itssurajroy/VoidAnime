import { notFound } from 'next/navigation';
import { getMangaById } from '@/lib/api/anilist';
import { getMangaDexLiveChapters } from '@/lib/api/mangadex';
import { extractIdFromSlug } from '@/lib/utils/slugify';
import { MangaDetailHero } from '@/components/manga/MangaDetailHero';
import { MangaDetailContent } from '@/components/manga/MangaDetailContent';
import { ExternalTrackingLinks } from '@/components/shared/ExternalTrackingLinks';
import { MediaCarousel } from '@/components/shared/MediaCarousel';
import { Sparkles } from 'lucide-react';
import { AdUnit } from '@/components/ads/AdUnit';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getMediaData(slug: string) {
  const extractedId = extractIdFromSlug(slug);
  
  if (!extractedId) {
    const cleanQuery = slug.replace(/-(\d+)$/, '').replace(/-/g, ' ').trim();
    return { id: null, query: cleanQuery };
  }

  try {
    const data = await getMangaById(extractedId);
    if (data?.Media) {
      const titleToSearch = data.Media.title.romaji || data.Media.title.english;
      const mangadexData = await getMangaDexLiveChapters(titleToSearch);
      
      return {
        ...data.Media,
        mangadexData,
      };
    }
  } catch (e) {
    console.error(`[MangaDetail] Fetch failed for ${extractedId}:`, e);
  }
  
  return null;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const media = await getMediaData(slug);
  if (!media || !media.id) return { title: 'Not Found | VoidAnime' };

  return {
    title: `${media.title.english || media.title.romaji} - Read & Track | VoidAnime`,
    description: media.description?.replace(/<[^>]+>/g, '').substring(0, 160) + '...',
    openGraph: {
      images: [media.coverImage.extraLarge],
    }
  };
}

export default async function MangaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const media = await getMediaData(slug);
  
  if (!media || !media.id) notFound();

  const mangadexData = media.mangadexData;
  
  const actualChapters = mangadexData?.liveChapterCount || media.chapters || '?';
  const actualVolumes = mangadexData?.liveVolumeCount || media.volumes || '?';
  const isMangaDexSourced = mangadexData?.liveChapterCount && !media.chapters;

  const recommendations = media.recommendations?.nodes?.map((node: any) => node.mediaRecommendation).filter(Boolean) || [];
  const characters = media.characters?.nodes || [];
  const relations = media.relations?.nodes || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D] selection:bg-anime-primary/30">
      <MangaDetailHero 
        media={media} 
        color={media.coverImage.color}
        actualChapters={actualChapters}
        actualVolumes={actualVolumes}
        isMangaDexSourced={isMangaDexSourced}
      />
      
      <div className="w-full px-4 md:px-8 lg:px-12 relative z-30 mt-6 lg:mt-8">
        <div className="max-w-[2400px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          <div>
            <MangaDetailContent 
              media={media} 
              actualChapters={actualChapters}
              actualVolumes={actualVolumes}
            />
          </div>
          <div className="hidden xl:block space-y-6 lg:space-y-8 sticky top-24 h-fit">
            <ExternalTrackingLinks 
              id={media.id}
              malId={media.idMal}
              siteUrl={media.siteUrl}
              externalLinks={media.externalLinks}
              title={media.title.english || media.title.romaji}
              type="manga"
            />
            <div className="rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-2xl">
              <AdUnit slot="manga-sidebar-ad" format="rectangle" />
            </div>
          </div>
        </div>
      </div>

      {characters.length > 0 && (
        <div className="w-full px-4 md:px-8 lg:px-12 mt-12 mb-8">
          <div className="max-w-[2400px] mx-auto">
            <div className="flex items-center gap-3 mb-6 px-2 text-anime-primary">
              <Sparkles className="w-6 h-6 fill-current" />
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white">Characters</h2>
            </div>
            <MediaCarousel title="" items={characters.slice(0, 20)} type="manga" />
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
                <MediaCarousel title="" items={recommendations} type="manga" />
              </div>
            </div>
          )}

          <div className="w-full">
            <AdUnit slot="manga-detail-bottom" format="auto" className="min-h-[90px] border border-[#2A2A2A] rounded-3xl overflow-hidden shadow-lg bg-[#1A1A1A] backdrop-blur-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
