export default function SeasonalLoading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center space-y-12">
        {/* Seasonal Header */}
        <div className="space-y-4">
          <div className="h-16 w-64 bg-[#1A1A1A] rounded-3xl animate-pulse mx-auto" />
          <div className="h-6 w-48 bg-[#212121] rounded-xl animate-pulse mx-auto" />
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-3 mb-12">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 w-32 bg-[#212121] rounded-xl animate-pulse" />
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-[#1A1A1A] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
