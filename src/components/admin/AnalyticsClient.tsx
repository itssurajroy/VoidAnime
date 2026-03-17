'use client';

import { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Users, Clock, RefreshCw, TrendingUp, BarChart3, Globe, MousePointer2 } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { 
  getDailyStats, 
  getTopAnimeByViews, 
  getTrafficSources, 
  getEngagementMetrics, 
  getViewsByCountry,
  type DailyStats,
  type TopAnime,
  type TrafficSource,
  type EngagementMetrics,
  type CountryStats
} from '@/actions/analytics';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--primary))",
  },
  watchTime: {
    label: "Watch Time (h)",
    color: "hsl(var(--accent))",
  },
  uniqueVisitors: {
    label: "Visitors",
    color: "hsl(var(--secondary))",
  }
} satisfies ChartConfig

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface AnalyticsClientProps {
    initialDailyStats?: DailyStats[];
    initialTopAnime?: TopAnime[];
    initialTrafficSources?: TrafficSource[];
    initialEngagement?: EngagementMetrics;
    initialCountryStats?: CountryStats[];
}

export function AnalyticsClient({ 
  initialDailyStats, 
  initialTopAnime, 
  initialTrafficSources, 
  initialEngagement, 
  initialCountryStats 
}: AnalyticsClientProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [timeframe, setTimeframe] = useState('30');
    
    const [dailyStats, setDailyStats] = useState<DailyStats[]>(initialDailyStats || []);
    const [topAnime, setTopAnime] = useState<TopAnime[]>(initialTopAnime || []);
    const [trafficSources, setTrafficSources] = useState<TrafficSource[]>(initialTrafficSources || []);
    const [engagement, setEngagement] = useState<EngagementMetrics>(initialEngagement || { avgSessionDuration: 0, bounceRate: 0, pagesPerSession: 0, returningUsers: 0, newUsers: 0 });
    const [countryStats, setCountryStats] = useState<CountryStats[]>(initialCountryStats || []);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const days = parseInt(timeframe);
            const [daily, top, traffic, eng, countries] = await Promise.all([
                getDailyStats(days),
                getTopAnimeByViews(10),
                getTrafficSources(),
                getEngagementMetrics(),
                getViewsByCountry(),
            ]);
            setDailyStats(daily);
            setTopAnime(top);
            setTrafficSources(traffic);
            setEngagement(eng);
            setCountryStats(countries);
        } catch (error) {
            console.error('Failed to load analytics data:', error);
        }
        setIsLoading(false);
    }, [timeframe]);

    useEffect(() => {
        if (!initialDailyStats) {
            loadData();
        }
    }, [initialDailyStats, loadData]);

    useEffect(() => {
        if (initialDailyStats) {
            loadData();
        }
    }, [timeframe, initialDailyStats, loadData]);

    const totalViews = dailyStats.reduce((sum, day) => sum + day.views, 0);
    const totalVisitors = dailyStats.reduce((sum, day) => sum + day.uniqueVisitors, 0);
    const totalWatchTime = dailyStats.reduce((sum, day) => sum + day.watchTimeMinutes, 0);
    const totalEpisodes = dailyStats.reduce((sum, day) => sum + day.episodesWatched, 0);

    const chartData = dailyStats.map(day => ({
        date: day.date,
        views: day.views,
        uniqueVisitors: day.uniqueVisitors,
        watchTime: Math.round(day.watchTimeMinutes / 60),
    }));

    const topAnimeData = topAnime.map(anime => ({
        name: anime.animeTitle.length > 20 ? anime.animeTitle.substring(0, 20) + '...' : anime.animeTitle,
        views: anime.views,
    }));

    const trafficData = trafficSources.map(source => ({
        name: source.source,
        value: source.visitors,
        fill: COLORS[trafficSources.indexOf(source) % COLORS.length],
    }));

    const handleRefresh = () => {
        loadData();
    }
    
    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger className="w-[200px] h-11 bg-white/5 border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            <SelectValue placeholder="Timeframe Selection" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-white/10 rounded-xl">
                            <SelectItem value="7" className="text-[10px] font-black uppercase tracking-widest focus:bg-white/5">Range: 7 Days</SelectItem>
                            <SelectItem value="30" className="text-[10px] font-black uppercase tracking-widest focus:bg-white/5">Range: 30 Days</SelectItem>
                            <SelectItem value="90" className="text-[10px] font-black uppercase tracking-widest focus:bg-white/5">Range: 90 Days</SelectItem>
                            <SelectItem value="365" className="text-[10px] font-black uppercase tracking-widest focus:bg-white/5">Range: 1 Year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh} 
                    disabled={isLoading}
                    className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest px-8 h-11"
                >
                    <RefreshCw className={cn("mr-2 h-3.5 w-3.5", isLoading && "animate-spin")} />
                    Refresh Analytics
                </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 {[
                    { label: "Total Network Pings", value: totalViews, icon: Eye, color: "text-primary", trend: "+15.2%" },
                    { label: "Unique Visitors", value: totalVisitors, icon: Users, color: "text-blue-400", trend: "+8.5%" },
                    { label: "Watch Duration", value: `${Math.round(totalWatchTime / 60)}h`, icon: Clock, color: "text-purple-400", trend: "+12.4%" },
                    { label: "Sync Events", value: totalEpisodes, icon: BarChart3, color: "text-emerald-400", trend: "+18.2%" }
                 ].map((m, i) => (
                    <Card key={i} className="bg-white/[0.02] border border-white/5 rounded-[32px] saas-shadow hover:bg-white/[0.04] transition-all duration-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{m.label}</CardTitle>
                            <m.icon className={cn("h-4 w-4", m.color)} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white tracking-tighter tabular-nums">{typeof m.value === 'number' ? m.value.toLocaleString() : m.value}</div>
                            <p className="text-[9px] font-black text-emerald-500/60 flex items-center gap-1 mt-1 uppercase tracking-widest">
                                <TrendingUp className="h-3 w-3" />
                                {m.trend} Growth
                            </p>
                        </CardContent>
                    </Card>
                 ))}
            </div>
            
            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tighter">Traffic Analysis</CardTitle>
                    <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Cross-referencing views and visitor patterns</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] w-full p-6">
                     <ChartContainer config={chartConfig} className="w-full h-full">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                            <XAxis 
                                dataKey="date" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={15} 
                                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 900 }}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} 
                            />
                            <YAxis tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 900 }} />
                             <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                            <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" animationDuration={1500} />
                            <Area type="monotone" dataKey="uniqueVisitors" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" animationDuration={1500} />
                        </AreaChart>
                     </ChartContainer>
                </CardContent>
            </Card>
            
            <div className="grid gap-8 lg:grid-cols-2">
                 <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Most Popular Anime</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full p-6">
                        {topAnimeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topAnimeData} layout="vertical" margin={{ left: 0, right: 30 }}>
                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        tickLine={false} 
                                        axisLine={false} 
                                        tickMargin={8} 
                                        width={120} 
                                        tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900 }} 
                                    />
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} barSize={24} animationDuration={1500} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-white/10 gap-4">
                                <TrendingUp className="w-12 h-12 opacity-5" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Empty Frequency</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                 <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-blue-400" />
                            <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Origin Distribution</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full p-6">
                        {trafficData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={trafficData} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60}
                                        outerRadius={100} 
                                        paddingAngle={5}
                                        stroke="none"
                                    >
                                        {trafficData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-white/10 gap-4">
                                <Globe className="w-12 h-12 opacity-5" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Global Scan Empty</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 pb-10">
                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <MousePointer2 className="w-5 h-5 text-emerald-400" />
                            <CardTitle className="text-sm font-black text-white uppercase tracking-widest">User Engagement</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: "Avg. Duration", value: `${engagement.avgSessionDuration}m`, color: "bg-blue-500/10 text-blue-400" },
                                { label: "Bounce Rate", value: `${engagement.bounceRate}%`, color: "bg-red-500/10 text-red-400" },
                                { label: "Pages/Sync", value: engagement.pagesPerSession, color: "bg-purple-500/10 text-purple-400" },
                                { label: "Active Users", value: engagement.newUsers + engagement.returningUsers, color: "bg-emerald-500/10 text-emerald-400" }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-2 hover:bg-white/5 transition-all">
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{item.label}</p>
                                    <p className={cn("text-2xl font-black tabular-nums tracking-tighter")}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-primary" />
                            <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Global Visitor Locations</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {countryStats.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {countryStats.slice(0, 5).map((country) => (
                                    <div key={country.countryCode} className="flex items-center justify-between p-5 px-8 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl drop-shadow-lg">{getCountryFlag(country.countryCode)}</span>
                                            <span className="font-black text-white uppercase tracking-tight text-[13px]">{country.country}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[11px] font-black text-white/30 uppercase tabular-nums">{country.visitors.toLocaleString()} Users</span>
                                            <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] px-2 py-0.5">{country.percentage}%</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-white/10 gap-4">
                                <Globe className="w-12 h-12 opacity-5" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Geographical Scan Clear</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function getCountryFlag(countryCode: string): string {
    if (!countryCode || countryCode.length < 2) return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
