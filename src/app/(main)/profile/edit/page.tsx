'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Camera, Twitter, Github, 
  Globe, Link as LinkIcon, User, Zap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '@/store/userStore';
import { upsertUserProfile } from '@/lib/firebase/firestore';

export default function EditProfilePage() {
  const router = useRouter();
  const { firebaseUser, profile } = useUserStore();
  
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [twitter, setTwitter] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setUsername(profile.username || '');
      setPhotoURL(profile.photoURL || '');
    }
    if (firebaseUser) {
      setDisplayName(firebaseUser.displayName || '');
      setPhotoURL(firebaseUser.photoURL || '');
    }
  }, [profile, firebaseUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser?.uid) return;
    
    setSaving(true);
    try {
      await upsertUserProfile(firebaseUser.uid, {
        displayName,
        username,
        bio,
        photoURL,
        socialLinks: { twitter }
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
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
            <p className="text-zinc-400 mb-8">Please sign in to edit your profile</p>
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
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <Link 
              href="/profile" 
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Back to Profile</span>
            </Link>
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-green-400 font-bold"
              >
                <Zap className="w-5 h-5" />
                Profile updated!
              </motion.div>
            )}
          </div>

          <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5">
            <h1 className="text-2xl md:text-3xl font-heading font-black text-white mb-2">Edit Profile</h1>
            <p className="text-zinc-400 mb-8">Update your public profile information</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative group">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-[#2A2A2A] bg-[#0f0f1a]">
                    <Image
                      src={photoURL || '/avatar-placeholder.png'}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button 
                    type="button"
                    className="absolute bottom-0 right-0 w-10 h-10 bg-anime-primary rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
                      Display Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-[#0f0f1a] border border-[#2A2A2A] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-anime-primary focus:outline-none transition-colors"
                        placeholder="Your display name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        className="w-full bg-[#0f0f1a] border border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:border-anime-primary focus:outline-none transition-colors"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0f0f1a] border border-[#2A2A2A] rounded-xl py-3 px-4 text-white placeholder:text-zinc-600 focus:border-anime-primary focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                  maxLength={200}
                />
                <p className="text-right text-xs text-zinc-500 mt-1">{bio.length}/200</p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
                  Avatar URL
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="w-full bg-[#0f0f1a] border border-[#2A2A2A] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-anime-primary focus:outline-none transition-colors"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4">Social Links</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-2">Twitter</label>
                    <div className="relative">
                      <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1da1f2]" />
                      <input
                        type="text"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        className="w-full bg-[#0f0f1a] border border-[#2A2A2A] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-[#1da1f2] focus:outline-none transition-colors"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-anime-primary to-anime-secondary text-white rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
