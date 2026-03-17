'use client';

import React from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import { markAsRead, markAllAsRead, deleteNotification } from '@/actions/notifications';
import { Bell, Trash2, CheckCheck, Play, MessageSquare, Heart, User, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'NEW_EPISODE': return <Play className="w-5 h-5 text-primary" />;
    case 'COMMENT_REPLY': return <MessageSquare className="w-5 h-5 text-blue-400" />;
    case 'COMMENT_LIKE': return <Heart className="w-5 h-5 text-red-400" />;
    case 'PROFILE_VISIT': return <User className="w-5 h-5 text-emerald-400" />;
    default: return <Bell className="w-5 h-5 text-gray-400" />;
  }
};

export default function NotificationsPage() {
    const { user } = useUser();
    const { notifications, unreadCount, loading } = useNotifications(100);

    const handleMarkAllAsRead = async () => {
        if (!user) return;
        await markAllAsRead(user.uid);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                    <Shield className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-4">Access Denied</h2>
                <p className="text-white/40 max-w-xs mb-10">Sign in to your account to view your notifications and community activity.</p>
                <Link href="/welcome" className="px-10 py-4 bg-primary text-black font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Login / Sign Up
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-32 pt-10 md:pt-20">
            <div className="container max-w-4xl mx-auto px-4 space-y-12">
                
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Activity Stream</h1>
                        </div>
                        <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.4em] ml-1">
                            {unreadCount} Unread notifications
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                            className="rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-11 px-6 transition-all"
                        >
                            <CheckCheck className="w-4 h-4 mr-2" /> Mark All Read
                        </Button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="grid gap-4">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-32 bg-white/[0.02] border border-white/5 rounded-[32px] animate-pulse" />
                        ))
                    ) : notifications.length === 0 ? (
                        <div className="bg-white/[0.02] border border-white/5 border-dashed rounded-[40px] py-32 text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto opacity-20">
                                <Bell className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-white/40 text-lg font-black uppercase tracking-widest">No new notifications</p>
                                <p className="text-white/10 text-sm font-medium italic">No recent activity detected on your profile.</p>
                            </div>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div 
                                key={notification.id}
                                className={cn(
                                    "group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-primary/20 rounded-[32px] p-6 md:p-8 transition-all duration-500 saas-shadow",
                                    !notification.isRead && "bg-white/[0.05] border-primary/10 shadow-[0_10px_40px_rgba(244,63,94,0.05)]"
                                )}
                            >
                                <div className="flex gap-6">
                                    <div className="relative shrink-0">
                                        <Avatar className="w-16 h-16 rounded-[24px] border-2 border-white/5 shadow-2xl transition-transform group-hover:scale-105">
                                            <AvatarImage src={notification.senderAvatar || ''} />
                                            <AvatarFallback className="bg-white/5 text-white/20 font-black text-xl">
                                                {notification.senderName?.charAt(0) || 'V'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-background rounded-full border-2 border-white/5 flex items-center justify-center shadow-lg">
                                            <NotificationIcon type={notification.type} />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                                                    {notification.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </span>
                                                    {!notification.isRead && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.isRead && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="w-10 h-10 rounded-xl hover:bg-primary/10 hover:text-primary"
                                                        title="Mark as read"
                                                    >
                                                        <CheckCheck className="w-5 h-5" />
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="w-10 h-10 rounded-xl hover:bg-red-500/10 hover:text-red-400"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <p className="text-white/50 text-[15px] leading-relaxed font-medium">
                                            {notification.content}
                                        </p>

                                        {notification.link && (
                                            <div className="pt-2">
                                                <Link href={notification.link}>
                                                    <Button variant="ghost" className="h-9 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all">
                                                        Interact
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
