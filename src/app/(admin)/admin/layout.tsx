'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/layout/Sidebar";
import { AdminHeader } from "@/components/admin/layout/Header";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { AuthTrigger } from '@/components/auth/AuthTrigger';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/types/db';
import { Button } from '@/components/ui/button';

function AdminAuthContent({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useSupabaseAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('USER');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        if (searchParams.get('adminlogin') === 'true') {
          setShowAuthDialog(true);
        } else {
          router.push('/?adminlogin=true');
        }
        setIsLoading(false);
      } else {
        checkUserRole();
      }
    }
  }, [authLoading, user, searchParams, router]);

  const checkUserRole = async () => {
    try {
      const res = await fetch('/api/user/role');
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.role || 'USER');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST'].includes(userRole as any);

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      router.push('/');
    }
  }, [isLoading, user, isAdmin, router]);

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <SidebarProvider>
        <AdminSidebar userRole={userRole as UserRole} />
        <SidebarInset>
          <AdminHeader user={{
            name: user.user_metadata?.username || user.email?.split('@')[0] || 'Admin',
            email: user.email || '',
            avatarUrl: user.user_metadata?.avatar_url || undefined,
            role: userRole as UserRole,
          }} />
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      {showAuthDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg">
            <p className="mb-4">Please log in to access admin features.</p>
            <AuthTrigger mode="login">
              <Button>Login</Button>
            </AuthTrigger>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminAuthLoading />}>
      <AdminAuthContent>{children}</AdminAuthContent>
    </Suspense>
  );
}
