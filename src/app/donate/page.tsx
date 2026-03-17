import { getSiteConfig } from '@/lib/site-config';
import { Coins, QrCode, Copy, Heart, ShieldCheck, Zap, ArrowRight, Wallet } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { DonateClient } from '@/components/donate/DonateClient';

export const dynamic = 'force-dynamic';

export default async function DonatePage() {
    const config = await getSiteConfig();
    const donations = config.cryptoDonations || [];

    return (
        <div className="min-h-screen bg-[#060608] pb-20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[100px] pointer-events-none rounded-full translate-x-1/2 translate-y-1/2" />

            <div className="container max-w-6xl mx-auto px-4 pt-20 md:pt-32 relative z-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center space-y-6 mb-16 md:mb-24">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Support VoidAnime</span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-[900] text-white uppercase tracking-tighter italic leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        Keep the <span className="text-primary drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]">Void</span> Alive.
                    </h1>
                    <p className="text-white/40 text-sm md:text-lg font-medium leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 uppercase tracking-wide">
                        VoidAnime is a non-profit project. Your donations help us cover server costs, maintain high-speed streaming, and keep the site ad-free.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {[
                        { icon: <Zap className="w-6 h-6" />, title: "High Speed", desc: "Maintain 10Gbps dedicated streaming servers worldwide." },
                        { icon: <ShieldCheck className="w-6 h-6" />, title: "No Ads", desc: "Help us keep the experience clean and focused on content." },
                        { icon: <Wallet className="w-6 h-6" />, title: "Direct Support", desc: "100% of your crypto goes directly to infrastructure costs." }
                    ].map((feat, i) => (
                        <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-4 hover:bg-white/[0.04] transition-all group animate-in fade-in zoom-in duration-700" style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: 'both' }}>
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                {feat.icon}
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{feat.title}</h3>
                            <p className="text-white/30 text-xs leading-relaxed uppercase font-bold tracking-wider">{feat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Donation UI */}
                <div className="max-w-4xl mx-auto">
                    <DonateClient donations={donations} />
                </div>

                {/* Footer Message */}
                <div className="mt-24 text-center space-y-4">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">
                        Thank you for being part of the community
                    </p>
                    <div className="h-px w-24 bg-white/5 mx-auto" />
                </div>
            </div>
        </div>
    );
}
