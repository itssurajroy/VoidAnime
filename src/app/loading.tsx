export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Hero skeleton */}
      <div className="skeleton h-[70vh] min-h-[500px] w-full" />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 space-y-16">
        {[0, 1].map((s) => (
          <section key={s}>
            <div className="mb-6 flex items-center gap-3">
              <div className="skeleton h-8 w-8 rounded-lg" />
              <div className="skeleton h-6 w-48 rounded" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2.5">
                  <div className="skeleton aspect-[2/3] w-full rounded-xl" />
                  <div className="skeleton h-3 w-3/4 rounded" />
                  <div className="skeleton h-2.5 w-1/2 rounded" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
