import Link from 'next/link';
import Image from 'next/image';
import { WifiOff, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-[#060608] flex flex-col items-center justify-center p-6 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-8 max-w-md animate-in fade-in zoom-in duration-700">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-24 h-24">
                        <Image
                            src="/logo-icon.png"
                            alt="VoidAnime"
                            fill
                            className="object-contain opacity-20 grayscale"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <WifiOff className="w-12 h-12 text-white/20" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white/90">You're Offline</h1>
                        <p className="text-white/40 text-sm font-medium leading-relaxed">
                            It seems you've lost your connection. Check your internet settings and try again.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                        onClick={() => window.location.reload()}
                        className="flex-1 h-12 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry Connection
                    </Button>
                    <Link href="/home" className="flex-1">
                        <Button 
                            variant="outline"
                            className="w-full h-12 rounded-2xl border-white/10 bg-white/[0.02] text-white/60 font-black uppercase tracking-widest text-[11px]"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </Link>
                </div>

                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] pt-4">
                    voidanime.online
                </p>
            </div>
        </div>
    );
}
