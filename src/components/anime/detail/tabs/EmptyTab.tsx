export default function EmptyState({ section, onRetry }: any) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-[#2A2A2A] rounded-3xl p-6 bg-[#1A1A1A]/20">
      <span className="text-4xl mb-4">🚧</span>
      <h3 className="text-xl font-heading font-black text-zinc-400 mb-2 uppercase tracking-widest">{section} under construction</h3>
      <p className="text-sm text-white/20">We are currently integrating this data source.</p>
    </div>
  );
}
