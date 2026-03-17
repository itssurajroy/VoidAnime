export default function ListLoading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="h-10 w-48 bg-[#1A1A1A] rounded-2xl animate-pulse" />
            <div className="h-16 bg-[#212121] rounded-3xl w-64 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-48 bg-[#1A1A1A] rounded-xl animate-pulse" />
            <div className="h-12 w-12 bg-[#1A1A1A] rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 w-32 bg-[#212121] rounded-xl animate-pulse shrink-0" />
          ))}
        </div>

        {/* List Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-[#1A1A1A]/40 border border-[#2A2A2A] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
