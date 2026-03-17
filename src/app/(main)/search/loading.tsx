export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Search Bar Skeleton */}
        <div className="relative w-full max-w-2xl mx-auto mb-16 h-16 bg-[#1A1A1A] rounded-3xl animate-pulse" />

        {/* Filters Skeleton */}
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 w-24 bg-[#212121] rounded-xl animate-pulse" />
          ))}
        </div>

        {/* Results Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[2/3] w-full bg-[#1A1A1A] rounded-2xl animate-pulse" />
              <div className="h-4 bg-[#212121] rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-[#212121] rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
