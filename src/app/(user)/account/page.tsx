'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useWatchlist } from '@/hooks/use-watchlist';
import { useUserStats } from '@/hooks/use-user-stats';
import { useWatchHistory } from '@/hooks/use-watch-history';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  Loader2,
  Camera,
  Play,
  CheckCircle,
  Clock,
  Shield,
  Bell,
  AlertTriangle,
  LogOut,
  User,
  Zap,
  Activity,
  History,
  TrendingUp,
  Cpu,
  Database,
  X,
  Trash2,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RankBadge } from '@/components/profile/RankBadge';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';

import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { DangerZone } from '@/components/settings/DangerZone';

interface UserProfile {
  username: string;
  bio: string;
  coverBanner: string;
  createdAt: string;
}

const gradients = [
  'from-[#8b5cf6] to-[#6d28d9]',
  'from-blue-600 to-indigo-600',
  'from-purple-600 to-rose-600',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
];

type Section = 'dashboard' | 'watchlist' | 'history' | 'settings';

function AccountContent() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const { watchlist, updateStatus, removeItem } = useWatchlist();
  const { history, clearHistory } = useWatchHistory();
  const userStats = useUserStats(watchlist);
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  useEffect(() => {
    const section = searchParams.get('section') as Section;
    if (section && ['dashboard', 'watchlist', 'history', 'settings'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    bio: '',
    coverBanner: '',
    createdAt: '',
  });

  useEffect(() => {
    if (!user || !firestore) return;

    const profileRef = doc(firestore, 'users', user.uid);
    const unsubProfile = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserProfile;
        setProfile(data);
      } else {
        setDoc(profileRef, {
          username: user.displayName || '',
          bio: '',
          coverBanner: gradients[0],
          createdAt: new Date().toISOString(),
        });
      }
    });

    return () => unsubProfile();
  }, [user, firestore]);

  const handleChangeCover = async () => {
    if (!user || !firestore) return;
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    await updateDoc(doc(firestore, 'users', user.uid), { coverBanner: randomGradient });
  };

  const selectedGradient = profile.coverBanner || gradients[0];

  // Data for charts
  const statusData = [
    { name: 'Watching', value: userStats.counts.watching, color: '#8b5cf6' },
    { name: 'Completed', value: userStats.counts.completed, color: '#10b981' },
    { name: 'Planned', value: userStats.counts.planToWatch || 0, color: '#3b82f6' },
    { name: 'Dropped', value: userStats.counts.dropped, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const genreData = (userStats.genres || [])
    .map(g => ({ name: g.label, value: g.value }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 6);

  if (isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0e0f11] gap-6">
        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_30px_rgba(244,63,94,0.3)]" />
        <p className="text-primary font-black uppercase tracking-[0.3em] animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'watchlist', label: 'My Watchlist', icon: Database, badge: userStats.counts.total },
    { id: 'history', label: 'Watch History', icon: History },
    { id: 'settings', label: 'Settings', icon: Cpu },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Enhanced Sidebar */}
      <aside className="w-80 bg-[#0e0f11] border-r border-white/5 hidden lg:flex flex-col sticky top-[64px] h-[calc(100vh-64px)] z-30">
        <div className="p-8 border-b border-white/5 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse group-hover:bg-primary/40 transition-all" />
              <Avatar className="h-14 w-14 border-2 border-primary/30 relative z-10">
                <AvatarImage src={user?.photoURL || ''} />
                <AvatarFallback className="bg-primary/10 text-primary font-black">{profile.username?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0e0f11] rounded-full z-20" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-white truncate text-base uppercase tracking-tighter">{profile.username || user?.displayName || 'USER'}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 flex items-center gap-2">
                  <RankBadge rank={userStats.rank} className={cn("w-3 h-3", userStats.rankColor)} />
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">LVL {userStats.level}</span>
                </div>
                <span className={cn("text-[10px] truncate font-bold uppercase tracking-widest", userStats.rankColor)}>{userStats.rank}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <div className="px-4 py-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as Section)}
              className={cn(
                'w-full flex items-center gap-4 h-12 px-4 rounded-2xl transition-all duration-500 font-bold text-[13px] group relative overflow-hidden',
                activeSection === item.id
                  ? 'bg-primary text-white shadow-2xl shadow-primary/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              )}
            >
              {activeSection === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-shimmer" />
              )}
              <item.icon className={cn('h-4 w-4 relative z-10 transition-transform group-hover:scale-110', activeSection === item.id ? 'stroke-[3px]' : '')} />
              <span className="relative z-10 uppercase tracking-widest">{item.label}</span>
              {item.badge !== undefined && (
                <span className={cn(
                  "ml-auto text-[10px] font-black px-2.5 py-1 rounded-lg relative z-10 transition-colors",
                  activeSection === item.id ? "bg-black/20" : "bg-white/5 text-white/20"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <Button variant="ghost" className="w-full justify-start gap-4 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-2xl h-12 px-4 font-black text-[12px] transition-all uppercase tracking-[0.2em]" asChild>
            <Link href="/">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        {/* Navigation (Mobile) */}
        <div className="lg:hidden border-b border-white/5 bg-[#0e0f11]/80 backdrop-blur-2xl sticky top-0 z-40">
          <div className="flex items-center gap-4 p-4 pb-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="font-black text-white text-sm uppercase tracking-widest">{activeSection}</span>
          </div>
          <div className="flex overflow-x-auto gap-1 p-3 scrollbar-none">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all text-[11px] font-black uppercase tracking-widest shrink-0',
                  activeSection === item.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-white/40 bg-white/5'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.badge !== undefined && (
                  <span className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded-md",
                    activeSection === item.id ? "bg-black/20" : "bg-white/5"
                  )}>{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-16 space-y-12 pb-32">

          {activeSection === 'dashboard' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000">

              {/* Profile Header */}
              <div className="relative">
                <div className={cn("h-48 md:h-80 rounded-[40px] relative overflow-hidden saas-shadow group bg-gradient-to-br transition-all duration-700", selectedGradient)}>
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-6 right-6 glass-panel border-white/10 text-white hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-10 px-6 transition-all z-20"
                    onClick={handleChangeCover}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Change Theme
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-10 -mt-24 md:-mt-32 relative z-10 px-6 md:px-12">
                  <div className="relative group self-center md:self-start">
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-[56px] ring-[12px] ring-[#050505] bg-[#0e0f11] overflow-hidden saas-shadow relative transition-all duration-700 group-hover:rounded-[40px] group-hover:scale-[1.02]">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage src={user?.photoURL || ''} className="transition-transform duration-1000 group-hover:scale-110 object-cover" />
                        <AvatarFallback className="text-6xl font-black bg-white/5 text-primary">{profile.username?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                      {/* XP Progress Ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-white/5"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="48"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={301.59}
                          strokeDashoffset={301.59 - (301.59 * userStats.progressToNextLevel) / 100}
                          className="text-primary shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all duration-1000 ease-out"
                        />
                      </svg>
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-2xl border-4 border-[#050505] z-20">
                      LVL {userStats.level}
                    </div>
                  </div>

                  <div className="flex-1 space-y-6 pt-10 md:pt-36 text-center md:text-left">
                    <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase font-headline drop-shadow-2xl">{profile.username || user?.displayName || 'USER'}</h1>
                        <div className={cn("px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 mb-2 inline-flex items-center gap-2 self-center md:self-auto", userStats.rankColor)}>
                          <RankBadge rank={userStats.rank} className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-black uppercase tracking-[0.3em]">{userStats.rank}</span>
                        </div>
                      </div>
                      <div className="max-w-2xl relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/30 rounded-full hidden md:block" />
                        <p className="text-white/50 text-base md:text-xl font-medium leading-relaxed italic md:pl-6">&quot;{profile.bio || "No bio provided."}&quot;</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                {[
                  { label: 'Time Spent', value: `${userStats.timeSpent.days}d ${userStats.timeSpent.hours}h`, icon: Clock, color: 'text-primary', sub: 'Total viewing time' },
                  { label: 'Watchlist Size', value: userStats.counts.total, icon: Database, color: 'text-blue-400', sub: 'Unique anime titles' },
                  { label: 'Completed', value: userStats.counts.completed, icon: CheckCircle, color: 'text-emerald-400', sub: 'Series finalized' },
                  { label: 'Episodes Watched', value: `${userStats.counts.episodesWatched}`, icon: Zap, color: 'text-rose-400', sub: 'Anime interactions' },
                ].map((stat, idx) => (
                  <div key={stat.label} className="glass-panel p-8 rounded-[32px] border-none saas-shadow relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-all duration-700" />
                    <stat.icon className={cn("w-6 h-6 mb-6", stat.color)} />
                    <p className="text-3xl md:text-4xl font-black mb-2 tracking-tighter tabular-nums">{stat.value}</p>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-white/[0.05] text-[9px] font-bold uppercase tracking-widest mt-4 group-hover:text-primary/20 transition-colors">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Advanced Data Visualization */}
              <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                <div className="lg:col-span-2 glass-panel p-10 rounded-[48px] border-none saas-shadow space-y-8 group">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Genre Distribution</h4>
                      <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Taste distribution across categories</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="h-[280px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={genreData}>
                        <XAxis
                          dataKey="name"
                          stroke="#ffffff20"
                          fontSize={10}
                          fontWeight={900}
                          tickFormatter={(val) => val.toUpperCase()}
                          axisLine={false}
                          tickLine={false}
                        />
                        <RechartsTooltip
                          cursor={{ fill: '#ffffff05' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-card border border-white/10 p-3 rounded-xl shadow-2xl">
                                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                                  <p className="text-white font-black">{payload[0].value} Titles</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#8b5cf6"
                          radius={[8, 8, 8, 8]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-panel p-10 rounded-[48px] border-none saas-shadow space-y-8 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Watchlist Status</h4>
                    <p className="text-white/30 text-xs font-bold uppercase tracking-widest">List decomposition</p>
                  </div>

                  <div className="h-[220px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-white leading-none">{userStats.counts.total}</span>
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Total</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {statusData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Continue Watching */}
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-headline">Continue Watching</h3>
                  </div>
                  <Button variant="ghost" onClick={() => setActiveSection('watchlist')} className="text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:bg-primary/10 rounded-full h-10 px-6">
                    View All <TrendingUp className="ml-2 w-3 h-3" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                  {watchlist.filter(w => w.status === 'WATCHING').slice(0, 6).map((item) => (
                    <Link key={item.id} href={`/watch/${item.id}?ep=${item.progress}`} className="group space-y-4">
                      <div className="relative aspect-[2/3] rounded-[28px] overflow-hidden saas-shadow border-4 border-white/5 transition-all duration-700 group-hover:border-primary/40 group-hover:rounded-2xl group-hover:scale-[1.05]">
                        <Image src={item.poster} alt={item.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_30px_rgba(244,63,94,0.5)] transform transition-transform group-hover:rotate-12">
                            <Play className="w-7 h-7 fill-current ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-primary shadow-[0_0_10px_#8b5cf6]" style={{ width: `${(item.progress / (item.totalEpisodes || 1)) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="px-2">
                        <p className="text-[14px] font-black text-white truncate group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Progress</span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.progress}/{item.totalEpisodes || '??'}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'watchlist' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-headline">My Watchlist</h2>
                </div>
              </div>

              <Tabs defaultValue="WATCHING" className="space-y-12">
                <div className="glass-panel p-2 rounded-3xl border-none saas-shadow inline-block">
                  <TabsList className="bg-transparent h-auto p-0 flex-wrap justify-start gap-1">
                    {[
                      { value: 'WATCHING', icon: Activity, label: 'Watching', color: 'text-primary' },
                      { value: 'COMPLETED', icon: CheckCircle, label: 'Completed', color: 'text-emerald-400' },
                      { value: 'PLAN_TO_WATCH', icon: Clock, label: 'Planned', color: 'text-blue-400' },
                      { value: 'ON_HOLD', icon: Shield, label: 'On Hold', color: 'text-orange-400' },
                      { value: 'DROPPED', icon: X, label: 'Dropped', color: 'text-rose-400' },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="rounded-2xl px-8 py-3 data-[state=active]:bg-white/5 data-[state=active]:text-white transition-all duration-500 group border-none"
                      >
                        <tab.icon className={cn("h-4 w-4 mr-3 group-data-[state=active]:scale-110 group-data-[state=active]:text-primary transition-all", tab.color)} />
                        <span className="font-black text-[11px] uppercase tracking-[0.2em]">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {['WATCHING', 'COMPLETED', 'PLAN_TO_WATCH', 'ON_HOLD', 'DROPPED'].map((status) => {
                  const items = watchlist.filter(w => w.status === status);
                  return (
                    <TabsContent key={status} value={status} className="mt-0 focus-visible:ring-0">
                      {items.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
                          {items.map((item) => (
                            <div key={item.id} className="group relative animate-in fade-in zoom-in-95 duration-500">
                              <div className="relative aspect-[2/3] rounded-[32px] overflow-hidden saas-shadow border-4 border-white/5 mb-4 group-hover:border-primary/40 group-hover:rounded-2xl transition-all duration-700">
                                <Image src={item.poster} alt={item.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />

                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-xl bg-black/60 backdrop-blur-md text-white/40 hover:text-red-400 hover:bg-red-400/20 transition-all"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
                                  <Link href={`/watch/${item.id}`} className="block">
                                    <p className="text-[14px] font-black text-white line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight">{item.name}</p>
                                  </Link>
                                  <div className="space-y-2">
                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                                      <div className="h-full bg-primary shadow-[0_0_10px_#8b5cf6]" style={{ width: `${(item.progress / (item.totalEpisodes || 1)) * 100}%` }} />
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                                      <span>EP {item.progress}/{item.totalEpisodes || '??'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-white/5 border-white/5 hover:bg-primary hover:text-white hover:border-transparent rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] h-10 transition-all"
                                onClick={() => {
                                  const statuses = ['WATCHING', 'COMPLETED', 'PLAN_TO_WATCH', 'ON_HOLD', 'DROPPED'] as const;
                                  const currentIndex = statuses.indexOf(item.status as any);
                                  const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                  updateStatus(item.id, nextStatus);
                                }}
                              >
                                {item.status === 'WATCHING' ? 'Finished Watching' : 'Update Status'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-32 glass-panel rounded-[40px] border-dashed border-white/10 transition-all hover:bg-white/[0.02]">
                          <Database className="h-16 w-16 text-white/10 mb-6 animate-pulse" />
                          <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Watchlist is Empty</h3>
                          <p className="text-white/20 text-[11px] font-bold uppercase tracking-[0.3em] mb-8">No records found in this category</p>
                          <Button className="bg-primary hover:bg-primary/90 text-white font-black rounded-full px-10 h-14 shadow-2xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-xs" asChild>
                            <Link href="/home">Browse Anime</Link>
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          )}

          {activeSection === 'history' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-headline">Watch History</h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={clearHistory}
                  className="text-red-400 hover:bg-red-400/10 rounded-full font-black uppercase tracking-widest text-[10px] h-10 px-6"
                >
                  Clear History
                </Button>
              </div>

              {history.length > 0 ? (
                <div className="space-y-6">
                  {history.map((item, idx) => (
                    <div key={`${item.episodeId}-${idx}`} className="glass-panel p-6 rounded-[32px] border-none saas-shadow flex flex-col md:flex-row items-center gap-8 group hover:bg-white/[0.04] transition-all duration-500">
                      <div className="relative w-full md:w-48 aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-2xl shrink-0">
                        <Image src={item.animePoster} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-primary fill-current" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-2 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                          <div className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Episode {item.episodeNumber}</span>
                          </div>
                          <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                            {item.watchedAt ? formatDistanceToNow(item.watchedAt.toDate ? item.watchedAt.toDate() : new Date(item.watchedAt.seconds * 1000), { addSuffix: true }) : 'Recent'}
                          </span>
                        </div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight truncate">{item.animeName}</h4>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest line-clamp-1">Watched recently</p>
                      </div>

                      <Button className="bg-white/5 hover:bg-primary hover:text-white border border-white/5 hover:border-transparent rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[10px] transition-all group-hover:scale-105" asChild>
                        <Link href={`/watch/${item.animeId}?ep=${item.episodeId}`}>Continue Watching</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 glass-panel rounded-[40px] border-dashed border-white/10">
                  <History className="h-16 w-16 text-white/10 mb-6 animate-pulse" />
                  <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">No History</h3>
                  <p className="text-white/20 text-[11px] font-bold uppercase tracking-[0.3em] mb-8">Your watch history is empty</p>
                  <Button className="bg-primary hover:bg-primary/90 text-white font-black rounded-full px-10 h-14 shadow-2xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-xs" asChild>
                    <Link href="/home">Start Watching</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter font-headline">Account Settings</h2>
              </div>

              <Tabs defaultValue="profile" className="space-y-12">
                <div className="glass-panel p-2 rounded-3xl border-none saas-shadow inline-block">
                  <TabsList className="bg-transparent h-auto p-0 flex-wrap justify-start gap-1">
                    {[
                      { value: 'profile', icon: User, label: 'Profile' },
                      { value: 'security', icon: Shield, label: 'Security' },
                      { value: 'notifications', icon: Bell, label: 'Alerts' },
                      { value: 'danger', icon: AlertTriangle, label: 'Danger Zone', color: 'text-red-400' },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="rounded-2xl px-8 py-3 data-[state=active]:bg-white/5 data-[state=active]:text-white transition-all duration-500 group border-none"
                      >
                        <tab.icon className={cn("h-4 w-4 mr-3 group-data-[state=active]:text-primary transition-all", tab.color)} />
                        <span className="font-black text-[11px] uppercase tracking-[0.2em]">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value="profile" className="animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="max-w-4xl space-y-8">
                    <ProfileSettings />
                  </div>
                </TabsContent>

                <TabsContent value="security" className="animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="max-w-4xl space-y-8">
                    <SecuritySettings />
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="max-w-4xl space-y-8">
                    <NotificationSettings />
                  </div>
                </TabsContent>

                <TabsContent value="danger" className="animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="max-w-4xl space-y-8">
                    <DangerZone />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
}
