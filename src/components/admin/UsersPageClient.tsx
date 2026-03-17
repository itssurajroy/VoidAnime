'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, ShieldAlert, Lock, Unlock, ChevronLeft, ChevronRight, UserPlus, Users, Fingerprint, Mail, Calendar, ShieldCheck, Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { User, UserStatus } from "@/types/db";
import type { UserRole } from '@/types/db';
import { updateUserRole, updateUserStatus } from "@/actions/users";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { motion, AnimatePresence } from "framer-motion";


type UsersPageClientProps = {
    initialUsers: User[];
    totalUsers: number;
    totalPages: number;
}

const getStatusBadge = (status: UserStatus) => {
    switch(status) {
        case 'ACTIVE': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[8px] font-black tracking-widest">Active</Badge>;
        case 'BANNED': return <Badge variant="destructive" className="uppercase text-[8px] font-black tracking-widest">Banned</Badge>;
        case 'INACTIVE': return <Badge className="bg-white/10 text-white/40 border-none uppercase text-[8px] font-black tracking-widest">Inactive</Badge>;
        case 'PENDING_VERIFICATION': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase text-[8px] font-black tracking-widest">Pending</Badge>;
    }
}


export function UsersPageClient({ initialUsers, totalUsers, totalPages }: UsersPageClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const [isClient, setIsClient] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const debouncedSearch = useDebounce(searchQuery, 500);

    const currentPage = Number(searchParams.get('page')) || 1;
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); 
        router.replace(`${pathname}?${params.toString()}`);
    }, [debouncedSearch, pathname, router, searchParams]);

    const handleRoleChange = (userId: string, role: UserRole) => {
        startTransition(async () => {
            const result = await updateUserRole(userId, role);
            if (result.success) {
                toast({ title: "Success", description: `User role updated to ${role}.` });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error });
            }
        });
    }
    
    const handleStatusChange = (userId: string, status: UserStatus) => {
         startTransition(async () => {
            const result = await updateUserStatus(userId, status);
            if (result.success) {
                toast({ title: "Success", description: `User status updated to ${status}.` });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error });
            }
        });
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    }
    
    return (
        <GlassPanel intensity="heavy" className="rounded-[48px] border-white/5 overflow-hidden shadow-3xl">
            <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <Users className="w-6 h-6 text-primary" />
                            <h3 className="text-2xl font-[1000] text-white uppercase tracking-tighter italic leading-none">Community Directory</h3>
                        </div>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] ml-10">Manage site members and access permissions</p>
                    </div>
                    <Button className="rounded-2xl bg-primary text-black font-[1000] text-[11px] uppercase tracking-widest px-10 h-14 shadow-xl shadow-primary/20 hover:scale-105 hover:bg-white transition-all">
                        <UserPlus className="mr-3 h-4 w-4" /> Create Member
                    </Button>
                </div>
            </div>

            <div className="p-10">
                <div className="flex items-center gap-6 mb-10">
                    <div className="relative flex-1 group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <Search className="h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                            <div className="w-px h-4 bg-white/10" />
                        </div>
                        <Input 
                            placeholder="Search members by identification or email address..." 
                            className="h-16 bg-white/[0.03] border-white/5 rounded-3xl pl-16 text-sm font-bold text-white placeholder:text-white/10 focus:border-primary/30 transition-all outline-none" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="rounded-[32px] border border-white/5 overflow-hidden bg-black/20">
                    <Table>
                        <TableHeader className="bg-white/[0.02]">
                            <TableRow className="hover:bg-transparent border-white/5">
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-16 pl-10">
                                    <div className="flex items-center gap-2">
                                        <Fingerprint className="w-3 h-3" />
                                        Identity
                                    </div>
                                </TableHead>
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-16">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" />
                                        Access Level
                                    </div>
                                </TableHead>
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-16">Status</TableHead>
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-16">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-3 h-3" />
                                        Last Login
                                    </div>
                                </TableHead>
                                <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-16 pr-10">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {initialUsers.map((user, i) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className={cn(
                                            "border-white/5 hover:bg-white/[0.03] transition-colors group",
                                            user.status === 'BANNED' && 'opacity-40 grayscale'
                                        )}
                                    >
                                        <TableCell className="pl-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="relative shrink-0">
                                                    <Avatar className="w-12 h-12 rounded-2xl border border-white/10 shadow-2xl transition-transform group-hover:scale-110 duration-500">
                                                        <AvatarImage src={user.avatarUrl || undefined} alt={user.name} className="object-cover" />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-black italic">{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className={cn(
                                                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-[#0B0C10]",
                                                        user.status === 'ACTIVE' ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-zinc-600"
                                                    )} />
                                                </div>
                                                <div className="min-w-0 space-y-1">
                                                    <p className="font-[1000] text-white text-[14px] uppercase tracking-tight group-hover:text-primary transition-colors italic">{user.name}</p>
                                                    <div className="flex items-center gap-2 text-white/20 font-medium truncate text-[10px]">
                                                        <Mail className="w-2.5 h-2.5" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "uppercase text-[9px] font-black tracking-widest border-none px-3 py-1 rounded-lg",
                                                user.role === 'USER' ? "bg-white/5 text-white/40" : "bg-primary/10 text-primary shadow-lg shadow-primary/5"
                                            )}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(user.status)}
                                        </TableCell>
                                        <TableCell className="text-[11px] font-black text-white/30 uppercase tracking-tighter tabular-nums">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                </div>
                                                {isClient && user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '—'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" disabled={isPending} className="hover:bg-primary hover:text-black w-10 h-10 rounded-xl transition-all group/btn">
                                                        <MoreHorizontal className="h-5 w-5 text-white/40 group-hover/btn:text-black" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#12131a] border-white/10 rounded-[24px] min-w-[200px] p-2 shadow-3xl animate-in fade-in zoom-in-95 duration-200">
                                                    <DropdownMenuItem className="rounded-xl focus:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-white/60 focus:text-white px-4 py-3">View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl focus:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-white/60 focus:text-white px-4 py-3">Edit Credentials</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/5 my-2" />
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger className="rounded-xl focus:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-white/60 focus:text-white px-4 py-3">Change Access Level</DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent className="bg-[#12131a] border-white/10 rounded-2xl p-2 shadow-3xl">
                                                            <DropdownMenuRadioGroup value={user.role} onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}>
                                                                {['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST', 'USER'].map(role => (
                                                                    <DropdownMenuRadioItem key={role} value={role} className="rounded-xl focus:bg-primary/10 focus:text-primary text-[9px] font-black uppercase tracking-widest py-3 px-4 transition-all">{role}</DropdownMenuRadioItem>
                                                                ))}
                                                            </DropdownMenuRadioGroup>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator className="bg-white/5 my-2" />
                                                     <DropdownMenuItem 
                                                        className="rounded-xl focus:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-white/60 focus:text-white px-4 py-3"
                                                        onClick={() => handleStatusChange(user.id, user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                                                    >
                                                        {user.status === 'ACTIVE' ? <Lock className="mr-3 h-4 w-4" /> : <Unlock className="mr-3 h-4 w-4" />}
                                                        {user.status === 'ACTIVE' ? "Restrict Access" : "Grant Access"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 transition-all text-[10px] font-black uppercase tracking-widest px-4 py-3"
                                                        onClick={() => handleStatusChange(user.id, user.status === 'BANNED' ? 'ACTIVE' : 'BANNED')}
                                                    >
                                                         <ShieldAlert className="mr-3 h-4 w-4" />
                                                        {user.status === 'BANNED' ? "Revoke Ban" : "Ban Account"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-8">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">
                       Index {currentPage} / {totalPages} • Total {totalUsers.toLocaleString()} Members Identified
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="rounded-xl bg-white/[0.03] border-white/5 hover:bg-white/10 hover:border-white/10 text-white/40 h-12 px-6 transition-all font-black uppercase tracking-widest text-[10px] disabled:opacity-20"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Prev
                        </Button>
                         <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="rounded-xl bg-white/[0.03] border-white/5 hover:bg-white/10 hover:border-white/10 text-white/40 h-12 px-6 transition-all font-black uppercase tracking-widest text-[10px] disabled:opacity-20"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </GlassPanel>
    );
}
