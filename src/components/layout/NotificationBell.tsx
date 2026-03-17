'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Clock, Play, MessageSquare, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/use-notifications';
import { markAsRead, markAllAsRead, deleteNotification } from '@/actions/notifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'NEW_EPISODE': return <Play className="w-4 h-4 text-primary" />;
    case 'COMMENT_REPLY': return <MessageSquare className="w-4 h-4 text-blue-400" />;
    case 'COMMENT_LIKE': return <Heart className="w-4 h-4 text-red-400" />;
    case 'PROFILE_VISIT': return <User className="w-4 h-4 text-emerald-400" />;
    default: return <Bell className="w-4 h-4 text-gray-400" />;
  }
};

export function NotificationBell() {
  const { user } = useUser();
  const { notifications, unreadCount, loading } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    await markAllAsRead(user.uid);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    await deleteNotification(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/5 rounded-sm group transition-all h-10 w-10">
          <Bell className="w-6 h-6 text-white/80 group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] bg-[#1a1b1e] border-white/10 rounded-sm p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Notifications</span>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="h-7 px-3 text-[9px] font-black text-primary hover:text-primary/80 hover:bg-primary/5 rounded-sm uppercase tracking-widest"
              >
                <CheckCheck className="w-3 h-3 mr-1.5" />
                Mark all as read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5 mx-2" />
        <div className="max-h-[450px] overflow-y-auto custom-scrollbar p-1">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-10 h-10 text-white/5 mx-auto mb-4" />
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                asChild
                className={cn(
                  "relative flex gap-4 p-4 rounded-sm mb-1 cursor-pointer transition-all border border-transparent focus:bg-white/5",
                  notification.isRead ? "opacity-60 grayscale-[0.5]" : "bg-white/[0.03] border-white/5"
                )}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <Link href={notification.link || '#'}>
                  <div className="relative shrink-0">
                    <Avatar className="w-10 h-10 rounded-sm border border-white/5">
                      <AvatarImage src={notification.senderAvatar || ''} />
                      <AvatarFallback className="bg-white/5 text-[10px] font-black uppercase text-white/40">
                        {notification.senderName?.charAt(0) || 'V'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1a1b1e] rounded-full border border-white/5 flex items-center justify-center">
                      <NotificationIcon type={notification.type} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] font-bold text-white leading-tight uppercase tracking-tight truncate">
                        {notification.title}
                      </p>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest tabular-nums whitespace-nowrap pt-0.5">
                        {mounted ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : '...'}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed">
                      {notification.content}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, notification.id)}
                    className="absolute right-2 bottom-2 p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all rounded-sm hover:bg-red-400/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator className="bg-white/5 mx-2" />
        <div className="p-2">
           <Link href="/notifications" className="w-full">
             <Button variant="ghost" className="w-full text-[10px] font-black text-white/30 hover:text-primary uppercase tracking-[0.2em] rounded-sm h-10">
                View All Activity
             </Button>
           </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
