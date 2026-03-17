export default function CalendarLoading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Date Selector */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide justify-center">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-20 w-16 bg-[#1A1A1A] rounded-2xl animate-pulse shrink-0" />
          ))}
        </div>

        {/* Schedule Grid */}
        <div className="space-y-8">
          {[...Array(3)].map((_, section) => (
            <div key={section} className="space-y-4">
              <div className="h-6 w-32 bg-[#212121] rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, card) => (
                  <div key={card} className="h-24 bg-[#1A1A1A]/40 border border-[#2A2A2A] rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
