import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { getCategoryAnimes } from "@/services/anime";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/shared/Pagination";
import { CatalogHero } from "@/components/shared/CatalogHero";

export const dynamic = 'force-dynamic';

export default async function TopAiringPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1;

  let data;
  try {
    const res = await getCategoryAnimes('top-airing', page);
    data = res.data;
  } catch (error) {
    console.error('Error fetching top airing animes:', error);
    notFound();
  }

  if (!data || !data.animes) return notFound();

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
        title="Top Airing"
        subtitle="The most popular series currently broadcasting. Updated in real-time."
        breadcrumbLabel="Home"
        breadcrumbHref="/home"
        name="top-airing"
      />

      <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 py-20 relative z-10">
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h2 className="text-white/40 text-[12px] font-black uppercase tracking-[0.4em]">Current Broadcasts</h2>
                <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            <AnimeGrid animes={data.animes} columns={6} />
        </div>

        {data.totalPages > 1 && (
          <div className="mt-24 flex justify-center">
              <Pagination 
                  currentPage={data.currentPage} 
                  totalPages={data.totalPages} 
                  basePath="/top-airing" 
              />
          </div>
        )}
      </div>
    </div>
  );
}
