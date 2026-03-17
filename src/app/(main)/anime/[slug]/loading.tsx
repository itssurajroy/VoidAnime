export default function AnimeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] selection:bg-anime-primary/30 overflow-hidden">
      {/* Banner skeleton */}
      <div className="h-[55vh] md:h-[70vh] bg-[#1A1A1A]/50 w-full animate-pulse relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-12 -mt-32 relative z-10 space-y-12">
        {/* Hero row */}
        <div className="flex flex-col md:flex-row gap-10 items-end">
          {/* Cover */}
          <div className="w-44 md:w-72 aspect-[2/3] rounded-3xl bg-[#1A1A1A] border border-[#2A2A2A] flex-shrink-0 animate-pulse shadow-2xl" />
          
          {/* Info */}
          <div className="flex-1 space-y-6 pb-6 w-full">
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-6 w-20 bg-[#212121] rounded-full animate-pulse" />
              ))}
            </div>
            <div className="h-16 bg-[#212121] rounded-2xl w-3/4 animate-pulse" />
            <div className="h-6 bg-[#212121] rounded-xl w-1/2 animate-pulse" />
            <div className="flex gap-4 pt-4">
              <div className="h-14 w-40 bg-white/10 rounded-2xl animate-pulse" />
              <div className="h-14 w-14 bg-[#212121] rounded-2xl animate-pulse" />
              <div className="h-14 w-14 bg-[#212121] rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tab bar skeleton */}
        <div className="flex gap-8 border-b border-[#2A2A2A] overflow-x-auto scrollbar-hide">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 w-24 bg-[#212121] rounded-t-lg animate-pulse shrink-0" />
          ))}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
          <div className="lg:col-span-8 space-y-10">
            {/* Synopsis */}
            <div className="p-10 rounded-[40px] bg-[#1A1A1A]/30 border border-[#2A2A2A] space-y-4">
              <div className="h-6 bg-[#212121] rounded w-1/4 animate-pulse mb-6" />
              <div className="h-4 bg-[#212121] rounded w-full animate-pulse" />
              <div className="h-4 bg-[#212121] rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-[#212121] rounded w-4/6 animate-pulse" />
              <div className="h-4 bg-[#212121] rounded w-full animate-pulse" />
            </div>

            {/* Section */}
            <div className="space-y-4 px-4">
              <div className="h-8 bg-[#212121] rounded-xl w-1/3 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-[#212121] rounded-3xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="h-96 bg-[#1A1A1A]/30 border border-[#2A2A2A] rounded-[40px] animate-pulse" />
            <div className="h-48 bg-[#1A1A1A]/30 border border-[#2A2A2A] rounded-[40px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
