'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Bug, Lightbulb, Users, Shield, Send, CheckCircle, Loader2, Twitter, Github, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

const SUBJECT_OPTIONS = [
  { value: 'general', label: 'General Inquiry', icon: MessageCircle, description: 'Questions about VoidAnime' },
  { value: 'bug', label: 'Bug Report', icon: Bug, description: 'Report a technical issue' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, description: 'Suggest new features' },
  { value: 'partnership', label: 'Partnership', icon: Users, description: 'Business inquiries' },
  { value: 'privacy', label: 'Privacy Concern', icon: Shield, description: 'Security or privacy issues' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'contact_submissions'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'unread',
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'general', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Failed to send message. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-anime-primary to-anime-secondary mb-6 shadow-lg shadow-anime-primary/30">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Contact Us
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Have a question, found a bug, or want to work together? We&apos;d love to hear from you.
          </p>
          <p className="text-zinc-500 text-sm mt-4">
            We typically respond within 24-48 hours
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
              {success ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-heading font-black text-white mb-4">
                    Message Sent!
                  </h2>
                  <p className="text-zinc-400 mb-6">
                    Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 rounded-2xl bg-anime-primary text-white font-bold hover:shadow-lg hover:shadow-anime-primary/30 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-white placeholder-zinc-500 focus:outline-none focus:border-anime-primary transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-white placeholder-zinc-500 focus:outline-none focus:border-anime-primary transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Subject
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SUBJECT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, subject: option.value })}
                          className={`flex items-start gap-3 p-3 rounded-2xl border transition-all text-left ${
                            formData.subject === option.value
                              ? 'bg-anime-primary/10 border-anime-primary text-white'
                              : 'bg-[#212121] border-[#2A2A2A] text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          <option.icon className="w-5 h-5 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">{option.label}</p>
                            <p className="text-xs text-zinc-500">{option.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-300 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-white placeholder-zinc-500 focus:outline-none focus:border-anime-primary transition-colors resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-anime-primary text-white font-bold hover:shadow-lg hover:shadow-anime-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Direct Email */}
            <div className="p-6 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
              <h3 className="text-lg font-heading font-black text-white mb-4">
                Direct Email
              </h3>
              <a 
                href="mailto:contact@voidanime.online"
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] hover:border-anime-primary transition-colors group"
              >
                <Mail className="w-5 h-5 text-anime-primary" />
                <span className="text-zinc-300 group-hover:text-white transition-colors">
                  contact@voidanime.online
                </span>
              </a>
              <p className="text-xs text-zinc-500 mt-3">
                For privacy concerns or DMCA requests, please include &quot;PRIVACY&quot; or &quot;DMCA&quot; in the subject line.
              </p>
            </div>

            {/* Response Time */}
            <div className="p-6 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
              <h3 className="text-lg font-heading font-black text-white mb-4">
                Response Time
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#212121]">
                  <span className="text-zinc-400 text-sm">General Inquiries</span>
                  <span className="text-green-400 text-sm font-semibold">24-48 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#212121]">
                  <span className="text-zinc-400 text-sm">Bug Reports</span>
                  <span className="text-yellow-400 text-sm font-semibold">1-3 days</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#212121]">
                  <span className="text-zinc-400 text-sm">Partnerships</span>
                  <span className="text-blue-400 text-sm font-semibold">3-5 days</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
              <h3 className="text-lg font-heading font-black text-white mb-4">
                Connect With Us
              </h3>
              <div className="flex gap-3">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] hover:border-anime-primary transition-colors group"
                >
                  <Twitter className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  <span className="text-zinc-400 group-hover:text-white text-sm">Twitter</span>
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] hover:border-anime-primary transition-colors group"
                >
                  <Github className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  <span className="text-zinc-400 group-hover:text-white text-sm">GitHub</span>
                </a>
                <a 
                  href="https://discord.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] hover:border-anime-primary transition-colors group"
                >
                  <MessageSquare className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  <span className="text-zinc-400 group-hover:text-white text-sm">Discord</span>
                </a>
              </div>
            </div>

            {/* Common Questions */}
            <div className="p-6 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
              <h3 className="text-lg font-heading font-black text-white mb-4">
                Common Questions
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-[#212121]">
                  <p className="text-white font-semibold text-sm mb-1">Is VoidAnime free?</p>
                  <p className="text-zinc-500 text-xs">Yes! VoidAnime is completely free to use.</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#212121]">
                  <p className="text-white font-semibold text-sm mb-1">Do you host anime?</p>
                  <p className="text-zinc-500 text-xs">No, we don&apos;t host any content. We provide tracking tools only.</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#212121]">
                  <p className="text-white font-semibold text-sm mb-1">How do I report a bug?</p>
                  <p className="text-zinc-500 text-xs">Use the Bug Report subject above or email us directly.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#2A2A2A] text-center">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} VoidAnime. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/privacy-policy" className="text-zinc-400 hover:text-anime-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-zinc-400 hover:text-anime-primary text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-zinc-400 hover:text-anime-primary text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
