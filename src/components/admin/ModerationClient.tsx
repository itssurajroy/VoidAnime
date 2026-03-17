'use client';

import { useState } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User, Shield, MessageSquare, Video, Check, X, Ban, Trash2, EyeOff, Flag, LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import type { ReportWithReporter } from '@/types/moderation';
import { formatDistanceToNow } from 'date-fns';
import { resolveReport, banUser, hideComment, deleteComment } from "@/actions/moderation";
import { cn } from "@/lib/utils";

interface ModerationClientProps {
    initialReports: ReportWithReporter[];
    totalReports: number;
    totalPages: number;
    initialComments?: any[];
    initialBans?: any[];
}

export function ModerationClient({ initialReports, totalReports, totalPages, initialComments = [], initialBans = [] }: ModerationClientProps) {
    const { toast } = useToast();
    const [reports, setReports] = useState<ReportWithReporter[]>(initialReports || []);
    const [comments, setComments] = useState(initialComments);
    const [bans, setBans] = useState(initialBans);
    const [activeTab, setActiveTab] = useState('reports');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const getReportIcon = (type: string) => {
        switch(type) {
            case 'COMMENT': return <MessageSquare className="w-4 h-4 text-primary" />;
            case 'EPISODE_SOURCE': return <Video className="w-4 h-4 text-primary" />;
            case 'USER': return <User className="w-4 h-4 text-primary" />;
            default: return <Shield className="w-4 h-4 text-primary" />;
        }
    }

    const handleResolve = async (reportId: string, action: 'RESOLVED' | 'DISMISSED') => {
        setProcessingId(reportId);
        try {
            const result = await resolveReport(reportId, action);
            if (result.success) {
                toast({
                    title: action === 'RESOLVED' ? "Report Resolved" : "Report Dismissed",
                    description: action === 'RESOLVED' 
                        ? "The report has been marked as resolved." 
                        : "The report has been dismissed.",
                });
                setReports(reports.filter(r => r.id !== reportId));
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to process report",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred",
            });
        }
        setProcessingId(null);
    }

    const handleBanUser = async (userId: string, reportId: string) => {
        setProcessingId(reportId);
        try {
            const result = await banUser(userId, 'HARASSMENT', 'Banned via moderation panel');
            if (result.success) {
                toast({
                    title: "User Banned",
                    description: "The user has been banned successfully.",
                });
                await resolveReport(reportId, 'RESOLVED');
                setReports(reports.filter(r => r.id !== reportId));
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to ban user",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred",
            });
        }
        setProcessingId(null);
    }

    const handleHideComment = async (commentId: string) => {
        setProcessingId(commentId);
        try {
            const result = await hideComment(commentId);
            if (result.success) {
                toast({
                    title: "Comment Hidden",
                    description: "The comment has been hidden.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to hide comment",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred",
            });
        }
        setProcessingId(null);
    }

    const handleDeleteComment = async (commentId: string) => {
        setProcessingId(commentId);
        try {
            const result = await deleteComment(commentId);
            if (result.success) {
                toast({
                    title: "Comment Deleted",
                    description: "The comment has been deleted permanently.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to delete comment",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred",
            });
        }
        setProcessingId(null);
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-14">
                <TabsTrigger 
                    value="reports" 
                    className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all flex items-center gap-2"
                >
                    <Shield className="w-3.5 h-3.5" />
                    Reports ({totalReports || 0})
                </TabsTrigger>
                <TabsTrigger 
                    value="comments" 
                    className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all flex items-center gap-2"
                >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Comments
                </TabsTrigger>
                <TabsTrigger 
                    value="bans" 
                    className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all flex items-center gap-2"
                >
                    <Ban className="w-3.5 h-3.5" />
                    Bans
                </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                                <Flag className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">User Reports</CardTitle>
                                <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Active reports requiring moderator attention</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        {reports.length > 0 ? (
                            <div className="rounded-[24px] border border-white/5 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-white/[0.02]">
                                        <TableRow className="hover:bg-transparent border-white/5">
                                            <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">Target</TableHead>
                                            <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Category</TableHead>
                                            <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Reporter</TableHead>
                                            <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Date</TableHead>
                                            <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pr-8">Actions</TableHead>
                                            </TableRow></TableHeader>
                                    <TableBody>
                                        {reports.map((report) => (
                                            <TableRow key={report.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                <TableCell className="pl-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/20 transition-all">
                                                            {getReportIcon(report.targetType)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-black text-white text-[13px] uppercase tracking-tight truncate max-w-[200px]">{report.targetId}</div>
                                                            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-0.5">{report.targetType}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-white/5 text-white/40 border-none font-black text-[8px] uppercase tracking-widest px-2.5 py-1">
                                                        {report.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-[11px] font-black text-white/60 uppercase">{report.reporter ? report.reporter.name : 'Anonymous'}</span>
                                                </TableCell>
                                                <TableCell className="text-[11px] font-black text-white/20 uppercase tracking-tighter italic">
                                                    {report.createdAt ? formatDistanceToNow(new Date(report.createdAt), { addSuffix: true }) : 'Unknown'}
                                                </TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" disabled={processingId === report.id} className="hover:bg-white/5 rounded-xl">
                                                                <MoreHorizontal className="h-4 w-4 text-white/40" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-background border-white/10 rounded-2xl min-w-[180px] p-2">
                                                            <DropdownMenuItem onClick={() => handleResolve(report.id, 'RESOLVED')} className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 transition-all text-xs font-black uppercase tracking-widest text-white/60">
                                                                <Check className="mr-3 h-3.5 w-3.5" />
                                                                Resolve Report
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleResolve(report.id, 'DISMISSED')} className="rounded-xl focus:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-white/60 focus:text-white">
                                                                <X className="mr-3 h-3.5 w-3.5" />
                                                                Dismiss Report
                                                            </DropdownMenuItem>
                                                            {report.targetType === 'USER' && (
                                                                <>
                                                                    <DropdownMenuSeparator className="bg-white/5 my-2" />
                                                                    <DropdownMenuItem 
                                                                        className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 transition-all text-xs font-black uppercase tracking-widest"
                                                                        onClick={() => handleBanUser(report.targetId, report.id)}
                                                                    >
                                                                        <Ban className="mr-3 h-3.5 w-3.5" />
                                                                        Ban User
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white/[0.01] border border-dashed border-white/5 rounded-[32px]">
                                <Shield className="mx-auto h-16 w-16 mb-6 opacity-5" />
                                <h3 className="text-xl font-black text-white/20 uppercase tracking-widest">Reports Clear</h3>
                                <p className="text-[10px] font-medium text-white/10 uppercase tracking-[0.2em] mt-2">All security reports have been analyzed and resolved.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="comments" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Comment Moderation</CardTitle>
                                <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Monitor and manage community conversation</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="rounded-[24px] border border-white/5 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-white/[0.02]">
                                    <TableRow className="hover:bg-transparent border-white/5">
                                        <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">User</TableHead>
                                        <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Comment</TableHead>
                                        <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Status</TableHead>
                                        <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Date</TableHead>
                                        <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pr-8">Actions</TableHead>
                                    </TableRow></TableHeader>
                                <TableBody>
                                    {comments.length > 0 ? comments.map((comment) => (
                                        <TableRow key={comment.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <TableCell className="pl-8 py-5">
                                                 <div className="flex items-center gap-4">
                                                    <Avatar className="w-10 h-10 rounded-xl border-2 border-white/5">
                                                        <AvatarFallback className="bg-primary/10 text-primary font-black">{(comment.userName || 'U').charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-white text-[13px] uppercase tracking-tight">{comment.userName || 'Unknown'}</p>
                                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-0.5 truncate max-w-[150px]">{comment.animeId}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-white/50 text-[13px] italic font-medium truncate max-w-sm px-4">
                                                &quot;{comment.text}&quot;
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 font-black text-[8px] uppercase tracking-widest">
                                                    Flagged
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-[11px] font-black text-white/20 uppercase tracking-tighter">
                                                {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Unknown'}
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl">
                                                            <MoreHorizontal className="h-4 w-4 text-white/40" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-background border-white/10 rounded-2xl min-w-[180px] p-2">
                                                        <DropdownMenuItem className="rounded-xl focus:bg-emerald-500/10 focus:text-emerald-400 transition-all text-xs font-black uppercase tracking-widest text-white/60">
                                                            <Check className="mr-3 h-3.5 w-3.5" />
                                                            Mark Safe
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleHideComment(comment.id)} className="rounded-xl focus:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-white/60 focus:text-white">
                                                            <EyeOff className="mr-3 h-3.5 w-3.5" />
                                                            Hide Comment
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 transition-all text-xs font-black uppercase tracking-widest"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                        >
                                                            <Trash2 className="mr-3 h-3.5 w-3.5" />
                                                            Delete Comment
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/5 my-2" />
                                                        <DropdownMenuItem className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 transition-all text-xs font-black uppercase tracking-widest">
                                                            <Ban className="mr-3 h-3.5 w-3.5" />
                                                            Ban User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-white/20">No flagged comments.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

             <TabsContent value="bans" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                                <Ban className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Banned Users</CardTitle>
                                <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Manage restricted user accounts</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        {bans.length > 0 ? (
                            <div className="rounded-[24px] border border-white/5 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-white/[0.02]">
                                        <TableRow className="hover:bg-transparent border-white/5">
                                            <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">User ID</TableHead>
                                            <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Reason</TableHead>
                                            <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Date</TableHead>
                                            <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pr-8">Actions</TableHead>
                                            </TableRow></TableHeader>
                                    <TableBody>
                                        {bans.map((ban) => (
                                            <TableRow key={ban.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                                <TableCell className="pl-8 py-5">
                                                    <p className="font-black text-white text-[13px] uppercase tracking-tight">{ban.userId}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 font-black text-[8px] uppercase tracking-widest">
                                                        {ban.reason || 'Violation'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-[11px] font-black text-white/20 uppercase tracking-tighter">
                                                    {ban.createdAt ? formatDistanceToNow(new Date(ban.createdAt), { addSuffix: true }) : 'Unknown'}
                                                </TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <Button variant="ghost" size="sm" className="hover:bg-white/5 rounded-xl text-red-400">
                                                        Unban
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[32px] p-12 text-center">
                                <Ban className="mx-auto h-16 w-16 mb-6 opacity-5" />
                                <h3 className="text-xl font-black text-white/20 uppercase tracking-widest">No Active Bans</h3>
                                <p className="text-[10px] font-medium text-white/10 uppercase tracking-[0.2em] mt-2">No users are currently restricted from the platform.</p>
                            </div>
                        )}
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
    );
}
