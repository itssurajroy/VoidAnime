'use client';

import { useState } from 'react';
import { useUser, useAuth } from '@/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Key, Monitor, Shield, ShieldX } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SecuritySettings() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !auth) return;

    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'New passwords do not match.',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Password must be at least 6 characters.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email || '', currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      toast({
        title: 'Success',
        description: 'Your password has been changed.',
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      let message = 'Failed to change password';
      if (error.code === 'auth/wrong-password') {
        message = 'Current password is incorrect';
      } else if (error.message) {
        message = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutEverywhere = async () => {
    if (!auth) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/user/settings/sessions', {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to revoke sessions');
      }

      await signOut(auth);
      router.push('/');
      
      toast({
        title: 'Signed Out',
        description: 'You have been signed out from all devices.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to sign out from all devices.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="glass-panel rounded-[40px] border-none saas-shadow overflow-hidden group transition-all hover:bg-white/[0.02]">
        <CardHeader className="bg-white/5 px-10 py-8 border-b border-white/5">
          <CardTitle className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <Key className="w-6 h-6 text-primary" />
            Security Access
          </CardTitle>
          <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Manage your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handlePasswordChange} className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="currentPassword" title="Enter current password" className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-14 bg-white/5 border-white/5 rounded-2xl text-white font-bold focus:border-primary/50 transition-all pr-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <ShieldX className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="newPassword" title="Enter new password" className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-14 bg-white/5 border-white/5 rounded-2xl text-white font-bold focus:border-primary/50 transition-all pr-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <ShieldX className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="confirmPassword" title="Confirm new password" className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-14 bg-white/5 border-white/5 rounded-2xl text-white font-bold focus:border-primary/50 transition-all pr-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <ShieldX className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={isLoading || !currentPassword || !newPassword || !confirmPassword} className="bg-primary hover:bg-primary/90 text-black font-black px-10 h-14 rounded-full shadow-2xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-xs">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass-panel rounded-[40px] border-none saas-shadow overflow-hidden group">
          <CardHeader className="bg-white/5 px-10 py-8 border-b border-white/5">
            <CardTitle className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <Monitor className="w-6 h-6 text-blue-400" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-6">
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/[0.08] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                   <Monitor className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-white uppercase tracking-tight text-sm">This Device</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-black">Authorized Device</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-400/10 px-3 py-1 rounded-lg border border-green-400/20">Active</span>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-2xl border-red-500/20 text-red-400/60 hover:bg-red-500 hover:text-white transition-all uppercase font-black text-[10px] tracking-[0.2em]"
              onClick={handleLogoutEverywhere}
              disabled={isLoading}
            >
              Sign Out from All Other Devices
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
