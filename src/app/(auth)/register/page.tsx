'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithGoogle, signUpWithEmail } from '@/lib/firebase/auth';
import { upsertUserProfile, isUsernameAvailable } from '@/lib/firebase/firestore';
import { Zap, Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const handleCheckUsername = async (value: string) => {
    setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setUsernameChecking(true);
    try {
      const available = await isUsernameAvailable(value);
      setUsernameAvailable(available);
    } catch {
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const cred = await signInWithGoogle();
      await upsertUserProfile(cred.user.uid, {
        uid: cred.user.uid,
        email: cred.user.email ?? '',
        displayName: cred.user.displayName ?? 'Anime Fan',
        photoURL: cred.user.photoURL ?? '',
        username: `user_${Date.now()}`,
      });
      router.push('/');
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Failed to sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!usernameAvailable) {
      setError('Please choose a valid username.');
      return;
    }

    setLoading(true);
    try {
      const cred = await signUpWithEmail(email, password, displayName || email.split('@')[0]);
      await upsertUserProfile(cred.user.uid, {
        uid: cred.user.uid,
        email: cred.user.email ?? '',
        displayName: displayName || email.split('@')[0],
        username: username,
        photoURL: '',
      });
      router.push('/');
    } catch (e: unknown) {
      const message = (e as Error).message ?? 'Failed to create account.';
      if (message.includes('email-already-in-use')) {
        setError('This email is already registered.');
      } else if (message.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-anime-primary to-anime-secondary shadow-xl shadow-anime-primary/20 mb-4">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-black text-white">Create Account</h1>
          <p className="mt-1.5 text-sm text-zinc-400">Join the VoidAnime community</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Success */}
        {usernameAvailable && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-green-500/20 bg-green-500/10 p-3">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-400 mt-0.5" />
            <p className="text-xs text-green-400">Username is available!</p>
          </div>
        )}

        {/* Google button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-[#212121] disabled:opacity-60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2A2A2A]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0D0D0D] px-2 text-zinc-500">Or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleEmail} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="w-full rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-anime-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => handleCheckUsername(e.target.value)}
                placeholder="username"
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 pl-8 text-sm text-white placeholder:text-zinc-600 focus:border-anime-primary focus:outline-none transition-colors"
              />
              {usernameChecking && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">Checking...</span>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-anime-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-anime-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-400">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-anime-primary focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-anime-primary to-anime-secondary py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-anime-primary/20 transition-all hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link href="/login" className="text-anime-primary hover:underline">Sign in</Link>
        </p>

        {/* Terms */}
        <p className="mt-4 text-center text-xs text-zinc-600">
          By creating an account, you agree to our{' '}
          <Link href="/terms-of-service" className="text-zinc-500 hover:text-anime-primary">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy-policy" className="text-zinc-500 hover:text-anime-primary">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
