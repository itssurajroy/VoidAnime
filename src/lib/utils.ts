import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a watch page slug to extract animeId and episodeId.
 * Supports formats:
 * - /watch/20253-episode-162237 -> { animeId: "20253", episodeId: "162237" }
 * - /watch/slug-episode-162237 -> { animeId: "slug", episodeId: "162237" }
 */
export function parseWatchSlug(slug: string): { animeId: string; episodeId?: string } {
  const match = slug.match(/^(.+)-episode-(.+)$/);
  if (match) {
    return { animeId: match[1], episodeId: match[2] };
  }
  return { animeId: slug };
}

/**
 * Normalizes a potentially malformed episode ID string to ensure it's in a standard format.
 * Primarily used to extract just the numeric ID from complex URL slugs.
 */
export function normalizeEpisodeId(episodeId: string | undefined): string {
  if (!episodeId) return '';

  // 1. Check for standard HiAnime ?ep= format
  const epMatch = episodeId.match(/[?&]ep=(\d+)/);
  if (epMatch && epMatch[1]) {
    return epMatch[1];
  }

  // 2. Check if it's already just a numeric ID
  if (/^\d+$/.test(episodeId)) {
    return episodeId;
  }

  // 3. Check for trailing numeric ID (e.g. one-piece-100-12345)
  const segments = episodeId.split('-');
  const lastSegment = segments[segments.length - 1];
  if (segments.length > 1 && /^\d+$/.test(lastSegment)) {
    return lastSegment;
  }

  return episodeId;
}
