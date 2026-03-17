'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

interface AdminAuthGuardProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export function AdminAuthGuard({ children, allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST'] }: AdminAuthGuardProps) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/?adminlogin=true');
    }
  }, [isUserLoading, user, router]);

  if (!React.isValidElement(children)) {
    return null;
  }

  if (isUserLoading) {
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
