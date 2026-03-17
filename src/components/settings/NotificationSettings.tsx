'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, Bell, Mail, Save, MessageSquare, UserCheck, PlayCircle } from 'lucide-react';

export function NotificationSettings() {
  const { toast } = useToast();
  const { profile, updateNotifications } = useUserProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(profile.notifications);

  useEffect(() => {
    setSettings(profile.notifications);
  }, [profile.notifications]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateNotifications(settings);
      
      toast({
        title: 'Success',
        description: 'Your notification preferences have been saved.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save preferences.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-panel rounded-[40px] border-none saas-shadow overflow-hidden group transition-all hover:bg-white/[0.02]">
      <CardHeader className="bg-white/5 px-10 py-8 border-b border-white/5">
        <CardTitle className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          Alert Configuration
        </CardTitle>
        <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Choose how you want to be notified about community activity</CardDescription>
      </CardHeader>
      <CardContent className="p-10 space-y-12">
        <div className="space-y-8">
          <h3 className="text-sm font-black flex items-center gap-3 text-white/40 uppercase tracking-[0.2em] mb-6">
            <Mail className="w-4 h-4 text-primary" />
            Email Notifications
          </h3>
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-all">
              <div className="space-y-1">
                <Label className="text-base font-bold text-white uppercase tracking-tight">New Episode Releases</Label>
                <p className="text-xs text-white/30 uppercase tracking-widest font-medium">
                  Notify when shows in your watchlist update
                </p>
              </div>
              <Switch
                checked={settings.emailNewEpisodes}
                onCheckedChange={() => handleToggle('emailNewEpisodes')}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-all">
              <div className="space-y-1">
                <Label className="text-base font-bold text-white uppercase tracking-tight">New Comments</Label>
                <p className="text-xs text-white/30 uppercase tracking-widest font-medium">
                  Notify when someone comments on your profile or posts
                </p>
              </div>
              <Switch
                checked={settings.emailNewComments}
                onCheckedChange={() => handleToggle('emailNewComments')}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-sm font-black flex items-center gap-3 text-white/40 uppercase tracking-[0.2em] mb-6">
            <Bell className="w-4 h-4 text-blue-400" />
            Push Notifications
          </h3>
          <div className="grid gap-6">
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-all">
              <div className="space-y-1 flex items-center gap-4">
                <PlayCircle className="w-5 h-5 text-white/20" />
                <div>
                  <Label className="text-base font-bold text-white uppercase tracking-tight">Real-time Episodes</Label>
                  <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Instant push alerts for new releases</p>
                </div>
              </div>
              <Switch
                checked={settings.pushNewEpisodes}
                onCheckedChange={() => handleToggle('pushNewEpisodes')}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-all">
              <div className="space-y-1 flex items-center gap-4">
                <MessageSquare className="w-5 h-5 text-white/20" />
                <div>
                  <Label className="text-base font-bold text-white uppercase tracking-tight">Direct Replies</Label>
                  <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Mentions, likes, and replies to comments</p>
                </div>
              </div>
              <Switch
                checked={settings.pushReplies}
                onCheckedChange={() => handleToggle('pushReplies')}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-all">
              <div className="space-y-1 flex items-center gap-4">
                <UserCheck className="w-5 h-5 text-white/20" />
                <div>
                  <Label className="text-base font-bold text-white uppercase tracking-tight">Profile Interactions</Label>
                  <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Notify on profile visits and interactions</p>
                </div>
              </div>
              <Switch
                checked={settings.profileInteractions}
                onCheckedChange={() => handleToggle('profileInteractions')}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-black font-black px-10 h-14 rounded-full shadow-2xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-xs">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
