import { Skeleton, SkeletonGrid } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#101113] space-y-0">
      {/* Hero Skeleton */}
      <div className="w-full h-[500px] md:h-[700px] bg-white/5 skeleton-shimmer relative">
        <div className="absolute bottom-20 left-4 md:left-20 space-y-6 w-full max-w-2xl">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-16 w-3/4" />
            <div className="flex gap-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-4 pt-4">
                <Skeleton className="h-14 w-40 rounded-2xl" />
                <Skeleton className="h-14 w-14 rounded-2xl" />
            </div>
        </div>
      </div>

      {/* Trending Carousel Skeleton */}
      <div className="py-12 px-4 md:px-8 lg:px-16 xl:px-20 bg-black/20">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-8 bg-primary/20 rounded-full" />
            <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="min-w-[280px] h-[160px] rounded-3xl bg-white/5 skeleton-shimmer" />
            ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container max-w-none mx-auto px-4 md:px-8 lg:px-16 xl:px-20">
        <div className="lg:grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8 xl:gap-12 pt-8">
          
          <div className="min-w-0 space-y-20">
            {/* Latest Updates Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Most Popular Section */}
            <div className="space-y-8">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Sidebar Skeletons */}
          <aside className="space-y-12 mt-6 lg:mt-0">
            <div className="space-y-6">
                <Skeleton className="h-8 w-full rounded-2xl" />
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-12 h-16 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="space-y-4">
                <Skeleton className="h-8 w-full rounded-2xl" />
                <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-20 rounded-lg" />
                    ))}
                </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
