'use client';

import { useState } from 'react';
import { Coins, QrCode, Copy, Check, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { CryptoDonation } from '@/types/site';

interface DonateClientProps {
    donations: CryptoDonation[];
}

export function DonateClient({ donations }: DonateClientProps) {
    const [selectedId, setSelectedId] = useState(donations[0]?.id || null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const selected = donations.find(d => d.id === selectedId);

    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        toast({
            title: "Address Copied",
            description: "The wallet address has been copied to your clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    if (donations.length === 0) {
        return (
            <div className="text-center p-12 bg-white/[0.02] border border-white/5 rounded-[40px]">
                <p className="text-white/20 font-black uppercase tracking-widest text-xs italic">Donations are currently disabled.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* Asset Selector */}
            <div className="space-y-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Select Asset</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {donations.map((crypto) => (
                        <button
                            key={crypto.id}
                            onClick={() => setSelectedId(crypto.id)}
                            className={cn(
                                "flex items-center gap-4 p-5 rounded-3xl border transition-all duration-500 group relative overflow-hidden",
                                selectedId === crypto.id
                                    ? "bg-primary/10 border-primary shadow-[0_0_30px_rgba(147,51,234,0.1)] scale-[1.02]"
                                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                            )}
                        >
                            {selectedId === crypto.id && (
                                <div className="absolute left-0 top-0 w-1 h-full bg-primary" />
                            )}
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all",
                                selectedId === crypto.id ? "bg-primary text-black" : "bg-white/5 text-white/40 group-hover:text-white"
                            )}>
                                {crypto.symbol}
                            </div>
                            <div className="text-left">
                                <h4 className={cn(
                                    "text-[13px] font-black uppercase tracking-tight",
                                    selectedId === crypto.id ? "text-white" : "text-white/60"
                                )}>{crypto.name}</h4>
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{crypto.network || 'Mainnet'}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Address Details */}
            <div className="relative group/card">
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-purple-500/20 blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
                <div className="relative bg-[#12121d] border border-white/10 rounded-[40px] p-8 space-y-8 shadow-2xl h-full flex flex-col items-center justify-center text-center">
                    {selected ? (
                        <>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Support via {selected.name}</h3>
                                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-[9px] font-black px-3 py-1 uppercase tracking-widest">
                                    {selected.network || 'Mainnet Network'}
                                </Badge>
                            </div>

                            {selected.qrCodeUrl ? (
                                <div className="relative w-48 h-48 bg-white p-3 rounded-3xl shadow-2xl animate-in zoom-in duration-500">
                                    <Image src={selected.qrCodeUrl} alt="QR Code" fill className="object-contain p-3" />
                                </div>
                            ) : (
                                <div className="w-48 h-48 bg-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 border border-dashed border-white/10">
                                    <QrCode className="w-10 h-10 text-white/10" />
                                    <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">No QR Available</span>
                                </div>
                            )}

                            <div className="w-full space-y-3">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Wallet Address</p>
                                <div className="flex items-center gap-2 p-4 bg-black/40 border border-white/5 rounded-2xl w-full">
                                    <code className="text-[11px] text-white/60 font-mono flex-1 truncate text-left">{selected.address}</code>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleCopy(selected.address)}
                                        className="w-10 h-10 rounded-xl hover:bg-primary hover:text-black transition-all"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            <p className="text-[10px] font-bold text-white/20 italic leading-relaxed uppercase">
                                Please ensure you are sending <span className="text-white">{selected.symbol}</span> on the <span className="text-white">{selected.network || 'correct'}</span> network.
                            </p>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-12">
                            <Coins className="w-12 h-12 text-white/5 animate-pulse" />
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Select an asset to donate</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
