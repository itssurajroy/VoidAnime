'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase as _supabase } from '@/lib/supabase';
import { Notification } from '@/types/db';

const supabase = _supabase!;

export function useNotifications(max: number = 20) {
  const { user } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(max);

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        const mappedData = (data || []).map(n => ({
          id: n.id,
          recipientId: n.user_id,
          type: n.type,
          title: n.title,
          content: n.message || '',
          link: n.data?.link || null,
          isRead: n.is_read,
          createdAt: new Date(n.created_at),
          senderName: n.data?.senderName,
          senderAvatar: n.data?.senderAvatar,
        })) as Notification[];
        setNotifications(mappedData);
        setUnreadCount(mappedData.filter(n => !n.isRead).length);
      }
      setLoading(false);
    };

    fetchNotifications();

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, max]);

  return { notifications, unreadCount, loading };
}
