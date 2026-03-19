'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { createBrowserClient } from '@supabase/ssr';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Camera } from 'lucide-react';

export function ProfileSettings() {
  const { user } = useSupabaseAuth();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.username || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.user_metadata?.username) {
      setDisplayName(user.user_metadata.username);
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'File size must be less than 2MB',
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      toast({
        title: 'Success',
        description: 'Your avatar has been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload avatar',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: displayName }
      });
      
      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-panel rounded-[40px] border-none saas-shadow overflow-hidden group transition-all hover:bg-white/[0.02]">
      <CardHeader className="bg-white/5 px-10 py-8 border-b border-white/5">
        <CardTitle className="text-xl font-black text-white uppercase tracking-wider">Profile Identity</CardTitle>
        <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Manage your public presence on VoidAnime</CardDescription>
      </CardHeader>
      <CardContent className="p-10 space-y-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group/avatar">
            <div className="h-32 w-32 rounded-[40px] bg-white/5 flex items-center justify-center overflow-hidden ring-4 ring-primary/20 transition-all duration-700 group-hover/avatar:ring-primary/50 group-hover/avatar:rounded-[32px]">
              {user?.user_metadata?.avatar_url ? (
                <Image 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  fill
                  className="object-cover transition-transform duration-1000 group-hover/avatar:scale-110"
                />
              ) : (
                <span className="text-4xl font-black text-primary">
                  {displayName?.charAt(0) || 'U'}
                </span>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
            <Button 
              size="icon" 
              className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-primary hover:bg-primary/90 text-black shadow-2xl transition-all hover:scale-110 active:scale-90"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Camera className="h-5 w-5" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Profile Avatar</h3>
            <p className="text-white/30 text-xs font-medium max-w-[240px]">Customize your visual representation. Max file size: 2MB.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Registered Email</Label>
              <Input 
                id="email" 
                value={user?.email || ''} 
                disabled 
                className="h-14 bg-white/5 border-white/5 rounded-2xl text-white/40 font-bold opacity-50 cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2.5">
              <Label htmlFor="displayName" className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="h-14 bg-white/5 border-white/5 rounded-2xl text-white font-bold focus:border-primary/50 transition-all placeholder:text-white/10"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-black font-black px-10 h-14 rounded-full shadow-2xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-xs">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
