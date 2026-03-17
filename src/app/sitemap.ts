import { MetadataRoute } from "next";
import { getHomeData } from '@/services/anime';
import type { HomeData, AnimeCard, RankedAnime, BasicAnime, SpotlightAnime } from '@/types';

export const dynamic = 'force-dynamic';

// It's crucial to have the base URL configured via an environment variable.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;


/**
 * Generates the sitemap for the application.
 * A sitemap helps search engines like Google understand the structure of your site
 * and discover all of your content more efficiently.
 * @returns {Promise<MetadataRoute.Sitemap>} A promise that resolves to an array of sitemap entries.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!APP_URL) {
    // This will cause the build to fail if the environment variable is not set,
    // which is a good safeguard to prevent generating an invalid sitemap.
    throw new Error("FATAL: NEXT_PUBLIC_APP_URL environment variable is not set.");
  }
  
  let homeData: HomeData | null = null;
  try {
    const response = await getHomeData();
    homeData = response.data;
  } catch (error) {
     console.error('Sitemap Generation Error: Failed to fetch home data.', error);
     // Return a minimal sitemap if the API fails
     return generateStaticRoutes();
  }


  // Fetch all dynamic routes in parallel for better build performance.
  const [animeRoutes, genreRoutes] = await Promise.all([
    generateAnimeRoutes(homeData),
    generateGenreRoutes(homeData),
  ]);

  // Combine static and dynamic routes into a single sitemap.
  const staticRoutes = generateStaticRoutes();
  
  return [...staticRoutes, ...animeRoutes, ...genreRoutes];
}

/**
 * Generates sitemap entries for the site's static pages.
 * These are pages with fixed URLs that don't depend on external data.
 * @returns {MetadataRoute.Sitemap} An array of sitemap entries.
 */
function generateStaticRoutes(): MetadataRoute.Sitemap {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
    if (!APP_URL) return [];
    return [
      {
          url: `${APP_URL}/azlist`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
      },
      {
        url: `${APP_URL}/search`,
        lastModified: new Date(),
        changeFrequency: 'always', // Search page content changes with every query.
        priority: 0.8,
      },
    ];
}


/**
 * Generates sitemap entries for all individual anime pages.
 * It fetches a comprehensive list of animes from the home page data source,
 * de-duplicates them, and creates a URL for each one.
 * @returns {Promise<MetadataRoute.Sitemap>} A promise resolving to an array of sitemap entries.
 */
async function generateAnimeRoutes(homeData: HomeData | null): Promise<MetadataRoute.Sitemap> {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
  if (!homeData || !APP_URL) return [];

  try {
    // Aggregate all anime entries from different sections of the home page.
    const allAnimes: (AnimeCard | RankedAnime | BasicAnime | SpotlightAnime)[] = [
      ...(homeData.spotlightAnimes || []),
      ...(homeData.trendingAnimes || []),
      ...(homeData.latestEpisodeAnimes || []),
      ...(homeData.mostFavoriteAnimes || []),
      ...(homeData.mostPopularAnimes || []),
      ...(homeData.topAiringAnimes || []),
      ...(homeData.topUpcomingAnimes || []),
      ...(homeData.latestCompletedAnimes || []),
      ...(homeData.top10Animes?.today || []),
      ...(homeData.top10Animes?.week || []),
      ...(homeData.top10Animes?.month || []),
    ];

    // Using a Map is an efficient way to get unique animes by their ID.
    const uniqueAnimes = Array.from(new Map(allAnimes.filter(a => a && a.id).map(anime => [anime.id, anime])).values());

    return uniqueAnimes.map((anime) => ({
      url: `${APP_URL}/watch/${anime.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly', // Anime details don't change that often.
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap Generation Error: Failed to process anime data.', error);
    // Return an empty array on error to prevent breaking the build.
    return [];
  }
}

/**
 * Generates sitemap entries for all genre pages.
 * @returns {Promise<MetadataRoute.Sitemap>} A promise resolving to an array of sitemap entries.
 */
async function generateGenreRoutes(homeData: HomeData | null): Promise<MetadataRoute.Sitemap> {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
    if (!homeData || !APP_URL) return [];
  try {
    if (!homeData.genres || homeData.genres.length === 0) {
      return [];
    }
    
    return homeData.genres.map((genre) => ({
      url: `${APP_URL}/genre/${genre.toLowerCase().replace(/ /g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'daily', // Genre pages are updated frequently with new anime.
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap Generation Error: Failed to process genre data.', error);
    return [];
  }
}
