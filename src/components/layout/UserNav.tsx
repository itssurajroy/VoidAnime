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
import { useUser, useAuth, useFirestore } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Shield, Trophy } from 'lucide-react';
import Link from 'next/link';
import { getXpForNextLevel } from '@/types/gamification';
import { Progress } from '@/components/ui/progress';
import { useUserStats } from '@/hooks/use-user-stats';
import { useWatchlist } from '@/hooks/use-watchlist';
import { RankBadge } from '../profile/RankBadge';
import { cn } from '@/lib/utils';

export function UserNav() {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [userRole, setUserRole] = useState<string>('USER');
  const { watchlist } = useWatchlist();
  const { rank, rankColor, level: statsLevel } = useUserStats(watchlist);

  // Document reference for useDoc - MUST BE MEMOIZED
  const userDocRef = useMemo(() => {
    return firestore && user?.uid ? doc(firestore, 'users', user.uid) : null;
  }, [firestore, user?.uid]);

  // Fetch full user document from Firestore
  const { data: userDoc, isLoading: isUserDocLoading } = useDoc(userDocRef);

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
    if (auth) await signOut(auth);
  };

  if (!user) return null;

  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST'].includes(userRole);

  // Gamification Data
  const xp = userDoc?.xp || 0;
  const level = userDoc?.level || statsLevel || 1;
  const { currentLevelXp, nextLevelXp, progress } = getXpForNextLevel(xp);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full ring-2 ring-transparent opacity-90 hover:opacity-100 hover:ring-primary/50 transition-all p-0">
          <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-white/10">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email || ''} />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          {!isUserDocLoading && (
            <div className="absolute -bottom-1.5 -right-1.5 bg-[#0B0C10] border border-white/10 rounded-full px-1.5 py-0.5 shadow-lg flex items-center justify-center gap-1">
              <RankBadge rank={rank} className={cn("w-2 h-2", rankColor)} />
              <span className="text-[9px] font-black text-primary leading-none">Lvl {level}</span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mt-2 bg-[#1a1b1e] border-white/10 shadow-2xl p-1" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-white leading-none truncate">{user.displayName || 'User'}</p>
                <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/5", rankColor)}>
                  <RankBadge rank={rank} className="w-2.5 h-2.5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">{rank}</span>
                </div>
              </div>
              <p className="text-xs leading-none text-white/40 truncate">
                {user.email}
              </p>
            </div>

            {/* Gamification Progress */}
            {!isUserDocLoading && (
              <div className="space-y-1.5 bg-black/20 p-2.5 rounded-lg border border-white/5">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="text-primary flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Level {level}
                  </span>
                  <span className="text-white/40">{currentLevelXp} / {nextLevelXp} XP</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-white/10 shadow-inner" indicatorClassName="bg-primary shadow-[0_0_10px_rgba(147,51,234,0.3)]" />
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer py-2.5 text-xs font-medium text-white/70 rounded-sm">
            <Link href="/account" className="flex items-center">
              Account Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer py-2.5 text-xs font-medium text-white/70 rounded-sm">
            <Link href="/watchlist">Watchlist</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer py-2.5 text-xs font-medium text-white/70 rounded-sm">
            <Link href="/leaderboard" className="flex items-center text-primary/80 hover:text-primary transition-colors">
              <Trophy className="mr-2.5 h-3.5 w-3.5" />
              Leaderboard
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer py-2.5 text-xs font-medium text-white/70 rounded-sm">
                <Link href="/admin" className="flex items-center text-primary font-bold">
                  <Shield className="mr-2.5 h-3.5 w-3.5" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem onClick={handleSignOut} className="focus:bg-red-500/10 focus:text-red-500 cursor-pointer py-3 text-xs font-black uppercase tracking-widest text-red-400 rounded-sm">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
