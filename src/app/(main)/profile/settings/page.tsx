'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Moon, Sun, Monitor, Bell, BellOff,
  Lock, Unlock, Globe, Eye, EyeOff, Trash2, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { ThemeMode, ScoreFormat, FillerMode } from '@/types/user';

export default function SettingsPage() {
  const router = useRouter();
  const { firebaseUser } = useUserStore();
  
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [defaultScoreFormat, setDefaultScoreFormat] = useState<ScoreFormat>('POINT_10');
  const [fillerMode, setFillerMode] = useState<FillerMode>('SHOW_ALL');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [listPrivacy, setListPrivacy] = useState<'public' | 'private' | 'friends'>('public');
  const [preferredLanguage, setPreferredLanguage] = useState<'english' | 'romaji' | 'native'>('english');
  
  const [episodeAiring, setEpisodeAiring] = useState(true);
  const [newSeason, setNewSeason] = useState(true);
  const [achievementUnlocked, setAchievementUnlocked] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    if (!firebaseUser?.uid) return;
    
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!firebaseUser) {
    return (
      <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-3xl font-heading font-black text-white mb-4">Sign In Required</h1>
            <p className="text-zinc-400 mb-8">Please sign in to access settings</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-anime-primary text-white rounded-xl font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold">Back to Profile</span>
          </Link>

          <h1 className="text-2xl md:text-3xl font-heading font-black text-white">Settings</h1>
          <p className="text-zinc-400">Manage your account preferences</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-anime-primary/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-anime-primary" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-black text-white">Appearance</h2>
                <p className="text-xs text-zinc-500">Customize how VoidAnime looks</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'amoled', icon: Monitor, label: 'AMOLED' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value as ThemeMode)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                        theme === option.value 
                          ? 'border-anime-primary bg-anime-primary/10 text-white' 
                          : 'border-[#2A2A2A] text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      <span className="text-sm font-bold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">
                  Preferred Title Language
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'english', label: 'English' },
                    { value: 'romaji', label: 'Romaji' },
                    { value: 'native', label: 'Native' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPreferredLanguage(option.value as any)}
                      className={`py-3 rounded-xl border transition-all ${
                        preferredLanguage === option.value 
                          ? 'border-anime-primary bg-anime-primary/10 text-white' 
                          : 'border-[#2A2A2A] text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm font-bold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-anime-secondary/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-anime-secondary" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-black text-white">Notifications</h2>
                <p className="text-xs text-zinc-500">Control your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">Enable Notifications</p>
                  <p className="text-xs text-zinc-500">Receive push notifications</p>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    notificationsEnabled ? 'bg-anime-primary' : 'bg-[#2A2A2A]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="py-3 border-b border-white/5">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">Notification Types</p>
                <div className="space-y-3">
                  {[
                    { state: episodeAiring, setState: setEpisodeAiring, label: 'Episode Airing', desc: 'Get notified when episodes air' },
                    { state: newSeason, setState: setNewSeason, label: 'New Season', desc: 'Updates for new anime seasons' },
                    { state: achievementUnlocked, setState: setAchievementUnlocked, label: 'Achievements', desc: 'When you unlock achievements' },
                    { state: weeklyDigest, setState: setWeeklyDigest, label: 'Weekly Digest', desc: 'Your weekly activity summary' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.setState(!item.state)}
                        className={`w-10 h-5 rounded-full transition-all ${
                          item.state ? 'bg-anime-secondary' : 'bg-[#2A2A2A]'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          item.state ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-anime-cyan/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-anime-cyan" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-black text-white">Privacy</h2>
                <p className="text-xs text-zinc-500">Control who can see your data</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">
                  List Privacy
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'public', icon: Globe, label: 'Public' },
                    { value: 'friends', icon: Eye, label: 'Friends' },
                    { value: 'private', icon: Lock, label: 'Private' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setListPrivacy(option.value as any)}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                        listPrivacy === option.value 
                          ? 'border-anime-cyan bg-anime-cyan/10 text-white' 
                          : 'border-[#2A2A2A] text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      <span className="text-sm font-bold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">
                  Default Score Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'POINT_10', label: '/10' },
                    { value: 'POINT_100', label: '/100' },
                    { value: 'POINT_5', label: '★' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDefaultScoreFormat(option.value as ScoreFormat)}
                      className={`py-3 rounded-xl border transition-all ${
                        defaultScoreFormat === option.value 
                          ? 'border-anime-cyan bg-anime-cyan/10 text-white' 
                          : 'border-[#2A2A2A] text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm font-bold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-3">
                  Filler Episode Handling
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'SHOW_ALL', label: 'Show All' },
                    { value: 'FLAG_ONLY', label: 'Flag Only' },
                    { value: 'SKIP_AUTO', label: 'Auto Skip' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFillerMode(option.value as FillerMode)}
                      className={`py-3 rounded-xl border transition-all ${
                        fillerMode === option.value 
                          ? 'border-anime-cyan bg-anime-cyan/10 text-white' 
                          : 'border-[#2A2A2A] text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm font-bold">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-black text-white">Danger Zone</h2>
                <p className="text-xs text-zinc-500">Irreversible account actions</p>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-bold">Delete Account</span>
              </button>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-400 mb-4">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-[#2A2A2A] text-white rounded-lg text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-anime-primary to-anime-secondary text-white rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <span className="animate-pulse">Saving...</span>
            ) : success ? (
              <span className="text-green-400">Settings Saved!</span>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
