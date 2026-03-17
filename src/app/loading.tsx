import NextImage from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0C10] px-6 text-center">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center gap-6 animate-pulse">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
                <NextImage
                    src="/logo-icon.png"
                    alt="Loading"
                    fill
                    className="object-contain opacity-50"
                />
            </div>
            <div className="flex flex-col items-center -space-y-3 opacity-30">
                <span className="text-white text-3xl md:text-5xl font-black tracking-tighter uppercase font-headline">Void</span>
                <span className="text-primary text-3xl md:text-5xl font-black tracking-tighter uppercase font-headline">Anime</span>
            </div>
        </div>
        
        <div className="mt-12">
            <div className="w-32 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary/40 animate-shimmer" style={{ width: '40%', backgroundSize: '200% 100%' }} />
            </div>
        </div>
    </div>
  );
}
