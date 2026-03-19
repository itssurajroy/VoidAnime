'use client';

import { useMemo, useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Shield, Trophy } from 'lucide-react';
import Link from 'next/link';
import { getXpForNextLevel } from '@/types/gamification';
import { Progress } from '@/components/ui/progress';
import { useWatchlist } from '@/hooks/use-supabase-watchlist';
import { RankBadge } from '../profile/RankBadge';
import { cn } from '@/lib/utils';

export function UserNav() {
  const { user, signOut } = useSupabaseAuth();
  const [userRole, setUserRole] = useState<string>('USER');
  const { watchlist } = useWatchlist();
  
  const xp = watchlist.length * 10;
  const level = Math.floor(xp / 100) + 1;
  const { currentLevelXp, nextLevelXp, progress } = getXpForNextLevel(xp);
  const rank = level >= 50 ? 'GOD' : level >= 40 ? 'LEGEND' : level >= 30 ? 'MASTER' : level >= 20 ? 'ELITE' : level >= 10 ? 'PRO' : 'NOVICE';
  const rankColor = level >= 50 ? 'bg-yellow-400' : level >= 40 ? 'bg-purple-400' : level >= 30 ? 'bg-red-400' : level >= 20 ? 'bg-blue-400' : level >= 10 ? 'bg-green-400' : 'bg-gray-400';

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      try {
        const res = await fetch('/api/user/role');
        if (res.ok) {
          const data = await res.json();
          setUserRole(data.role || 'USER');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) return null;

  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST'].includes(userRole);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full ring-2 ring-transparent opacity-90 hover:opacity-100 hover:ring-primary/50 transition-all p-0">
          <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-white/10">
            <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={user.user_metadata?.username || user.email || ''} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">{user.user_metadata?.username?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1.5 -right-1.5 bg-[#0B0C10] border border-white/10 rounded-full px-1.5 py-0.5 shadow-lg flex items-center justify-center gap-1">
            <RankBadge rank={rank} className={cn("w-2 h-2", rankColor)} />
            <span className="text-[9px] font-black text-primary leading-none">Lvl {level}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#0B0C10] border-white/10 rounded-2xl p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold text-white">{user.user_metadata?.username || 'User'}</p>
            <p className="text-xs text-white/40">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        
        {/* XP Progress */}
        <div className="px-2 py-2 space-y-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-white/40 font-medium">XP Progress</span>
            <span className="text-primary font-bold">{xp} / {nextLevelXp}</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-white/10" />
          <div className="flex justify-between text-[9px]">
            <span className="text-white/30">Level {level}</span>
            <span className="text-white/30">Level {level + 1}</span>
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-white/10" />
        
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem className="focus:bg-white/5 focus:text-white text-white/70 cursor-pointer">
              <Trophy className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile">
            <DropdownMenuItem className="focus:bg-white/5 focus:text-white text-white/70 cursor-pointer">
              <Trophy className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/watchlist">
            <DropdownMenuItem className="focus:bg-white/5 focus:text-white text-white/70 cursor-pointer">
              <Trophy className="mr-2 h-4 w-4" />
              <span>Watchlist</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem className="focus:bg-white/5 focus:text-white text-white/70 cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <DropdownMenuItem className="focus:bg-white/5 focus:text-white text-white/70 cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          className="focus:bg-red-500/10 focus:text-red-400 text-white/70 cursor-pointer"
          onClick={handleSignOut}
        >
          <Shield className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
