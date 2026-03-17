'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';

export function useUserRole() {
  const { user } = useUser();
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
        const res = await fetch('/api/user/role');
        if (res.ok && isMounted) {
          const data = await res.json();
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
