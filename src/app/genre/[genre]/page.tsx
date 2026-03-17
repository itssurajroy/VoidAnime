import { notFound } from 'next/navigation';
import { getGenreAnime } from '@/services/anime';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { Pagination } from '@/components/shared/Pagination';
import { CatalogHero } from '@/components/shared/CatalogHero';

export const dynamic = 'force-dynamic';

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { genre } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1');

  if (!genre) return notFound();

  const res = await getGenreAnime(genre, currentPage);
  const { animes, totalPages, genreName } = res.data;

  const displayTitle = genreName || genre.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 pb-32 relative overflow-hidden">
      {/* ─── ANIMATED BACKGROUND MESH ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <CatalogHero 
        title={`Genre: ${displayTitle}`}
        subtitle={`Discover the best ${displayTitle} anime in our vast streaming library.`}
        breadcrumbLabel="Genres"
        breadcrumbHref="/genres"
        name={genre}
      />

      <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 py-20 relative z-10">
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h2 className="text-white/40 text-[12px] font-black uppercase tracking-[0.4em]">Collection Results</h2>
                <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            <AnimeGrid animes={animes} columns={6} />
        </div>

        {totalPages > 1 && (
          <div className="mt-24 flex justify-center">
              <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  basePath={`/genre/${genre}`} 
              />
          </div>
        )}
      </div>
    </div>
  );
}
