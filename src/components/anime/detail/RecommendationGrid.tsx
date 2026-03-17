'use client';

import { Sparkles, Layers } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimeGrid } from "@/components/anime/AnimeGrid";
import { AnimeCard } from "@/components/anime/AnimeCard";
import Link from "next/link";
import Image from "next/image";

interface RecommendationGridProps {
  recommendedAnimes: any[]; // These are from hi-anime (can be poor)
  relatedAnimes?: any[]; // These are from hi-anime (can be poor)
  aniListData?: any; // Use this for high quality AniList data
}

export function RecommendationGrid({ recommendedAnimes, relatedAnimes, aniListData }: RecommendationGridProps) {
  // Prioritize AniList Relations
  const aniRelations = aniListData?.relations?.edges?.filter((edge: any) => edge.node.type === 'ANIME') || [];
  
  // Prioritize AniList Recommendations
  const aniRecommendations = aniListData?.recommendations?.edges?.map((edge: any) => edge.node.mediaRecommendation) || [];

  return (
    <div className="space-y-24">
      {(aniRelations.length > 0 || (relatedAnimes && relatedAnimes.length > 0)) && (
        <section>
          <SectionHeader title="Related Content" icon={Layers} subtitle="Series & Franchise" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Show AniList Relations first */}
            {aniRelations.map((edge: any) => (
              <Link 
                key={edge.node.id} 
                href={`/search?q=${encodeURIComponent(edge.node.title.romaji || edge.node.title.english)}`}
                className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                  <Image src={edge.node.coverImage.large} alt={edge.node.title.romaji} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                    {edge.node.title.romaji || edge.node.title.english}
                  </h4>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">
                    {edge.relationType.replace(/_/g, ' ')}
                  </p>
                </div>
              </Link>
            ))}

            {/* Fallback to hi-anime related if no AniList relations or if user specifically wanted them */}
            {aniRelations.length === 0 && relatedAnimes?.map((related: any) => (
              <Link 
                key={related.id} 
                href={`/anime/${related.id}`}
                className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0">
                  <Image src={related.poster} alt={related.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{related.name}</h4>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">{related.relation || 'Related'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(aniRecommendations.length > 0 || (recommendedAnimes && recommendedAnimes.length > 0)) && (
        <section>
          <SectionHeader title="More Like This" icon={Sparkles} subtitle="Suggested" />
          {aniRecommendations.length > 0 ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-12">
                {aniRecommendations.slice(0, 12).map((rec: any) => (
                    <Link key={rec.id} href={`/search?q=${encodeURIComponent(rec.title.romaji || rec.title.english)}`} className="group block space-y-3">
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-transform duration-500 group-hover:-translate-y-2">
                            <Image src={rec.coverImage.large} alt={rec.title.romaji} fill className="object-cover" />
                            <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-white">
                                {rec.averageScore}%
                            </div>
                        </div>
                        <h4 className="text-[13px] font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                            {rec.title.romaji || rec.title.english}
                        </h4>
                    </Link>
                ))}
             </div>
          ) : (
            <AnimeGrid animes={recommendedAnimes.slice(0, 12)} columns={6} className="!grid-cols-2 sm:!grid-cols-3 md:!grid-cols-4 lg:!grid-cols-6 gap-x-6 gap-y-12" />
          )}
        </section>
      )}
    </div>
  );
}
