export const dynamic = 'force-dynamic';

import { getHomeData } from '@/services/anime';
import { getSiteConfig } from '@/lib/site-config';
import { AnimeHero } from '@/components/anime/AnimeHero';
import { LatestUpdates } from '@/components/home/LatestUpdates';
import { AnimeList } from '@/components/home/AnimeList';
import { TopTrending } from '@/components/home/TopTrending';
import { AiringSchedule } from '@/components/home/AiringSchedule';
import { NotificationBar } from '@/components/home/NotificationBar';
import { ShareWidget } from '@/components/home/ShareWidget';
import { TrendingCarousel } from '@/components/home/TrendingCarousel';
import { HomeNews } from '@/components/home/HomeNews';
import { GenreSidebar } from '@/components/home/GenreSidebar';
import { ContinueWatching } from '@/components/home/ContinueWatching';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { getNewsAction } from '@/actions/news';
import type { NewsItem } from '@/types';
import Link from 'next/link';
import { Film, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { logger } from '@/lib/logger';

export default async function HomePage() {
  let homeData = null;
  let siteConfig = null;
  let recentNews: NewsItem[] = [];

  try {
    const [result, config, news] = await Promise.all([
      getHomeData(),
      getSiteConfig(),
      getNewsAction()
    ]);
    homeData = result?.data;
    siteConfig = config;
    recentNews = news;
  } catch (e) {
    logger.error('Home data fetch error:', e);
  }

  if (!homeData) {
    return (
      <div className="container py-12 text-center text-white/40">
        <p className="text-red-500 mb-2">Failed to load homepage data.</p>
        <p className="text-sm">Please try again later.</p>
      </div>
    );
  }

  const {
    spotlightAnimes,
    trendingAnimes,
    latestEpisodeAnimes,
    topUpcomingAnimes,
    latestCompletedAnimes,
    mostFavoriteAnimes,
    top10Animes,
    mostPopularAnimes,
    genres
  } = homeData;

  const newReleases = mostFavoriteAnimes;

  return (
    <div className="min-h-screen bg-[#0B0C10] font-sans overflow-x-hidden w-full max-w-[100vw]">
      {/* Cinematic Ambient Glow (Subtle) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[100vw] sm:w-[1000px] h-[600px] bg-primary/5 blur-[120px] pointer-events-none rounded-full z-0 opacity-50" />

      {/* Hero — Full Width */}
      {spotlightAnimes && spotlightAnimes.length > 0 && (
        <AnimeHero animes={spotlightAnimes} />
      )}

      {/* Trending Slider */}
      {trendingAnimes && trendingAnimes.length > 0 && (
        <div className="mt-[-40px] md:mt-[-60px] relative z-20">
          <TrendingCarousel animes={trendingAnimes} />
        </div>
      )}

      {/* Share bar — Full Width */}
      <div className="bg-[#12141D] border-y border-white/5 relative z-10">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-20 max-w-[1920px]">
          <ShareWidget stats={siteConfig?.shareStats} />
        </div>
      </div>

      {/* Main layout: Content + Sidebar */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-20 max-w-[1920px] relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-10 md:gap-12 pt-8 md:pt-12">

          {/* === MAIN CONTENT === */}
          <div className="min-w-0 space-y-12 md:space-y-20">
            {/* Notification */}
            <NotificationBar />

            {/* Continue Watching (Local History) */}
            <ContinueWatching />

            {/* Latest Updates */}
            {latestEpisodeAnimes && <LatestUpdates animes={latestEpisodeAnimes} />}

            {/* Most Popular Section */}
            {mostPopularAnimes && mostPopularAnimes.length > 0 && (
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_20px_rgba(147,51,234,0.6)]" />
                    <h2 className="text-xl md:text-2xl font-[900] text-white uppercase tracking-tighter font-headline leading-none">Most Popular</h2>
                  </div>
                  <Link
                    href="/category/most-popular"
                    className="group flex items-center gap-2 text-[9px] md:text-[10px] font-black text-white/30 hover:text-primary transition-all uppercase tracking-[0.3em]"
                  >
                    EXPLORE ALL
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <AnimeGrid animes={mostPopularAnimes.slice(0, 12)} columns={6} className="gap-x-3 md:gap-x-4 gap-y-10 md:gap-y-12" />
              </section>
            )}

            {/* Three Column Lists */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {newReleases && (
                <AnimeList
                  title="New Releases"
                  animes={newReleases}
                  icon={<Film className="w-3.5 h-3.5" />}
                  viewMoreHref="/category/most-favorite"
                />
              )}
              {topUpcomingAnimes && (
                <AnimeList
                  title="Upcoming"
                  animes={topUpcomingAnimes}
                  icon={<Clock className="w-3.5 h-3.5" />}
                  viewMoreHref="/category/top-upcoming"
                />
              )}
              {latestCompletedAnimes && (
                <AnimeList
                  title="Completed"
                  animes={latestCompletedAnimes}
                  icon={<CheckCircle className="w-3.5 h-3.5" />}
                  viewMoreHref="/category/completed"
                />
              )}
            </div>

            {/* Recent News */}
            {recentNews && recentNews.length > 0 && (
              <HomeNews news={recentNews} />
            )}
          </div>

          <aside className="space-y-10 mt-6 lg:mt-0 pb-10">
            {top10Animes && <TopTrending top10Animes={top10Animes} />}
            <AiringSchedule />
            {genres && <GenreSidebar genres={genres} />}
          </aside>
        </div>
      </div>
    </div>
  );
}
