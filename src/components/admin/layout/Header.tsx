'use client';
import { useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AdminBreadcrumbs } from "@/components/admin/layout/Breadcrumbs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { User, LogOut, Monitor, Server, Smartphone, ShieldCheck, Terminal, Activity } from "lucide-react";
import type { AdminUser } from '@/types/admin';
import { cn } from '@/lib/utils';

type Environment = 'production' | 'staging' | 'development';

export function AdminHeader({ user }: { user: Omit<AdminUser, 'id'> }) {
    const [environment, setEnvironment] = useState<Environment>('production');

    const envConfig: Record<Environment, { className: string; label: string }> = {
        production: { className: 'bg-red-500', label: 'Production' },
        staging: { className: 'bg-orange-500', label: 'Staging' },
        development: { className: 'bg-emerald-500', label: 'Development' },
    }

    return (
        <header className="sticky top-0 z-[100] flex h-20 items-center gap-6 border-b border-white/5 bg-[#0B0C10]/80 backdrop-blur-2xl px-6 lg:px-10">
            <SidebarTrigger className="text-white/40 hover:text-white transition-colors" />
            <div className="hidden md:block">
                <AdminBreadcrumbs />
            </div>
            
            <div className="ml-auto flex items-center gap-6">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="outline" className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/[0.03] border-white/10 hover:bg-white/10 text-[9px] font-black uppercase tracking-[0.2em] h-11 px-6 shadow-lg">
                            <span className={cn("h-1.5 w-1.5 rounded-full shadow-[0_0_10px_currentColor]", envConfig[environment].className)} />
                            <span>{envConfig[environment].label}</span>
                       </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#12131a] border-white/10 rounded-[24px] p-2 min-w-[220px] shadow-3xl animate-in fade-in zoom-in-95 duration-200">
                        <DropdownMenuLabel className="text-[10px] font-[1000] text-white/30 uppercase tracking-[0.3em] p-4 flex items-center gap-3">
                            <Activity className="w-3.5 h-3.5" />
                            Site Status
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5 mb-2 mx-2" />
                        <DropdownMenuRadioGroup value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
                            <DropdownMenuRadioItem value="production" className="rounded-xl focus:bg-white/5 text-[10px] font-black uppercase tracking-widest p-4 transition-all"><Server className="mr-4 h-4 w-4 text-red-400"/>Live Production</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="staging" className="rounded-xl focus:bg-white/5 text-[10px] font-black uppercase tracking-widest p-4 transition-all"><Monitor className="mr-4 h-4 w-4 text-orange-400"/>Staging Environment</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="development" className="rounded-xl focus:bg-white/5 text-[10px] font-black uppercase tracking-widest p-4 transition-all"><Terminal className="mr-4 h-4 w-4 text-emerald-400"/>Local Development</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="w-px h-6 bg-white/10 hidden sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-4 group">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-[12px] font-[1000] text-white uppercase tracking-tight leading-none group-hover:text-primary transition-colors italic">{user.name}</span>
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mt-1.5">{user.role}</span>
                            </div>
                            <Avatar className="w-11 h-11 rounded-[18px] border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-primary/40 group-hover:scale-105 group-hover:rotate-3">
                                <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary font-black italic">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#12131a] border-white/10 rounded-[24px] p-2 min-w-[200px] shadow-3xl animate-in fade-in zoom-in-95 duration-200">
                        <DropdownMenuLabel className="text-[10px] font-[1000] text-white/30 uppercase tracking-[0.3em] p-4">Member Access</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5 mb-2 mx-2" />
                        <DropdownMenuItem className="rounded-xl focus:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 p-4 transition-all">
                            <User className="mr-4 h-4 w-4" />
                            Identity Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl focus:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 p-4 transition-all">
                            <ShieldCheck className="mr-4 h-4 w-4 text-primary" />
                            Access Security
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5 my-2 mx-2" />
                        <DropdownMenuItem className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 text-[10px] font-black uppercase tracking-widest p-4 transition-all">
                            <LogOut className="mr-4 h-4 w-4" />
                            Terminate Session
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
