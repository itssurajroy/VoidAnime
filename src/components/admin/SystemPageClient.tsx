'use client';

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
    HardDrive, Trash2, Power, ShieldCheck, RefreshCw, Server, Cpu, MemoryStick, Timer, Package, FileImage, FileVideo, MoreHorizontal, Pencil, PlusCircle,
    ToggleRight, Cog, Play, Pause, FileText, Zap, Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { FeatureFlag, SystemService, BackgroundJob } from "@/types/db";
import {
    fetchFeatureFlags,
    setFeatureFlag,
    fetchSystemServices,
    refreshServices,
    fetchBackgroundJobs,
    runJobNow,
    clearApiCache,
    clearDataCache,
    clearAllCaches,
    setMaintenanceMode
} from "@/actions/system";
import { cn } from "@/lib/utils";


type EnvVar = {
    key: string;
    value: string;
};

type ServerInfo = {
    nodeVersion: string;
    platform: string;
    uptime: number;
}

interface SystemPageClientProps {
    envVars: EnvVar[];
    serverInfo: ServerInfo;
    initialMaintenanceMode?: { enabled: boolean; message: string };
}


function formatUptime(totalSeconds: number) {
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
  
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);
  
    return parts.join(' ') || '0s';
}


export function SystemPageClient({ envVars, serverInfo, initialMaintenanceMode }: SystemPageClientProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [maintenanceMode, setMaintenanceModeState] = useState(initialMaintenanceMode?.enabled ?? false);
    const [maintenanceMessage, setMaintenanceMessage] = useState(initialMaintenanceMode?.message ?? "The site is currently down for maintenance. We'll be back shortly!");

    const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
    const [services, setServices] = useState<SystemService[]>([]);
    const [backgroundJobs, setBackgroundJobs] = useState<BackgroundJob[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [flags, svcs, jobs] = await Promise.all([
                    fetchFeatureFlags(),
                    fetchSystemServices(),
                    fetchBackgroundJobs()
                ]);
                setFeatureFlags(flags);
                setServices(svcs);
                setBackgroundJobs(jobs);
            } catch (e) {
                console.error('Failed to load system data:', e);
            }
        }
        loadData();
    }, []);

    const fetchStatus = async () => {
        setIsLoading(true);
        try {
            await refreshServices();
            const svcs = await fetchSystemServices();
            setServices(svcs);
        } catch (e) {
            console.error('Failed to refresh services:', e);
        }
        setIsLoading(false);
    };

    const handleClearCache = async (type: 'api' | 'data' | 'all') => {
        try {
            let result;
            if (type === 'api') result = await clearApiCache();
            else if (type === 'data') result = await clearDataCache();
            else result = await clearAllCaches();
            
            toast({
                title: result.success ? "Cache Cleared" : "Error",
                description: result.message,
            });
        } catch (e) {
            toast({
                title: "Error",
                description: "Failed to clear cache",
                variant: "destructive"
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Operational': return 'text-emerald-500';
            case 'Degraded': return 'text-orange-500';
            case 'Down': return 'text-red-500';
            default: return 'text-white/20';
        }
    };

    const handleMaintenanceToggle = async (checked: boolean) => {
        try {
            await setMaintenanceMode(checked, maintenanceMessage);
            setMaintenanceModeState(checked);
            toast({
                title: checked ? "Maintenance Active" : "Site Live",
                description: checked ? "Status: Offline" : "Status: Online",
            });
        } catch (e) {
            toast({
                title: "Error",
                description: "Failed to update maintenance mode",
                variant: "destructive"
            });
        }
    };

    const handleFlagToggle = async (flagKey: string, currentEnabled: boolean) => {
        try {
            await setFeatureFlag(flagKey, !currentEnabled);
            setFeatureFlags(flags => flags.map(f => f.key === flagKey ? { ...f, enabled: !f.enabled } : f));
            toast({
                title: "Flag Update",
                description: `Feature ${flagKey} updated.`,
            });
        } catch (e) {
            toast({
                title: "Error",
                description: "Failed to update feature flag",
                variant: "destructive"
            });
        }
    };

    const getJobStatusBadge = (status: string) => {
        switch (status) {
            case 'Running': return <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 animate-pulse">Running</Badge>;
            case 'Paused': return <Badge variant="secondary" className="font-black text-[8px] uppercase tracking-widest px-2 py-0.5 opacity-50">Paused</Badge>;
            case 'Idle': return <Badge variant="outline" className="text-white/20 border-white/5 font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Idle</Badge>;
            case 'Failed': return <Badge variant="destructive" className="font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Failed</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleRunJob = async (jobId: string) => {
        try {
            await runJobNow(jobId);
            setBackgroundJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status: 'Running' as const } : j));
            toast({
                title: "Job Initiated",
                description: `Task ${jobId} is now active.`,
            });
        } catch (e) {
            toast({
                title: "Error",
                description: "Failed to start job",
                variant: "destructive"
            });
        }
    };
    
    return (
        <div className="space-y-12">
            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                            <Power className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Maintenance Mode</CardTitle>
                            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Enable maintenance mode to restrict public access</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                        <div className="space-y-1">
                            <Label htmlFor="maintenance-mode" className="text-xs font-black text-white uppercase tracking-widest">Site Offline</Label>
                            <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest italic">Show maintenance message to all users</p>
                        </div>
                        <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={handleMaintenanceToggle} className="data-[state=checked]:bg-red-500" />
                    </div>
                    {maintenanceMode && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                            <Label htmlFor="maintenance-message" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Maintenance Message</Label>
                            <Textarea id="maintenance-message" value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} className="min-h-[100px] bg-white/5 border-white/5 rounded-2xl text-white focus:border-red-500/50 resize-none italic" />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-10 lg:grid-cols-2">
                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <ToggleRight className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Feature Flags</CardTitle>
                                <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Toggle site features on or off</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="rounded-[24px] border border-white/5 overflow-hidden">
                            <Table>
                                <TableBody>
                                    {featureFlags.map(flag => (
                                        <TableRow key={flag.key} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="pl-8 py-5">
                                                <p className="font-black text-white text-[13px] uppercase tracking-tight">{flag.key}</p>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-0.5 max-w-xs">{flag.description}</p>
                                            </TableCell>
                                            <TableCell className="text-right pr-8">
                                                <Switch checked={flag.enabled} onCheckedChange={() => handleFlagToggle(flag.key, flag.enabled)} className="data-[state=checked]:bg-primary" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <Cog className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Background Jobs</CardTitle>
                                <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Manage automated background tasks</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="rounded-[24px] border border-white/5 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-white/[0.02]">
                                    <TableRow className="hover:bg-transparent border-white/5">
                                        <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">Job Name</TableHead>
                                        <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Status</TableHead>
                                        <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pr-8">Actions</TableHead>
                                    </TableRow></TableHeader>
                                <TableBody>
                                    {backgroundJobs.map(job => (
                                        <TableRow key={job.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <TableCell className="pl-8 py-5">
                                                <p className="font-black text-white text-[13px] uppercase tracking-tight">{job.name}</p>
                                                <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest mt-0.5 italic">{job.schedule}</p>
                                            </TableCell>
                                            <TableCell>{getJobStatusBadge(job.status)}</TableCell>
                                            <TableCell className="text-right pr-8">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl"><MoreHorizontal className="h-4 w-4 text-white/40" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-background border-white/10 rounded-2xl min-w-[150px] p-2">
                                                        <DropdownMenuItem onClick={() => handleRunJob(job.id)} className="rounded-xl focus:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-white/60 focus:text-white">
                                                            <Play className="mr-3 h-3.5 w-3.5" /> Run Now
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl focus:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-white/60 focus:text-white">
                                                            <Pause className="mr-3 h-3.5 w-3.5" /> Halt
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl focus:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-white/60 focus:text-white">
                                                            <FileText className="mr-3 h-3.5 w-3.5" /> Action History
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <HardDrive className="w-6 h-6 text-orange-400" />
                            </div>
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Cache Management</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <Alert className="bg-orange-500/5 border-orange-500/20 rounded-2xl text-orange-400 p-6">
                            <ShieldCheck className="h-5 w-5" />
                            <AlertTitle className="text-xs font-black uppercase tracking-widest mb-2">Caution</AlertTitle>
                            <AlertDescription className="text-xs font-medium italic opacity-70">Clearing the cache may temporarily slow down the site.</AlertDescription>
                        </Alert>
                        <div className="flex flex-col gap-3">
                            <Button variant="outline" onClick={() => handleClearCache('api')} className="h-12 rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">Clear API Cache</Button>
                            <Button variant="outline" onClick={() => handleClearCache('data')} className="h-12 rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">Clear Data Cache</Button>
                            <Button variant="destructive" onClick={() => handleClearCache('all')} className="h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20">Clear All Cache</Button>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <Server className="w-6 h-6 text-purple-400" />
                            </div>
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Server Information</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {[
                            { label: "Node.js Version", value: serverInfo.nodeVersion, icon: Cpu },
                            { label: "Server Platform", value: serverInfo.platform, icon: Server },
                            { label: "Memory Usage", value: "Serverless", icon: MemoryStick },
                            { label: "Server Uptime", value: formatUptime(serverInfo.uptime), icon: Timer }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                <item.icon className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors" />
                                <div className="min-w-0">
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-[13px] font-black text-white uppercase tracking-tight">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                
                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <Package className="w-6 h-6 text-emerald-400" />
                            </div>
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Storage Usage</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {[
                            { label: "Total Capacity", value: "42.5 GB / 100 GB", icon: HardDrive },
                            { label: "Images", value: "1,234,567", icon: FileImage },
                            { label: "Videos", value: "8,910", icon: FileVideo }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                                <item.icon className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors" />
                                <div className="min-w-0">
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-[13px] font-black text-white uppercase tracking-tight">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                            <Activity className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Service Status</CardTitle>
                            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Monitor the status of site services</CardDescription>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchStatus} disabled={isLoading} className="rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest px-8 h-11">
                        <RefreshCw className={cn("mr-3 h-4 w-4", isLoading && "animate-spin")} /> Refresh Status
                    </Button>
                </CardHeader>
                <CardContent className="p-8 grid gap-6 md:grid-cols-2">
                    {services.map(service => {
                        const color = getStatusColor(service.status);
                        return (
                            <div key={service.id} className="flex items-center gap-6 p-6 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white/10 transition-all group">
                                <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all", color)}>
                                    <Zap className="h-7 w-7" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-white uppercase tracking-tighter text-lg leading-none">{service.name}</p>
                                    <p className={cn("text-[9px] font-black uppercase tracking-widest mt-1.5", color)}>{service.status}</p>
                                </div>
                                <Badge className={cn("bg-white/5 border-none font-black text-[9px] px-3 py-1 uppercase tracking-widest", color)}>
                                    {service.status === 'Operational' ? 'Sync: OK' : service.status.toUpperCase()}
                                </Badge>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                            <Key className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Environment Variables</CardTitle>
                            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">View site configuration variables</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="rounded-[24px] border border-white/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-white/[0.02]">
                                <TableRow className="hover:bg-transparent border-white/5">
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">Variable Name</TableHead>
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Value</TableHead>
                                </TableRow></TableHeader>
                            <TableBody>
                                {envVars.length > 0 ? envVars.map((env) => (
                                    <TableRow key={env.key} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <TableCell className="pl-8 py-4 font-mono text-[12px] font-black text-primary/60">{env.key}</TableCell>
                                        <TableCell className="font-mono text-[12px] text-white/40 italic">
                                            {env.value ? (env.key.toLowerCase().includes('key') || env.key.toLowerCase().includes('secret') ? '••••••••••••••••' : env.value) : '-'}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={2} className="text-center py-20 text-white/10 font-black uppercase text-[10px] tracking-widest">No variables found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Key({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15.5 7.5 2.3 2.5a1 1 0 0 0 1.4 0l2.1-2.2a1 1 0 0 0 0-1.4l-2.1-2.2a1 1 0 0 0-1.4 0l-2.3 2.5a1 1 0 0 0 0 1.4Z"/><path d="m15.5 7.5-3 3"/><path d="m13.5 15 2 2"/><path d="m16 12.5 2 2"/><path d="m15 15 4.5-4.5"/><path d="M12 16.5 10.5 15"/><path d="m9 18 1.5-1.5"/><path d="M10 22c-4.4 0-8-3.6-8-8s3.6-8 8-8c2.1 0 4.1.8 5.6 2.3"/><path d="M10 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>
    )
}
