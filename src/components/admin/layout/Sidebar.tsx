'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
    Home, 
    Search, 
    Settings, 
    BarChart, 
    Users, 
    Wrench, 
    Shield, 
    History, 
    Banknote, 
    Newspaper,
    ChevronLeft,
    Globe,
    Zap,
    LayoutDashboard
} from "lucide-react";
import type { UserRole } from '@/types/db';
import { cn } from '@/lib/utils';

const allMenuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Console Overview", requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST'] },
    { href: "/admin/site", icon: Settings, label: "Configuration", requiredRoles: ['SUPER_ADMIN', 'ADMIN'] },
    { href: "/admin/news", icon: Newspaper, label: "Content Updates", requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
    { href: "/admin/seo", icon: Globe, label: "Site Discovery", requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'SEO_MANAGER'] },
    { href: "/admin/users", icon: Users, label: "Community Directory", requiredRoles: ['SUPER_ADMIN', 'ADMIN'] },
    { href: "/admin/moderation", icon: Shield, label: "Safety & Compliance", requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'] },
    { href: "/admin/analytics", icon: BarChart, label: "Traffic Data", requiredRoles: ['SUPER_ADMIN', 'ADMIN', 'ANALYST'] },
    { href: "/admin/system", icon: Zap, label: "Site Health", requiredRoles: ['SUPER_ADMIN'] },
    { href: "/admin/ads", icon: Banknote, label: "Revenue Stream", requiredRoles: ['SUPER_ADMIN', 'ADMIN'] },
    { href: "/admin/audit-logs", icon: History, label: "Action Logs", requiredRoles: ['SUPER_ADMIN', 'ADMIN'] },
];

export function AdminSidebar({ userRole }: { userRole: UserRole }) {
    const pathname = usePathname();

    const menuItems = allMenuItems.filter(item => 
        (item.requiredRoles as UserRole[]).includes(userRole)
    );
    
    return (
        <Sidebar className="border-r border-white/5 bg-[#0B0C10]">
            <SidebarHeader className="p-8 border-b border-white/5">
                 <Link href="/home" className="flex items-center gap-4 group-data-[collapsible=icon]:hidden">
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-transform hover:scale-110">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-[1000] text-xl text-white uppercase tracking-tighter italic leading-none">Management</span>
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">Platform Control</span>
                    </div>
                </Link>
                 <Link href="/home" className="hidden group-data-[collapsible=icon]:flex items-center justify-center pt-2">
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-black">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent className="p-6">
                <SidebarMenu>
                    {menuItems.map(item => {
                        const isActive = item.href === '/admin' ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <SidebarMenuItem key={item.href} className="mb-2">
                                 <SidebarMenuButton 
                                    asChild
                                    isActive={isActive} 
                                    tooltip={item.label}
                                    className={cn(
                                        "h-12 rounded-2xl px-5 transition-all duration-500",
                                        isActive 
                                            ? "bg-primary text-black font-[1000] shadow-[0_10px_25px_rgba(147,51,234,0.3)] hover:bg-white hover:text-black" 
                                            : "text-white/40 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Link href={item.href} className="flex items-center gap-4">
                                        <item.icon className={cn("w-4 h-4", isActive ? "text-black" : "text-inherit")} />
                                        <span className="uppercase tracking-widest text-[10px] font-black">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            
            <div className="mt-auto p-8 border-t border-white/5 group-data-[collapsible=icon]:hidden">
                <Link href="/home" className="flex items-center gap-3 text-white/20 hover:text-primary transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-all">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] font-[1000] uppercase tracking-[0.2em] italic">Return to site</span>
                </Link>
            </div>
        </Sidebar>
    );
}
