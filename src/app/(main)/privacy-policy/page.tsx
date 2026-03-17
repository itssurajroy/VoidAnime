'use client';

import { Shield, Eye, Lock, Mail, Database, Trash2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-anime-primary to-anime-secondary mb-6 shadow-lg shadow-anime-primary/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your data.
          </p>
          <p className="text-zinc-500 text-sm mt-4">Last updated: March 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          {/* Section 1: Introduction */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <ChevronRight className="w-6 h-6 text-anime-primary" />
              1. Introduction
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                VoidAnime (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the VoidAnime website (voidanime.online). 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                visit our website.
              </p>
              <p>
                By accessing or using VoidAnime, you agree to this Privacy Policy. If you do not agree with 
                the terms of this policy, please do not access our website.
              </p>
            </div>
          </section>

          {/* Section 2: Data We Collect */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-anime-primary" />
              2. Information We Collect
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Personal Data</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                  <li>Email address (when you sign up or contact us)</li>
                  <li>Display name and profile information</li>
                  <li>Authentication data (via AniList OAuth)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Usage Data</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                  <li>Watch history and progress</li>
                  <li>Anime/Manga lists (Plan to Watch, Completed, etc.)</li>
                  <li>Preferences and favorites</li>
                  <li>Review and rating data</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Automatically Collected Data</h3>
                <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and general location</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: How We Use Data */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-anime-primary" />
              3. How We Use Your Information
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our anime tracking services</li>
                <li>Track your watch progress across devices</li>
                <li>Personalize your experience with recommendations</li>
                <li>Send you updates about anime you&apos;re tracking</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Analyze usage patterns to improve our services</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Cookies & Tracking */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-anime-primary" />
              4. Cookies and Tracking Technologies
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We use cookies and similar tracking technologies to track activity on our website and hold 
                certain information. You can instruct your browser to refuse all cookies or to indicate when 
                a cookie is being sent.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Essential Cookies</h4>
                  <p className="text-sm text-zinc-400">Required for site functionality, authentication, and preferences.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-zinc-400">Help us understand how visitors interact with our website.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Advertising Cookies</h4>
                  <p className="text-sm text-zinc-400">Used by Google AdSense to serve relevant ads (with consent).</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Third-Party Cookies</h4>
                  <p className="text-sm text-zinc-400">From AniList, Firebase, and other integrated services.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Third-Party Services */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">5. Third-Party Services</h2>
            <div className="text-zinc-300 space-y-4">
              <p>We use third-party services that may collect information about you:</p>
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <div>
                    <h4 className="font-bold text-white">AniList API</h4>
                    <p className="text-sm text-zinc-400">Anime/Manga data and user authentication</p>
                  </div>
                  <span className="text-xs text-zinc-500">External Link</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <div>
                    <h4 className="font-bold text-white">Jikan API (MyAnimeList)</h4>
                    <p className="text-sm text-zinc-400">Anime metadata and scheduling data</p>
                  </div>
                  <span className="text-xs text-zinc-500">External Link</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <div>
                    <h4 className="font-bold text-white">Kitsu API</h4>
                    <p className="text-sm text-zinc-400">Additional anime metadata</p>
                  </div>
                  <span className="text-xs text-zinc-500">External Link</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <div>
                    <h4 className="font-bold text-white">Google AdSense</h4>
                    <p className="text-sm text-zinc-400">Advertising and analytics</p>
                  </div>
                  <span className="text-xs text-zinc-500">External Link</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <div>
                    <h4 className="font-bold text-white">Firebase (Google)</h4>
                    <p className="text-sm text-zinc-400">Authentication and data storage</p>
                  </div>
                  <span className="text-xs text-zinc-500">External Link</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Data Security */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-anime-primary" />
              6. Data Security
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We implement appropriate technical and organizational security measures to protect your 
                personal information. However, no method of transmission over the Internet is 100% secure, 
                and we cannot guarantee absolute security.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Data encrypted in transit (HTTPS)</li>
                <li>Secure Firebase authentication</li>
                <li>Regular security assessments</li>
                <li>Limited access to personal data</li>
              </ul>
            </div>
          </section>

          {/* Section 7: Your Rights */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Trash2 className="w-6 h-6 text-anime-primary" />
              7. Your Rights (GDPR & CCPA)
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>Depending on your location, you may have the following rights:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Right to Access</h4>
                  <p className="text-sm text-zinc-400">Request a copy of your personal data</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Right to Rectification</h4>
                  <p className="text-sm text-zinc-400">Request correction of inaccurate data</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Right to Erasure</h4>
                  <p className="text-sm text-zinc-400">Request deletion of your personal data</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Right to Object</h4>
                  <p className="text-sm text-zinc-400">Object to processing of your data</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Data Portability</h4>
                  <p className="text-sm text-zinc-400">Request your data in a portable format</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Withdraw Consent</h4>
                  <p className="text-sm text-zinc-400">Revoke consent at any time</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: Children&apos;s Privacy */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">8. Children&apos;s Privacy</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                Our website is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child 
                has provided us with personal information, please contact us immediately.
              </p>
            </div>
          </section>

          {/* Section 9: Changes to Policy */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">9. Changes to This Policy</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. 
                You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </section>

          {/* Section 10: Contact */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-anime-primary/10 to-anime-secondary/10 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-anime-primary" />
              10. Contact Us
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <a 
                  href="mailto:contact@voidanime.online"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-anime-primary text-white font-bold hover:shadow-lg hover:shadow-anime-primary/30 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  contact@voidanime.online
                </a>
                <Link 
                  href="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Contact Form
                </Link>
              </div>
            </div>
          </section>

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
