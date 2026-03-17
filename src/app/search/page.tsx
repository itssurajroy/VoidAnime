import { searchAnime } from '@/services/anime';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { Pagination } from '@/components/shared/Pagination';
import { AdvancedFilters } from '@/components/search/AdvancedFilters';
import { SearchClient } from '@/components/search/SearchClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : undefined;
  const page = typeof resolvedSearchParams.page === 'string' ? Number(resolvedSearchParams.page) : 1;

  const filterParams: Record<string, string | number> = { page };

  if (resolvedSearchParams.type) filterParams.type = resolvedSearchParams.type as string;
  if (resolvedSearchParams.status) filterParams.status = resolvedSearchParams.status as string;
  if (resolvedSearchParams.rated) filterParams.rated = resolvedSearchParams.rated as string;
  if (resolvedSearchParams.score) filterParams.score = resolvedSearchParams.score as string;
  if (resolvedSearchParams.season) filterParams.season = resolvedSearchParams.season as string;
  if (resolvedSearchParams.language) filterParams.language = resolvedSearchParams.language as string;
  if (resolvedSearchParams.sort) filterParams.sort = resolvedSearchParams.sort as string;
  if (resolvedSearchParams.genres) filterParams.genres = resolvedSearchParams.genres as string;
  if (resolvedSearchParams.start_date) filterParams.start_date = resolvedSearchParams.start_date as string;
  if (resolvedSearchParams.end_date) filterParams.end_date = resolvedSearchParams.end_date as string;

  try {
    const { data } = await searchAnime(query || '', filterParams);
    const { animes, currentPage, totalPages } = data;
    const totalAnimes = data.totalAnimes ?? animes.length;

    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value !== undefined) {
        params.set(key, value);
      }
    });
    params.delete('page');

    return (
      <div className="bg-[#0e0f11] min-h-screen pb-20">
        {/* Search Context Header */}
        <div className="relative overflow-hidden border-b border-white/5 bg-[#101113] pt-10 pb-12 sm:pt-14 sm:pb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6]/5 to-transparent opacity-50 pointer-events-none" />
          <div className="container max-w-none mx-auto px-4 md:px-8 lg:px-16 xl:px-20 relative z-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 animate-enter">
                    <div className="w-1 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter font-headline leading-none">
                      {query ? `Results for "${query}"` : 'EXPLORE ANIME'}
                    </h1>
                  </div>
                  <p className="text-white/40 text-[13px] md:text-[14px] font-bold uppercase tracking-widest pl-4 animate-enter delay-100">
                    Search across {totalAnimes?.toLocaleString() || 0} unique titles in our database
                  </p>
                </div>
                
                <div className="flex items-center gap-4 animate-enter delay-200">
                   <div className="bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/5 shadow-xl">
                      <span className="text-primary font-black text-xl tabular-nums leading-none">{totalAnimes?.toLocaleString() || 0}</span>
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-2.5">Total Findings</span>
                   </div>
                </div>
              </div>

              <div className="mt-4 animate-enter delay-300">
                <SearchClient initialQuery={query} />
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-none mx-auto px-4 md:px-8 lg:px-16 xl:px-20 py-10 sm:py-12">
          {/* Filters Bar */}
          <div className="mb-14 animate-enter delay-400">
            <AdvancedFilters />
          </div>

          {animes.length === 0 ? (
            <div className="text-center py-24 sm:py-32 bg-white/[0.02] rounded-[40px] border border-white/5 saas-shadow group hover:bg-white/[0.04] transition-all duration-700 animate-enter delay-500">
              <div className="relative w-24 h-24 mx-auto mb-8">
                 <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all duration-700" />
                 <div className="relative flex items-center justify-center w-full h-full bg-card rounded-full border border-white/10 shadow-2xl">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                 </div>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">No results found</h3>
              <p className="text-[#666] font-bold uppercase tracking-widest text-[12px] max-w-md mx-auto leading-relaxed px-4">
                We couldn't find any anime matching your search. <br />
                Try adjusting your filters or checking for typos.
              </p>
              <div className="mt-10 flex justify-center">
                 <Link href="/search" className="btn-premium">
                    RESET PARAMETERS
                 </Link>
              </div>
            </div>
          ) : (
            <div className="animate-enter delay-500">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-white/40 text-[12px] font-black uppercase tracking-[0.3em]">Search Results</h2>
                 <div className="h-px flex-1 mx-6 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              
              <AnimeGrid animes={animes} columns={6} />

              {totalPages > 1 && (
                <div className="mt-20 flex justify-center animate-enter delay-700">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`/search?${params.toString()}`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container max-w-[1320px] mx-auto px-4 py-20 text-center">
        <p className="text-lg text-[#8b5cf6] font-bold">Could not fetch results.</p>
      </div>
    );
  }
}
