'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, LogOut, Trash2, Download, AlertTriangle } from 'lucide-react';

export function DangerZone() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') return;

    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/settings/account', {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete account');
      }

      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });

      if (auth) {
        await signOut(auth);
      }
      router.push('/');
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/user/export', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to export data');
      }

      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${user?.email || 'export'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Your data has been exported.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to export data.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-10">
      <Card className="glass-panel rounded-[40px] border-none saas-shadow overflow-hidden group">
        <CardHeader className="bg-yellow-500/5 px-10 py-8 border-b border-yellow-500/10">
          <CardTitle className="text-xl font-black text-yellow-500 uppercase tracking-wider flex items-center gap-3">
            <LogOut className="w-6 h-6" />
            Active Session
          </CardTitle>
          <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Disconnect your account from this device</CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <Button variant="outline" onClick={handleLogout} className="h-12 rounded-2xl border-yellow-500/20 text-yellow-500/60 hover:bg-yellow-500 hover:text-black transition-all px-8 uppercase font-black text-[10px] tracking-[0.2em]">
            Sign Out from This Device
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-panel rounded-[40px] border-none saas-shadow overflow-hidden group">
        <CardHeader className="bg-blue-500/5 px-10 py-8 border-b border-blue-500/10">
          <CardTitle className="text-xl font-black text-blue-400 uppercase tracking-wider flex items-center gap-3">
            <Download className="w-6 h-6" />
            Data Export
          </CardTitle>
          <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">Download a local backup of your account data</CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <Button variant="outline" onClick={handleExportData} disabled={isExporting} className="h-12 rounded-2xl border-blue-500/20 text-blue-400/60 hover:bg-blue-500 hover:text-black transition-all px-8 uppercase font-black text-[10px] tracking-[0.2em]">
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Download Data
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-red-500/[0.02] rounded-[40px] border border-red-500/10 saas-shadow overflow-hidden">
        <CardHeader className="bg-red-500/5 px-10 py-8 border-b border-red-500/10">
          <CardTitle className="text-xl font-black text-red-400 uppercase tracking-wider flex items-center gap-3">
            <Trash2 className="w-6 h-6" />
            Account Deletion
          </CardTitle>
          <CardDescription className="text-red-400/40 text-[10px] font-bold uppercase tracking-widest mt-1">Irreversible account and data deletion</CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-8">
          <div className="p-8 bg-red-500/5 rounded-3xl border border-red-500/10">
            <p className="text-xs text-red-400/60 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               <AlertTriangle className="w-4 h-4" />
               Warning: Critical Action
            </p>
            <ul className="text-xs text-white/30 font-medium space-y-2 list-none">
              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-500/40" /> All watch history will be purged</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-500/40" /> Profile and bio will be erased</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-500/40" /> All comments will be anonymized</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-red-500/40" /> This action cannot be reversed</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Label className="text-[10px] font-black text-red-400/40 uppercase tracking-[0.3em] ml-1">Type DELETE to authorize</Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="h-14 bg-red-500/5 border-red-500/10 rounded-2xl text-red-400 font-black tracking-[0.5em] text-center focus:ring-red-500/20"
            />
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={confirmText !== 'DELETE'} className="w-full h-14 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-500/20 active:scale-95 transition-all text-xs">
                Delete Account Forever
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-white/5 rounded-[32px] p-10 max-w-md">
              <AlertDialogHeader className="space-y-4">
                <AlertDialogTitle className="text-2xl font-black text-white uppercase tracking-tighter text-center">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-white/40 text-center font-medium leading-relaxed">
                  This action is irreversible. Your entire history and identity will be permanently removed from VoidAnime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-col gap-3 mt-8">
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl h-12 uppercase text-[11px] tracking-widest border-none shadow-xl shadow-red-500/20"
                  disabled={isDeleting}
                >
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm Deletion
                </AlertDialogAction>
                <AlertDialogCancel className="bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white rounded-2xl h-12 uppercase font-black text-[11px] tracking-widest mt-0">
                  Abort
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
