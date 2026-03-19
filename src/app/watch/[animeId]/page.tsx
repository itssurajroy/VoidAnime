import { notFound } from 'next/navigation';
import { getAnimeDetails } from '@/services/anime';
import { getAniListExtras } from '@/services/anilist';
import WatchClient from './WatchClient';
import { logger } from '@/lib/logger';
import { parseWatchSlug } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ animeId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { animeId: rawAnimeId } = await params;
  const resolvedSearchParams = await searchParams;
  
  if (!rawAnimeId) {
    return notFound();
  }

  const { animeId, episodeId: pathEpisodeId } = parseWatchSlug(rawAnimeId);
  const episodeIdQuery = typeof resolvedSearchParams.ep === 'string' ? resolvedSearchParams.ep : pathEpisodeId || '';
  const category = (resolvedSearchParams.category === 'dub') ? 'dub' : 'sub';

  let animeDetail: any = null;
  let aniListData: any = null;

  try {
    const detailRes = await getAnimeDetails(animeId);
    animeDetail = detailRes?.data;
    
    if (animeDetail?.data?.name) {
        aniListData = await getAniListExtras(animeDetail.data.name).catch(err => {
            logger.error(`AniList fetch failed for ${animeDetail.data.name}:`, err);
            return null;
        });
    }
  } catch (error) {
    logger.error("Global WatchPage data fetching error:", error);
  }

  if (!animeDetail || !animeDetail.data) {
    logger.warn(`No anime data found for ${animeId}, returning 404`);
    return notFound();
  }

  const episodes = animeDetail.providerEpisodes || [];
  
  // Ensure we have a valid episode ID to pass down
  const finalEpisodeId = episodeIdQuery || (episodes.length > 0 ? episodes[0].episodeId : '');

  // Compatibility mapping for existing components
  const legacyAnimeFormat = {
      ...animeDetail.data,
      anime: {
          info: {
              ...animeDetail.data,
              description: animeDetail.data.synopsis
          },
          moreInfo: {
              ...animeDetail.data,
              studios: animeDetail.data.studios?.join(','),
              producers: animeDetail.data.producers
          }
      }
  };

  return (
    <WatchClient
      animeId={animeId}
      episodeId={finalEpisodeId}
      category={category}
      episodes={episodes}
      animeData={legacyAnimeFormat}
      aniListData={aniListData}
    />
  );
}
