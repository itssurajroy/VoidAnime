import { notFound } from 'next/navigation';
import { getAnimeDetails } from '@/services/anime';
import { getAniListExtras } from '@/services/anilist';
import WatchClient from './WatchClient';
import type { Episode } from '@/types';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ animeId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { animeId } = await params;
  const resolvedSearchParams = await searchParams;
  
  if (!animeId) {
    return notFound();
  }

  // Extract numeric ID from slug (e.g., sorcerer-hunters-4787 -> 4787)
  const idSegments = animeId.split('-');
  const numericId = idSegments[idSegments.length - 1];
  
  const episodeIdQuery = typeof resolvedSearchParams.ep === 'string' ? resolvedSearchParams.ep : '';
  const category = (resolvedSearchParams.category === 'dub') ? 'dub' : 'sub';

  let episodes: Episode[] = [];
  let animeData: any = null;
  let aniListData: any = null;

  const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || 'https://void-ivory-beta.vercel.app';

  try {
    // 1. Fetch Anime Details
    const detailsRes = await getAnimeDetails(animeId).catch(err => {
        logger.error(`Details fetch failed for ${animeId}:`, err);
        return null;
    });
    
    if (detailsRes?.data) {
        animeData = detailsRes.data;
        
        // 1.5 Fetch AniList Extras
        aniListData = await getAniListExtras(animeData.anime.info.name).catch(err => {
            logger.error(`AniList fetch failed for ${animeData.anime.info.name}:`, err);
            return null;
        });
    }

    // 2. Fetch Episodes using the v2 endpoint
    const v2Res = await fetch(`${EXTERNAL_API_BASE_URL}/api/v2/hianime/anime/${animeId}/episodes`, {
        next: { revalidate: 3600 }
    }).catch(err => {
        logger.error(`Episode fetch (v2) failed for ${animeId}:`, err);
        return null;
    });
    
    if (v2Res?.ok) {
        const v2Data = await v2Res.json();
        episodes = v2Data.data?.episodes || v2Data.episodes || [];
    }

    // Fallback to numeric ID if v2 slug-based fetch failed or returned empty
    if (episodes.length === 0 && numericId) {
        const epResponse = await fetch(`${EXTERNAL_API_BASE_URL}/anime/episodes/${numericId}`, {
            next: { revalidate: 3600 }
        }).catch(err => {
            logger.error(`Episode fetch (numeric) fallback failed for ${numericId}:`, err);
            return null;
        });
        
        if (epResponse?.ok) {
            const epData = await epResponse.json();
            episodes = epData.episodes || epData.data?.episodes || [];
        }
    }
  } catch (error) {
    logger.error("Global WatchPage data fetching error:", error);
  }

  // Final validation before rendering
  if (!animeData || !animeData.anime) {
    logger.warn(`No anime data found for ${animeId}, returning 404`);
    return notFound();
  }

  // Ensure we have a valid episode ID to pass down
  const finalEpisodeId = episodeIdQuery || (episodes.length > 0 ? episodes[0].episodeId : '');

  return (
    <WatchClient
      animeId={animeId}
      episodeId={finalEpisodeId}
      category={category}
      episodes={episodes}
      animeData={animeData}
      aniListData={aniListData}
    />
  );
}
