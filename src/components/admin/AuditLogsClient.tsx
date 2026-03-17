'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, History, ShieldCheck, ShieldAlert, Settings, Trash2, UserCog, Key } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AuditLog = {
    id: string;
    timestamp: string | Date;
    adminName?: string;
    action: string;
    details: Record<string, any>;
    ipAddress?: string;
};

const getActionIcon = (action: AuditLog['action']) => {
    switch (action) {
        case 'LOGIN_SUCCESS': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
        case 'LOGIN_FAIL': return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
        case 'UPDATE_SETTINGS': return <Settings className="w-3.5 h-3.5 text-blue-400" />;
        case 'DELETE_CONTENT': return <Trash2 className="w-3.5 h-3.5 text-orange-400" />;
        case 'CHANGE_ROLE': return <UserCog className="w-3.5 h-3.5 text-purple-400" />;
        default: return <Key className="w-3.5 h-3.5 text-white/40" />;
    }
}

const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
        case 'LOGIN_SUCCESS': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Success</Badge>;
        case 'LOGIN_FAIL': return <Badge variant="destructive" className="font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Failure</Badge>;
        case 'UPDATE_SETTINGS': return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Settings</Badge>;
        case 'DELETE_CONTENT': return <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Delete</Badge>;
        case 'CHANGE_ROLE': return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Role Change</Badge>;
        default: return <Badge variant="outline" className="text-white/20 border-white/5 font-black text-[8px] uppercase tracking-widest px-2 py-0.5">{action}</Badge>;
    }
}


export function AuditLogsClient({ initialLogs }: { initialLogs: AuditLog[] }) {
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredLogs = useMemo(() => {
        return initialLogs.filter(log => {
            const adminName = log.adminName || 'Unknown';
            const logDetails = JSON.stringify(log.details) || '';
            const ip = log.ipAddress || '';
            
            const searchMatch = adminName.toLowerCase().includes(search.toLowerCase()) || logDetails.toLowerCase().includes(search.toLowerCase()) || ip.includes(search);
            const actionMatch = actionFilter === 'all' || log.action === actionFilter;
            return searchMatch && actionMatch;
        });
    }, [initialLogs, search, actionFilter]);
    
    return (
        <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Activity Logs</CardTitle>
                        <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Comprehensive list of administrative events</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div className="relative flex-1 w-full group">
                        <Input 
                            placeholder="Identify event via user, details, or origin..." 
                            className="h-12 bg-white/5 border-white/5 rounded-2xl pl-12 text-white placeholder:text-white/20 focus:border-primary/50 transition-all" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    </div>
                     <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-full md:w-[220px] h-12 bg-white/5 border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                            <SelectValue placeholder="Action Filtering" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-white/10 rounded-xl">
                            <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">All Events</SelectItem>
                            <SelectItem value="LOGIN_SUCCESS" className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Login: Success</SelectItem>
                            <SelectItem value="LOGIN_FAIL" className="text-[10px] font-black uppercase tracking-widest text-red-400">Login: Failure</SelectItem>
                            <SelectItem value="UPDATE_SETTINGS" className="text-[10px] font-black uppercase tracking-widest text-blue-400">Core Config Update</SelectItem>
                            <SelectItem value="DELETE_CONTENT" className="text-[10px] font-black uppercase tracking-widest text-orange-400">Data Purge</SelectItem>
                            <SelectItem value="CHANGE_ROLE" className="text-[10px] font-black uppercase tracking-widest text-purple-400">Authorization Change</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-[24px] border border-white/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/[0.02]">
                            <TableRow className="hover:bg-transparent border-white/5">
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">Admin</TableHead>
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Event Type</TableHead>
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Action Details</TableHead>
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Timestamp</TableHead>
                                <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pr-8">Origin IP</TableHead>
                            </TableRow></TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => (
                                <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <TableCell className="pl-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-9 h-9 rounded-xl border-2 border-white/5 group-hover:border-primary/20 transition-all">
                                                <AvatarFallback className="bg-white/5 text-white/40 font-black">{(log.adminName || 'A').charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-black text-white text-[13px] uppercase tracking-tight">{log.adminName || 'Unknown'}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {getActionIcon(log.action)}
                                            {getActionBadge(log.action)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-white/50 text-[12px] italic font-medium max-w-xs truncate px-4">
                                        {JSON.stringify(log.details)}
                                    </TableCell>
                                    <TableCell className="text-[11px] font-black text-white/20 uppercase tracking-tighter tabular-nums italic">
                                        {isClient ? new Date(log.timestamp).toLocaleString() : null}
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <code className="bg-white/5 px-3 py-1.5 rounded-lg text-[10px] font-black text-white/40 group-hover:text-primary transition-colors">
                                            {log.ipAddress || 'server'}
                                        </code>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">Activity Monitoring Active</p>
                </div>
            </CardContent>
        </Card>
    );
}
