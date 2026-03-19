'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase as _supabase } from '@/lib/supabase';

const supabase = _supabase!;

export function useUserRole() {
  const { user } = useSupabaseAuth();
  const [userRole, setUserRole] = useState<string>('USER');
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserRole = async () => {
      if (!user) {
        if (isMounted) {
          setUserRole('USER');
          setIsLoadingRole(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!error && data && isMounted) {
          setUserRole(data.role || 'USER');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        if (isMounted) setIsLoadingRole(false);
      }
    };

    fetchUserRole();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST'].includes(userRole);
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return { userRole, isAdmin, isSuperAdmin, isLoadingRole };
}
