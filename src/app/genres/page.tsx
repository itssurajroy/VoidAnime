import { getHomeData } from "@/services/anime";
import Link from "next/link";
import { ChevronRight, Hash, LayoutGrid, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { GlassPanel } from "@/components/ui/GlassPanel";

export default async function GenresPage() {
    const { data }: any = await getHomeData();
    const genres: string[] = data?.genres || [];

    // Aesthetic color mapping for some genres to make it look premium
    const genreColors: Record<string, string> = {
        'action': 'text-[#a3e635]',
        'adventure': 'text-[#f472b6]',
        'comedy': 'text-[#fb923c]',
        'drama': 'text-[#c084fc]',
        'fantasy': 'text-[#93c5fd]',
        'horror': 'text-[#fda4af]',
        'romance': 'text-[#f87171]',
        'sci-fi': 'text-[#2dd4bf]',
        'shounen': 'text-[#8b5cf6]',
        'seinen': 'text-[#facc15]',
    };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 pb-32 relative overflow-hidden">
      {/* ─── ANIMATED BACKGROUND MESH ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* ─── PREMIUM HERO HEADER ─── */}
      <div className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-white/5">
        <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="space-y-6">
              <div className="mb-8">
                <Breadcrumbs items={[{ label: "Genres" }]} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#9333ea]" />
                  <h1 className="text-6xl lg:text-8xl font-[1000] text-white uppercase tracking-tighter font-headline leading-[0.8] italic">
                    Anime <span className="text-primary block">Categories</span>
                  </h1>
                </div>
              </div>
              
              <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed italic tracking-wide">
                Explore our diverse library across all production genres. Find your favorite series through our optimized catalog index.
              </p>
            </div>

            <div className="flex items-center gap-6">
                <GlassPanel intensity="heavy" className="p-8 md:p-10 flex items-center gap-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10 rounded-[40px]">
                    <div className="text-center">
                        <div className="text-4xl font-[1000] text-white font-headline tracking-tighter italic">{genres.length}</div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">Unique Genres</div>
                    </div>
                    <div className="w-px h-14 bg-white/10" />
                    <div className="text-center">
                        <div className="text-4xl font-[1000] text-primary font-headline tracking-tighter italic">ALL</div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">HD Quality</div>
                    </div>
                </GlassPanel>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 py-20 relative z-10">
        <div className="space-y-16">
            <div className="flex items-center gap-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-4xl font-[1000] text-white uppercase tracking-tighter font-headline italic">Browse by <span className="text-primary">Genre</span></h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {genres.map((genre, i) => {
                    const slug = genre.toLowerCase().replace(/ /g, "-");
                    const colorClass = genreColors[slug] || 'text-white/60';
                    
                    return (
                        <Link 
                            key={genre} 
                            href={`/genre/${slug}`}
                            className="group relative aspect-square flex flex-col items-center justify-center overflow-hidden"
                        >
                            <GlassPanel intensity="medium" className="absolute inset-0 group-hover:bg-primary/5 group-hover:border-primary/50 transition-all duration-500 rounded-[32px] md:rounded-[40px]" children={null} />
                            <div className={cn("relative z-10 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/10 shadow-lg", colorClass)}>
                                <Zap className="w-6 h-6 fill-current" />
                            </div>
                            <span className="relative z-10 text-xl font-[1000] text-white group-hover:text-primary transition-colors duration-500 font-headline uppercase italic text-center px-4 leading-tight">{genre}</span>
                            <span className="relative z-10 mt-2 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-primary/40 transition-colors">Catalog</span>
                        </Link>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
}
