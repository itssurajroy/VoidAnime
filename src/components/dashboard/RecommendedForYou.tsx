'use client';
import { getHomeData } from "@/services/anime";
import { AnimeGrid } from "../anime/AnimeGrid";
import { SectionTitle } from "../shared/SectionTitle";
import { useState, useEffect } from "react";
import type { AnimeCard } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function RecommendedForYou() {
    const [recommendedAnimes, setRecommendedAnimes] = useState<AnimeCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await getHomeData();
                setRecommendedAnimes(data.mostPopularAnimes || []);
            } catch (error) {
                console.error("Failed to fetch recommended anime", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
             <section>
                <SectionTitle>Recommended For You</SectionTitle>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i}>
                            <Skeleton className="aspect-[2/3] w-full rounded-md" />
                            <Skeleton className="h-4 w-3/4 mt-2" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section>
            <SectionTitle>Recommended For You</SectionTitle>
            <AnimeGrid animes={recommendedAnimes.slice(0, 10)} />
        </section>
    )
}
