import { Trophy } from 'lucide-react';

interface RankingsSidebarProps {
  rankings: Array<{
    rank: number;
    type: string;
    context: string;
    year?: number;
    season?: string;
    allTime?: boolean;
  }>;
}

export function RankingsSidebar({ rankings }: RankingsSidebarProps) {
  if (!rankings || rankings.length === 0) return null;

  return (
    <div className="p-8 rounded-[40px] glass-panel shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Trophy className="w-24 h-24 text-anime-primary" />
      </div>
      
      <h3 className="text-[10px] font-black text-zinc-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
        <Trophy className="w-4 h-4 text-anime-primary" /> Global Rankings
      </h3>

      <div className="space-y-5 relative z-10">
        {rankings.slice(0, 5).map((rank, i) => (
          <div key={i} className="flex items-center gap-4 group/item">
            <div className="flex flex-col items-center justify-center min-w-[44px] h-12 rounded-2xl bg-black/40 border border-white/5 group-hover/item:border-anime-primary/30 transition-colors">
              <span className="text-lg font-black text-white">#{rank.rank}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white/90 truncate capitalize">
                {rank.context} {rank.year || ''}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                  {rank.type === 'RATED' ? 'Highest Rated' : 'Most Popular'}
                </span>
                {rank.allTime && (
                  <span className="text-[8px] px-1.5 py-0.5 bg-anime-primary/10 text-anime-primary rounded-md font-bold uppercase tracking-tighter">
                    All Time
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
