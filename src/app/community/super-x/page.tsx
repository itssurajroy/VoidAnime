'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    ChevronRight, 
    Zap, 
    Crown, 
    Star, 
    Trophy,
    Info,
    ArrowUpRight,
    Users,
    ShieldCheck,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const SUPER_MEMBERS = [
    { name: "VoidLegend", level: 99, points: "2.5M", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Legend", rank: 1, type: "Legendary" },
    { name: "JinWoo_Hunter", level: 85, points: "1.2M", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JinWoo", rank: 2, type: "Super X" },
    { name: "Mugiwara_Luffy", level: 72, points: "980K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luffy", rank: 3, type: "Super X" },
    { name: "VoidMaster", level: 68, points: "840K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Master", rank: 4, type: "Super X" },
    { name: "Zoro_Solo", level: 65, points: "760K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoro", rank: 5, type: "Super X" },
    { name: "Nami_Navigator", level: 62, points: "650K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nami", rank: 6, type: "Super X" },
    { name: "Sanji_Cook", level: 60, points: "590K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanji", rank: 7, type: "Super X" },
    { name: "Robin_Archaeologist", level: 58, points: "540K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robin", rank: 8, type: "Super X" },
];

const PERKS = [
    { icon: MessageCircle, title: "Special Badge", desc: "Unlock a unique Super X badge next to your name in discussions." },
    { icon: Zap, title: "Priority Streaming", desc: "Higher priority access to streaming servers during peak hours." },
    { icon: Crown, title: "Custom Profile", desc: "Customize your profile with exclusive themes and backgrounds." },
    { icon: ShieldCheck, title: "Early Access", desc: "Test new site features before they are released to the public." },
];

export default function SuperXPage() {
    return (
        <div className="min-h-screen bg-background text-white">
            {/* Super X Hero Header */}
            <div className="relative w-full bg-[#14141d] border-b border-white/5 py-16 lg:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
                
                <div className="container max-w-[1400px] mx-auto px-4 relative z-10 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                        <div className="space-y-6 max-w-2xl">
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-white/40 text-[12px] font-black uppercase tracking-[0.2em] mb-4">
                                <Link href="/home" className="hover:text-primary transition-colors">Home</Link>
                                <ChevronRight className="w-3 h-3" />
                                <Link href="/community" className="hover:text-primary transition-colors">Community</Link>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-white">Elite Status</span>
                            </div>
                            
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
                                <Zap className="w-4 h-4 fill-current" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Premium Status</span>
                            </div>
                            
                            <h1 className="text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter font-headline leading-[0.85]">
                                Elite <span className="text-primary">Status</span>
                            </h1>
                            <p className="text-white/40 text-[16px] lg:text-[18px] font-medium leading-relaxed italic">
                                "The inner circle of our most dedicated community members."
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                                <Button className="h-14 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest px-10 rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all gap-3">
                                    How to Join
                                    <ArrowUpRight className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" className="h-14 bg-white/5 border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest px-10 rounded-2xl transition-all">
                                    View Leaderboard
                                </Button>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="relative w-[400px] h-[400px]">
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-3xl" />
                                <div className="absolute inset-4 bg-[#1a1a25] rounded-[60px] border border-white/10 flex flex-col items-center justify-center space-y-6 saas-shadow rotate-3 hover:rotate-0 transition-transform duration-700 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-5">
                                        <Zap className="w-64 h-64 text-primary" />
                                    </div>
                                    <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                                        <Crown className="w-12 h-12" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-3xl font-black uppercase tracking-tighter font-headline">Elite Member</h3>
                                        <p className="text-white/40 text-xs font-black uppercase tracking-[0.3em]">Community Contributor</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="container max-w-[1400px] mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* Left Side: Leaderboard */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Trophy className="w-8 h-8 text-[#fbbf24]" />
                                <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter font-headline">
                                    Top <span className="text-primary">Contributors</span>
                                </h2>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                <Users className="w-4 h-4" />
                                Worldwide
                            </div>
                        </div>

                        <div className="bg-[#14141d] border border-white/5 rounded-[40px] overflow-hidden saas-shadow">
                            <div className="divide-y divide-white/5">
                                {SUPER_MEMBERS.map((member) => (
                                    <div 
                                        key={member.name}
                                        className="flex items-center gap-6 p-6 lg:p-8 hover:bg-white/[0.02] transition-all group"
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl font-headline shrink-0 transition-transform group-hover:scale-110",
                                            member.rank === 1 ? "bg-[#fbbf24] text-black shadow-lg shadow-[#fbbf24]/20" : 
                                            member.rank === 2 ? "bg-white/20 text-white border border-white/10" :
                                            member.rank === 3 ? "bg-[#cd7f32] text-white shadow-lg shadow-[#cd7f32]/20" :
                                            "bg-white/5 text-white/40 border border-white/5"
                                        )}>
                                            {member.rank}
                                        </div>
                                        
                                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-primary/30 transition-colors shrink-0">
                                            <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-black text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">{member.name}</h4>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                                                    member.type === "Legendary" ? "bg-primary text-black" : "bg-white/10 text-white/60"
                                                )}>
                                                    {member.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/20">
                                                <span className="text-primary/60">Level {member.level}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <span>Legend Rank</span>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right hidden sm:block">
                                            <div className="text-2xl font-black text-white font-headline tracking-tighter">{member.points}</div>
                                            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Contribution</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Information & Perks */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="bg-[#14141d] border border-white/5 rounded-[40px] p-8 lg:p-10 saas-shadow space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                            <div className="flex items-center gap-3">
                                <Info className="w-6 h-6 text-primary" />
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-headline">What is Elite Status?</h3>
                            </div>
                            <p className="text-white/40 text-sm font-medium leading-relaxed">
                                Elite Status is a prestigious community status awarded to users who exhibit exceptional dedication through discussions, content contribution, and positive community engagement.
                            </p>
                            <div className="space-y-6">
                                {PERKS.map((perk, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                                            <perk.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h5 className="text-[14px] font-black text-white uppercase tracking-tight">{perk.title}</h5>
                                            <p className="text-[12px] text-white/30 font-medium leading-relaxed">{perk.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-gradient-to-br from-primary/30 to-black/40 border border-primary/20 rounded-[40px] p-10 text-center space-y-6 shadow-2xl shadow-primary/10 group">
                            <div className="w-20 h-20 rounded-[28px] bg-white/10 flex items-center justify-center mx-auto transition-transform duration-700 group-hover:scale-110">
                                <Star className="w-10 h-10 text-white fill-current" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter font-headline">Join the Elite</h4>
                                <p className="text-white/60 text-[13px] font-medium leading-relaxed">
                                    Your path to Elite Status starts with your next meaningful contribution.
                                </p>
                            </div>
                            <Button className="w-full h-14 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95">
                                Start Participating
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
