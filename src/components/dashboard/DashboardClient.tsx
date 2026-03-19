'use client';

import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useWatchlist } from '@/hooks/use-supabase-watchlist';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Heart, 
  Clock, 
  CheckCircle, 
  Calendar,
  Settings,
  User,
  Film,
  TrendingUp,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function DashboardClient() {
  const { user } = useSupabaseAuth();
  const { watchlist } = useWatchlist();

  const stats = {
    watching: watchlist.filter(w => w.status === 'WATCHING').length,
    completed: watchlist.filter(w => w.status === 'COMPLETED').length,
    planToWatch: watchlist.filter(w => w.status === 'PLAN_TO_WATCH').length,
    onHold: watchlist.filter(w => w.status === 'ON_HOLD').length,
    dropped: watchlist.filter(w => w.status === 'DROPPED').length,
  };

  const continueWatching = watchlist
    .filter(w => w.status === 'WATCHING' && w.progress > 0)
    .slice(0, 5);

  const totalWatched = watchlist.reduce((acc, w) => acc + w.progress, 0);
  const totalEpisodes = watchlist.reduce((acc, w) => acc + w.total_episodes, 0);
  const watchProgress = totalEpisodes > 0 ? Math.round((totalWatched / totalEpisodes) * 100) : 0;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <SectionTitle>
            Welcome back, {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Anime Fan'}!
          </SectionTitle>
          <p className="text-muted-foreground mt-1">
            Continue your anime journey
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/watchlist">
              <Heart className="mr-2 h-4 w-4" />
              My List
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Watching</p>
                <p className="text-3xl font-bold">{stats.watching}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Plan to Watch</p>
                <p className="text-3xl font-bold">{stats.planToWatch}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Episodes Watched</p>
                <p className="text-3xl font-bold">{totalWatched}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Film className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {continueWatching.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Continue Watching
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {continueWatching.map((item) => (
                    <Link key={item.id} href={`/anime/${item.anime_id}`} className="group">
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                        <Image
                          src={item.anime_poster || ""}
                          alt={item.anime_title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-sm font-medium line-clamp-1">{item.anime_title}</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(item.progress / item.total_episodes) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Episode {item.progress + 1}</span>
                        <span>{Math.round((item.progress / item.total_episodes) * 100)}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Watch Progress
              </CardTitle>
              <CardDescription>Your anime journey at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="text-muted-foreground">{watchProgress}%</span>
                </div>
                <Progress value={watchProgress} className="h-2" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.watching}</p>
                  <p className="text-xs text-muted-foreground">Watching</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.planToWatch}</p>
                  <p className="text-xs text-muted-foreground">Planned</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.onHold}</p>
                  <p className="text-xs text-muted-foreground">On Hold</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.dropped}</p>
                  <p className="text-xs text-muted-foreground">Dropped</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.user_metadata?.avatar_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {user?.user_metadata?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.user_metadata?.username || 'User'}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">
                    <Eye className="mr-1 h-3 w-3" />
                    Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="mr-1 h-3 w-3" />
                    Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/watchlist">
                  <Heart className="mr-2 h-4 w-4" />
                  My Watchlist
                  <span className="ml-auto text-muted-foreground">{watchlist.length}</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/home">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Browse Anime
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Anime</span>
                <span className="font-medium">{watchlist.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Episodes Watched</span>
                <span className="font-medium">{totalWatched}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{stats.completed > 0 ? Math.round((stats.completed / watchlist.length) * 100) : 0}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
