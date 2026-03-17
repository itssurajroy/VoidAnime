'use client';

import { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    Tv, 
    RefreshCw, 
    ShieldAlert, 
    Activity, 
    Eye,
    TrendingUp,
    Zap,
    Clock,
    Target,
    BarChart3,
    History,
    Flame,
    ChevronRight
} from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import type { DailyStats, TopAnime } from '@/actions/analytics';
import { getDashboardStats, getDailyStats, getTopAnimeByViews, getRecentActivity } from '@/actions/analytics';
import { fetchBackgroundJobs } from '@/actions/system';
import { useFirebase } from '@/firebase/provider';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import type { BackgroundJob } from '@/types/db';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { motion, AnimatePresence } from 'framer-motion';

type DashboardStats = {
  totalUsers: number;
  totalReports: number;
  totalWatchRooms: number;
  activeViewers: number;
  activeWatchRooms: number;
  latency: number;
};

const chartConfig = {
  views: {
    label: "Page Views",
    color: "hsl(var(--primary))",
  },
  uniqueVisitors: {
    label: "Unique Visitors",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

interface DashboardClientProps {
    initialStats?: DashboardStats;
    dailyStats?: DailyStats[];
    topAnime?: TopAnime[];
    initialJobs?: BackgroundJob[];
    initialActivity?: any[];
}

export function DashboardClient({ initialStats, dailyStats: initialDailyStats, topAnime: initialTopAnime, initialJobs, initialActivity }: DashboardClientProps) {
    const { firestore } = useFirebase();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const [stats, setStats] = useState<DashboardStats>(initialStats || {
        totalUsers: 0,
        totalReports: 0,
        totalWatchRooms: 0,
        activeViewers: 0,
        activeWatchRooms: 0,
        latency: 0,
    });
    
    const [dailyStats, setDailyStats] = useState<DailyStats[]>(initialDailyStats || []);
    const [topAnime, setTopAnime] = useState<TopAnime[]>(initialTopAnime || []);
    const [jobs, setJobs] = useState<BackgroundJob[]>(initialJobs || []);
    const [activity, setActivity] = useState<any[]>(initialActivity || []);

    const [currentViewers, setCurrentViewers] = useState(initialStats?.activeViewers || 0);

    const loadInitialData = useCallback(async () => {
        try {
            const [dashboardStats, daily, top, backgroundJobs, recentActivity] = await Promise.all([
                getDashboardStats(),
                getDailyStats(30),
                getTopAnimeByViews(5),
                fetchBackgroundJobs(),
                getRecentActivity(10),
            ]);
            setStats(dashboardStats);
            setDailyStats(daily);
            setTopAnime(top);
            setJobs(backgroundJobs);
            setActivity(recentActivity);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }, []);

    useEffect(() => {
        if (!initialStats) {
            loadInitialData();
        }
    }, [initialStats, loadInitialData]);

    useEffect(() => {
        if (!firestore) return;
        
        // Live Activity Listener
        const activityQuery = query(
            collection(firestore, 'adminActivity'),
            orderBy('timestamp', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(activityQuery, (snapshot) => {
            const newActivity = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setActivity(newActivity);
        }, (error) => {
            console.error("Firestore Activity Listener Error:", error);
        });

        const interval = setInterval(async () => {
            const [realtime, backgroundJobs] = await Promise.all([
                getDashboardStats(),
                fetchBackgroundJobs(),
            ]);
            setCurrentViewers(realtime.activeViewers);
            setJobs(backgroundJobs);
        }, 30000); 
        
        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, [firestore]);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        setIsRefreshing(true);
        try {
            const [dashboardStats, daily, top, backgroundJobs, recentActivity] = await Promise.all([
                getDashboardStats(),
                getDailyStats(30),
                getTopAnimeByViews(5),
                fetchBackgroundJobs(),
                getRecentActivity(10),
            ]);
            setStats(dashboardStats);
            setDailyStats(daily);
            setTopAnime(top);
            setJobs(backgroundJobs);
            setActivity(recentActivity);
            setCurrentViewers(dashboardStats.activeViewers);
        } catch (error) {
            console.error('Failed to refresh dashboard data:', error);
        }
        setIsLoading(false);
        setTimeout(() => setIsRefreshing(false), 500);
    }, []);

    const chartData = dailyStats.length ? dailyStats.map(day => ({
        date: day.date,
        views: day.views,
        uniqueVisitors: day.uniqueVisitors,
    })) : Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return {
            date: date.toISOString().split('T')[0],
            views: 0,
            uniqueVisitors: 0,
        };
    });
    
    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic ml-1">Metrics & Analytics</h2>
                </div>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh} 
                    disabled={isLoading}
                    className="rounded-2xl bg-white/5 border-white/10 hover:bg-primary hover:text-black transition-all font-[1000] text-[10px] uppercase tracking-widest px-8 h-12 shadow-xl hover:shadow-primary/20"
                >
                    <RefreshCw className={cn("mr-3 h-4 w-4", isRefreshing && "animate-spin")} />
                    Refresh Data
                </Button>
            </div>
            
            {/* Top Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Watch Parties", value: stats.activeWatchRooms, icon: Tv, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { label: "Response Time", value: `${stats.latency}ms`, icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "User Reports", value: stats.totalReports, icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10" }
                ].map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        <GlassPanel intensity="medium" className="p-8 flex flex-col gap-4 hover:bg-white/[0.06] hover:border-primary/30 transition-all duration-500 group rounded-[32px] border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{m.label}</span>
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110", m.bg)}>
                                    <m.icon className={cn("h-5 w-5", m.color)} />
                                </div>
                            </div>
                            <div className="text-4xl font-[1000] text-white tracking-tighter italic tabular-nums leading-none">
                                {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
                            </div>
                        </GlassPanel>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Traffic Chart */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-8"
                >
                    <GlassPanel intensity="heavy" className="rounded-[48px] border-white/5 overflow-hidden shadow-3xl h-full">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    <h3 className="text-2xl font-[1000] text-white uppercase tracking-tighter italic">Traffic Analysis</h3>
                                </div>
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Historical visit data over 30 days</p>
                            </div>
                            <Target className="w-8 h-8 text-primary/20" />
                        </div>
                        <div className="p-8 h-[400px]">
                            <ChartContainer config={chartConfig} className="w-full h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                                        <XAxis 
                                            dataKey="date" 
                                            tickLine={false} 
                                            axisLine={false} 
                                            tickMargin={20} 
                                            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }}
                                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} 
                                        />
                                        <YAxis tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="views" 
                                            stroke="#9333ea" 
                                            strokeWidth={4}
                                            fillOpacity={1} 
                                            fill="url(#colorViews)" 
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </GlassPanel>
                </motion.div>

                {/* Trending Anime */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-4"
                >
                    <GlassPanel intensity="heavy" className="rounded-[48px] border-white/5 overflow-hidden shadow-3xl h-full flex flex-col">
                        <div className="p-10 border-b border-white/5 bg-white/[0.01]">
                            <div className="flex items-center gap-4">
                                <Flame className="w-6 h-6 text-primary animate-pulse" />
                                <h3 className="text-xl font-[1000] text-white uppercase tracking-tighter italic leading-none">Popular <span className="text-primary">Content</span></h3>
                            </div>
                        </div>
                        <div className="flex-1">
                            <Table>
                                <TableBody>
                                    {topAnime.length > 0 ? topAnime.map((anime, index) => (
                                        <TableRow key={anime.animeId} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                            <TableCell className="py-6 pl-10">
                                                <div className="flex items-center gap-5">
                                                    <span className={cn(
                                                        "text-xl font-black italic w-8",
                                                        index < 3 ? "text-primary" : "text-white/10"
                                                    )}>
                                                        {index + 1}
                                                    </span>
                                                    <div className="space-y-1">
                                                        <span className="font-[1000] text-white group-hover:text-primary transition-colors text-sm uppercase tracking-tight truncate block max-w-[180px]">
                                                            {anime.animeTitle}
                                                        </span>
                                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Trending Item</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-10">
                                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg">
                                                    {anime.views.toLocaleString()} Hits
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell className="text-center py-20 text-white/20 font-black text-[10px] uppercase tracking-widest" colSpan={2}>
                                                Data unavailable
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="p-10 border-t border-white/5">
                            <Button variant="ghost" className="w-full rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-primary hover:text-black text-white/40 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] h-14 transition-all italic">
                                Detailed Statistics
                            </Button>
                        </div>
                    </GlassPanel>
                </motion.div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Activity Log */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <GlassPanel intensity="medium" className="rounded-[48px] border-white/5 overflow-hidden shadow-3xl">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <History className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-[1000] text-white uppercase tracking-tighter italic leading-none">Activity Log</h3>
                            </div>
                            <Badge className="bg-primary text-black border-none uppercase text-[8px] font-[1000] tracking-widest px-3 py-1 rounded-full shadow-lg shadow-primary/20">Live Feed</Badge>
                        </div>
                        <div className="max-h-[450px] overflow-y-auto px-10 py-10 space-y-6 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {activity.length > 0 ? activity.map((act, i) => (
                                    <motion.div 
                                        key={act.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        className="flex gap-5 p-5 rounded-[32px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500"
                                    >
                                        <div className="w-12 h-12 rounded-[18px] bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-lg group-hover:shadow-primary/30">
                                            <span className="text-primary group-hover:text-black font-black text-sm italic">{act.adminName?.charAt(0) || 'A'}</span>
                                        </div>
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <p className="text-[13px] text-white/80 leading-snug">
                                                <span className="font-[1000] text-white uppercase tracking-tight group-hover:text-primary transition-colors">{act.adminName}</span>
                                                {" "}{act.action.toLowerCase().replace(/_/g, ' ')}{" "}
                                                <span className="font-bold text-primary italic">{act.targetType}</span>
                                            </p>
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">
                                                    {new Date(act.timestamp).toLocaleTimeString()} • {act.targetId}
                                                </p>
                                                <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                            <History className="w-8 h-8 text-white/10" />
                                        </div>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No recent entries</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </GlassPanel>
                </motion.div>

                {/* Active Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-8"
                >
                    <GlassPanel intensity="heavy" className="rounded-[48px] border-white/5 overflow-hidden shadow-3xl p-10 flex flex-col items-center justify-center gap-8 relative group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-700">
                                <Eye className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] italic">Real-time Visitors</h3>
                        </div>
                        
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full animate-pulse" />
                            <div className="text-8xl font-[1000] text-white tracking-tighter italic leading-none relative z-10 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                                {currentViewers}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shadow-[0_0_10px_#10b981]" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Live Connections</span>
                        </div>
                    </GlassPanel>

                    {/* Background Tasks */}
                    <GlassPanel intensity="medium" className="rounded-[48px] border-white/5 overflow-hidden shadow-3xl flex-1">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Clock className="w-6 h-6 text-blue-400" />
                                <h3 className="text-xl font-[1000] text-white uppercase tracking-tighter italic leading-none">Background Processes</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[9px] font-[1000] text-white/40 uppercase tracking-widest">Optimization Active</span>
                            </div>
                        </div>
                        <div className="p-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {jobs.map((job, i) => (
                                    <div key={i} className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-4 group hover:bg-white/[0.06] transition-all duration-500 hover:border-blue-500/30">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-blue-400 transition-colors">{job.name}</p>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                job.status === 'Running' ? "bg-primary animate-pulse" : "bg-white/20"
                                            )} />
                                        </div>
                                        <div className="flex items-end justify-between gap-4">
                                            <span className={cn(
                                                "text-lg font-black uppercase italic tracking-tight",
                                                job.status === 'Running' ? "text-white" : "text-white/40"
                                            )}>{job.status}</span>
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic mb-1">{job.schedule}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassPanel>
                </motion.div>
            </div>
        </div>
    );
}
