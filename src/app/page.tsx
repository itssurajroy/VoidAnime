import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTrending, getSeasonalAnime, getHiddenGems, getTopAnime, getRecentReviews } from '@/lib/api/anilist';
import { AdUnit } from '@/components/ads/AdUnit';
import { MediaCarousel } from '@/components/shared/MediaCarousel';
import { OnThisDay } from '@/components/home/OnThisDay';
import { GenreQuickLinks } from '@/components/home/GenreQuickLinks';
import { TopRankings } from '@/components/home/TopRankings';
import { RecentCommunityActivity } from '@/components/home/RecentCommunityActivity';
import { HomeHeroWrapper } from '@/components/home/HomeHeroWrapper';
import { ContinueWatchingSection } from '@/components/home/ContinueWatching';
import { ParallaxHeroBackground } from '@/components/home/ParallaxHeroBackground';
import { 
  Play, Sparkles, ArrowRight, LayoutGrid, Zap, 
  ShieldCheck, Users, Search, Newspaper, Star, TrendingUp 
} from 'lucide-react';
import { slugify } from '@/lib/utils/slugify';

export const revalidate = 3600;

async function HeroSection() {
  const data = await getTrending(1);
  const animes = data?.Page?.media || [];
  if (!animes.length) return null;

  const heroAnime = animes[0];
  const title = heroAnime.title.english || heroAnime.title.romaji;
  const bgImage = heroAnime.bannerImage || heroAnime.coverImage.extraLarge;
  const description = heroAnime.description?.replace(/<[^>]+>/g, '').substring(0, 250) + '...';

  return (
    <section className="relative w-full h-[70vh] lg:h-[85vh] min-h-[500px] flex items-end pb-12 lg:pb-20">
      <div className="absolute inset-0 z-0 overflow-hidden bg-[var(--color-dark-bg)]">
        <ParallaxHeroBackground bgImage={bgImage} title={title} />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-dark-bg)] via-[var(--color-dark-bg)]/90 to-transparent lg:w-[80%] z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] via-transparent to-transparent z-10" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-12">
        <div className="max-w-[1920px] mx-auto">
          <div className="max-w-3xl animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-4 py-1.5 glass-panel text-anime-primary border-anime-primary/30 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg">
                Featured Spotlight
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 glass-panel text-white/60 rounded-xl text-[10px] font-bold uppercase">
                {heroAnime.format} • {heroAnime.seasonYear}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black mb-6 leading-[1.1] text-white drop-shadow-2xl">
              Discover Your Next <span className="glow-text">Masterpiece</span>.
            </h1>
            
            <p className="text-zinc-400 text-base md:text-lg mb-10 leading-relaxed max-w-xl hidden sm:block font-medium">
              VoidAnime is your ultimate gateway to synchronized tracking, community-driven insights, and immersive discovery engines.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href={`/anime/${slugify(title)}-${heroAnime.id}`} className="flex items-center gap-3 bg-anime-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_40px_rgba(157,78,221,0.4)] hover:scale-105">
                <Search className="w-4 h-4" /> Where to Watch
              </Link>
              <HomeHeroWrapper animeId={heroAnime.id} />
            </div>
            <p className="mt-6 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] opacity-50">
              Informational Directory • Verified Streaming Sources • Community Index
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlatformMission() {
  const missions = [
    { icon: Search, title: 'Smart Discovery', desc: 'Find hidden gems through our data-driven weighted recommendation engine.' },
    { icon: Users, title: 'Community Pulse', desc: 'Sync with thousands of enthusiasts and share your unique taste profile.' },
    { icon: ShieldCheck, title: 'Pro Tracking', desc: 'The most comprehensive watchlist management tools in the industry.' }
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-[1920px] mx-auto px-6 md:px-10 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {missions.map((m, i) => (
          <div key={i} className="flex gap-6 items-start">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <m.icon className="w-6 h-6 text-anime-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-heading font-black text-white">{m.title}</h3>
              <p className="text-sm text-zinc-500 font-bold leading-relaxed">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

async function TrendingCarouselSection() {
  const data = await getTrending(1);
  return <MediaCarousel title="Popular Now" items={data?.Page?.media || []} />;
}

export default async function Home() {
  const [topAnimeData, reviewsData] = await Promise.all([
    getTopAnime(1),
    getRecentReviews(1)
  ]);

  return (
    <div className="flex flex-col gap-0 pb-20 bg-[var(--color-dark-bg)] min-h-screen overflow-x-hidden">
      <Suspense fallback={<div className="h-[80vh] w-full bg-[#1A1A1A] animate-pulse" />}>
        <HeroSection />
      </Suspense>

      <PlatformMission />

      <div className="w-full px-6 md:px-10 lg:px-12 mt-12 relative z-20">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-12 xl:gap-16">
          
            {/* Main Content */}
            <main className="space-y-16 lg:space-y-24">
              
              <ContinueWatchingSection />

              <section>
                <div className="flex items-center justify-between mb-8 px-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-anime-primary">
                      <TrendingUp className="w-5 h-5" />
                      <h2 className="text-2xl font-heading font-black text-white">Trending</h2>
                    </div>
                    <p className="text-sm text-zinc-500 font-bold">Real-time trending data across our global network.</p>
                  </div>
                  <Link href="/discover" className="text-[10px] font-black uppercase text-zinc-500 hover:text-anime-primary transition-colors">View Library →</Link>
                </div>
                <Suspense fallback={<div className="h-72 w-full animate-pulse bg-white/5 rounded-3xl" />}>
                  <TrendingCarouselSection />
                </Suspense>
              </section>

              {/* In-feed Ad Content Placeholder */}
              <div className="py-4">
                <AdUnit slot="home-mid-banner" format="auto" className="rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5" />
              </div>

              <section className="space-y-8">
                <div className="space-y-2 px-2">
                  <div className="flex items-center gap-2 text-anime-cyan">
                    <LayoutGrid className="w-5 h-5" />
                    <h2 className="text-2xl font-heading font-black text-white">Browse by Genre</h2>
                  </div>
                  <p className="text-sm text-zinc-500 font-bold">From psychological thrillers to heartwarming slice of life.</p>
                </div>
                <GenreQuickLinks />
              </section>

              <section>
                <div className="space-y-2 mb-8 px-2">
                  <div className="flex items-center gap-2 text-anime-secondary">
                    <Star className="w-5 h-5" />
                    <h2 className="text-2xl font-heading font-black text-white">Recent Activity</h2>
                  </div>
                  <p className="text-sm text-zinc-500 font-bold">Latest critiques and reviews from our verified community members.</p>
                </div>
                <RecentCommunityActivity reviews={reviewsData?.Page?.reviews || []} />
              </section>

              <section className="p-10 rounded-[48px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-heading font-black text-white">Advanced Search Engine</h2>
                    <p className="text-zinc-500 font-bold max-w-lg">Can't find what you're looking for? Use our granular filters to drill down into the database by score, year, format, and more.</p>
                  </div>
                  <Link href="/search" className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-anime-primary hover:text-white transition-all shadow-xl">
                    Launch Search
                  </Link>
                </div>
              </section>
            </main>

            {/* Sidebar */}
            <aside className="hidden xl:block space-y-12">
              <div className="sticky top-28 space-y-12">
                  <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2 text-anime-primary">
                    <Newspaper className="w-5 h-5" />
                    <h3 className="text-lg font-heading font-black text-white uppercase tracking-tighter">Spotlight Intelligence</h3>
                  </div>
                  <OnThisDay />
                </div>

                <div className="p-1 rounded-[32px] bg-gradient-to-b from-white/10 to-transparent border border-white/10 overflow-hidden shadow-2xl">
                  <AdUnit slot="home-sidebar-ad" format="rectangle" />
                </div>

                <TopRankings animes={topAnimeData?.Page?.media || []} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
