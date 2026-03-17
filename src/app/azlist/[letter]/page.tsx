import { notFound } from 'next/navigation';
import { getAZList } from '@/services/anime';
import { AnimeGrid } from '@/components/anime/AnimeGrid';
import { Pagination } from '@/components/shared/Pagination';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { GlassPanel } from '@/components/ui/GlassPanel';

export const dynamic = 'force-dynamic';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default async function AZListPage({
  params,
  searchParams,
}: {
  params: Promise<{ letter: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { letter } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1');

  if (!letter) return notFound();

  const res = await getAZList(letter, currentPage);
  const { animes, totalPages, hasNextPage } = res.data;

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 pb-32 relative overflow-hidden">
      {/* ─── ANIMATED BACKGROUND MESH ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 relative z-10 pt-28">
        <div className="mb-12">
            <Breadcrumbs items={[
                { label: "A-Z List", href: "/azlist" },
                { label: letter.toUpperCase() }
            ]} />
        </div>

        <div className="flex flex-col gap-10 mb-20">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#9333ea]" />
                <h1 className="text-5xl md:text-6xl font-[1000] text-white uppercase tracking-tighter italic">
                    Index: <span className="text-primary">{letter.toUpperCase()}</span>
                </h1>
            </div>

            <GlassPanel intensity="medium" className="p-3 flex flex-wrap gap-2 rounded-3xl border-white/5 overflow-visible">
                <Link 
                    href="/azlist/all" 
                    className={cn(
                        "px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                        letter === 'all' 
                          ? "bg-primary text-black shadow-[0_0_20px_rgba(147,51,234,0.4)]" 
                          : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                >
                    All
                </Link>
                <Link 
                    href="/azlist/0-9" 
                    className={cn(
                        "px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500",
                        letter === '0-9' 
                          ? "bg-primary text-black shadow-[0_0_20px_rgba(147,51,234,0.4)]" 
                          : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                >
                    0-9
                </Link>
                <div className="w-px h-10 bg-white/5 mx-2 hidden sm:block" />
                {ALPHABET.map(l => (
                    <Link 
                        key={l} 
                        href={`/azlist/${l.toLowerCase()}`}
                        className={cn(
                            "w-11 h-11 flex items-center justify-center rounded-2xl text-[13px] font-black transition-all duration-500",
                            letter === l.toLowerCase() 
                              ? "bg-primary text-black shadow-[0_0_20px_rgba(147,51,234,0.4)]" 
                              : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {l}
                    </Link>
                ))}
            </GlassPanel>
        </div>

        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <h2 className="text-white/40 text-[12px] font-black uppercase tracking-[0.4em]">Catalog Results</h2>
                <div className="h-px flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            
            <AnimeGrid animes={animes} columns={6} />
        </div>

        {totalPages > 1 && (
          <div className="mt-24 flex justify-center">
              <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  basePath={`/azlist/${letter}`} 
              />
          </div>
        )}
      </div>
    </div>
  );
}
