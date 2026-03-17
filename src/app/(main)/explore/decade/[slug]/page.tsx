import { Suspense } from 'react';
import { getByDecade } from '@/lib/api/anilist';
import { MediaCard } from '@/components/shared/MediaCard';
import { History } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function DecadeGrid({ start, end }: { start: number, end: number }) {
  const data = await getByDecade(start, end, 1);
  const animes = data?.Page?.media || [];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {animes.map((anime: any) => (
        <MediaCard 
          key={anime.id} 
          id={anime.id} 
          title={anime.title.english || anime.title.romaji} 
          coverImage={anime.coverImage.extraLarge || anime.coverImage.large} 
          score={anime.averageScore || 0} 
          color={anime.coverImage.color}
        />
      ))}
    </div>
  );
}

export default async function DecadePage({ params }: PageProps) {
  const { slug } = await params;
  
  // Parse slug like '90s', '2000s'
  let startYear = 2020;
  let endYear = 2030;
  let title = "Modern Era";

  if (slug === '90s') { startYear = 1990; endYear = 2000; title = "Golden 90s Classics"; }
  if (slug === '2000s') { startYear = 2000; endYear = 2010; title = "The 2000s Evolution"; }
  if (slug === '2010s') { startYear = 2010; endYear = 2020; title = "The 2010s Peak"; }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 md:px-12">
        <div className="mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-zinc-300 font-bold text-sm tracking-widest uppercase mb-6 backdrop-blur-xl">
            <History className="w-4 h-4 text-anime-accent" />
            Decade Explorer
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-6 leading-tight drop-shadow-xl">
            Explore the <span className="glow-text">{title}</span>.
          </h1>
          <p className="text-lg text-white/50 font-medium max-w-2xl">
            A hand-picked selection of the most influential and popular anime from the {slug}. Relive the classics that shaped the industry.
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-2xl" />
            ))}
          </div>
        }>
          <DecadeGrid start={startYear} end={endYear} />
        </Suspense>
      </div>
    </div>
  );
}
