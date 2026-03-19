'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from "@supabase/ssr";
import { Bell, Trash2, CheckCheck, Play, MessageSquare, Heart, User, Clock, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

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
    const { user, loading: authLoading } = useSupabaseAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(100);

            if (!error && data) {
                setNotifications(data);
            }
            setLoading(false);
        };

        fetchNotifications();
    }, [user]);

    const handleMarkAllAsRead = async () => {
        if (!user) return;
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
        
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

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

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="min-h-screen bg-background pb-32 pt-10 md:pt-20">
            <div className="container max-w-4xl mx-auto px-4 space-y-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-wider">Notifications</h1>
                        <p className="text-white/40 text-sm mt-1">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="text-center py-20">
                        <Bell className="w-16 h-16 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 font-medium">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-xl border transition-colors",
                                    notification.is_read 
                                        ? "bg-white/5 border-white/5" 
                                        : "bg-white/10 border-white/10"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <NotificationIcon type={notification.type} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn("font-medium", notification.is_read ? "text-white/60" : "text-white")}>
                                        {notification.title}
                                    </p>
                                    {notification.message && (
                                        <p className="text-sm text-white/40 mt-1 line-clamp-2">{notification.message}</p>
                                    )}
                                    <p className="text-xs text-white/30 mt-2">
                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                                {!notification.is_read && (
                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
