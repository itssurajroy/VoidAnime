'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Loader2 } from 'lucide-react';

interface AdminAuthGuardProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export function AdminAuthGuard({ children, allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST'] }: AdminAuthGuardProps) {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/?adminlogin=true');
    }
  }, [loading, user, router]);

  if (!React.isValidElement(children)) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!children) {
    return null;
  }

  return <>{children}</>;
}
