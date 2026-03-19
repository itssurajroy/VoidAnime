'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useWatchlist } from '@/hooks/use-supabase-watchlist';
import { useWatchHistory } from '@/hooks/use-supabase-watch-history';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { DangerZone } from '@/components/settings/DangerZone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Play, History, Shield } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { RankBadge } from '@/components/profile/RankBadge';

type Section = 'dashboard' | 'watchlist' | 'history' | 'settings';

export default function AccountPage() {
  const { user, loading: authLoading } = useSupabaseAuth();
  const searchParams = useSearchParams();
  const { watchlist } = useWatchlist();
  const { history } = useWatchHistory();

  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  useEffect(() => {
    const section = searchParams.get('section') as Section;
    if (section && ['dashboard', 'watchlist', 'history', 'settings'].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/40">Please log in to view your account.</p>
      </div>
    );
  }

  const xp = watchlist.length * 10;
  const level = Math.floor(xp / 100) + 1;
  const rank = level >= 50 ? 'GOD' : level >= 40 ? 'LEGEND' : level >= 30 ? 'MASTER' : level >= 20 ? 'ELITE' : level >= 10 ? 'PRO' : 'NOVICE';
  const rankColor = level >= 50 ? 'bg-yellow-400' : level >= 40 ? 'bg-purple-400' : level >= 30 ? 'bg-red-400' : level >= 20 ? 'bg-blue-400' : level >= 10 ? 'bg-green-400' : 'bg-gray-400';

  return (
    <div className="min-h-screen bg-background">
      <div className="h-48 bg-gradient-to-r from-primary/20 to-background" />
      <div className="container max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 shrink-0 space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-background">
                    <AvatarImage src={user.user_metadata?.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl">{user.user_metadata?.username?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mt-4">{user.user_metadata?.username || 'User'}</h2>
                  <p className="text-sm text-white/40">{user.email}</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <RankBadge rank={rank} className={cn("w-5 h-5", rankColor)} />
                    <span className="text-primary font-bold">Level {level}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveSection('dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveSection('watchlist')}>
                  <Play className="w-4 h-4 mr-2" /> Watchlist
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveSection('history')}>
                  <History className="w-4 h-4 mr-2" /> History
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveSection('settings')}>
                  <Shield className="w-4 h-4 mr-2" /> Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 space-y-4">
            {activeSection === 'dashboard' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-4">
                    <p className="text-white/40 text-sm">Watching</p>
                    <p className="text-2xl font-bold">{watchlist.filter(w => w.status === 'WATCHING').length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-4">
                    <p className="text-white/40 text-sm">Completed</p>
                    <p className="text-2xl font-bold">{watchlist.filter(w => w.status === 'COMPLETED').length}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-4">
                    <p className="text-white/40 text-sm">XP</p>
                    <p className="text-2xl font-bold">{xp}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="pt-4">
                    <p className="text-white/40 text-sm">Rank</p>
                    <p className="text-2xl font-bold">{rank}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'watchlist' && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Your Watchlist</CardTitle>
                </CardHeader>
                <CardContent>
                  {watchlist.length === 0 ? (
                    <p className="text-white/40">No items in watchlist</p>
                  ) : (
                    <div className="space-y-2">
                      {watchlist.slice(0, 20).map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-2 bg-white/5 rounded">
                          <p className="font-medium truncate flex-1">{item.anime_title}</p>
                          <span className="text-sm text-white/40">{item.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'history' && (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle>Watch History</CardTitle>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <p className="text-white/40">No watch history</p>
                  ) : (
                    <div className="space-y-2">
                      {history.slice(0, 20).map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-2 bg-white/5 rounded">
                          <p className="font-medium truncate flex-1">{item.anime_title}</p>
                          <span className="text-sm text-white/40">Ep {item.episode_number}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'settings' && (
              <div className="space-y-6">
                <SecuritySettings />
                <DangerZone />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
