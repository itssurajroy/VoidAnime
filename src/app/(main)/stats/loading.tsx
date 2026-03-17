export default function StatsLoading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="h-8 w-40 bg-[#1A1A1A] rounded-xl animate-pulse" />
          <div className="h-12 w-64 bg-[#212121] rounded-2xl animate-pulse" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-[#1A1A1A]/40 border border-[#2A2A2A] rounded-[40px] animate-pulse" />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-[#1A1A1A]/40 border border-[#2A2A2A] rounded-[40px] animate-pulse" />
          <div className="h-96 bg-[#1A1A1A]/40 border border-[#2A2A2A] rounded-[40px] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
