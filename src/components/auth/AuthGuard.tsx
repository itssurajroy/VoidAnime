'use client';

import React from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Loader2, User } from 'lucide-react';
import { SectionTitle } from '../shared/SectionTitle';
import { AuthTrigger } from './AuthTrigger';
import { Button } from '../ui/button';

export function AuthGuard({ children }: { children?: React.ReactNode }) {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="container py-8 px-4 text-center h-96 flex items-center justify-center">
        <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8 px-4 text-center">
        <div className="max-w-md mx-auto">
            <User className="w-24 h-24 mx-auto text-muted-foreground/50 mb-4" />
            <SectionTitle className="justify-center">Please Log In</SectionTitle>
            <p className="text-muted-foreground mb-6">You need to be logged in to view this page.</p>
            <div className="flex gap-4 justify-center">
                <AuthTrigger mode="login"><Button variant="outline" size="lg">Login</Button></AuthTrigger>
                <AuthTrigger mode="signup"><Button size="lg">Sign Up</Button></AuthTrigger>
            </div>
        </div>
      </div>
    );
  }

  if (!children) {
    return null;
  }

  return <>{children}</>;
}
