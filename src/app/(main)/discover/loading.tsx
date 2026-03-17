export default function DiscoverLoading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <div className="h-96 w-full bg-[#1A1A1A] rounded-[40px] animate-pulse mb-16" />

        {/* Section Row */}
        <div className="space-y-12">
          {[1, 2].map(row => (
            <div key={row} className="space-y-6">
              <div className="flex justify-between">
                <div className="h-8 w-48 bg-[#212121] rounded-xl animate-pulse" />
                <div className="h-8 w-24 bg-[#212121] rounded-xl animate-pulse" />
              </div>
              <div className="flex gap-6 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[2/3] w-[180px] bg-[#1A1A1A] rounded-2xl animate-pulse shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
