'use client';

import { FileText, AlertTriangle, Copyright, Shield, Mail, ChevronRight, Globe } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-anime-primary to-anime-secondary mb-6 shadow-lg shadow-anime-primary/30">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using VoidAnime.
          </p>
          <p className="text-zinc-500 text-sm mt-4">Last updated: March 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          {/* Section 1: Acceptance */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <ChevronRight className="w-6 h-6 text-anime-primary" />
              1. Acceptance of Terms
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                By accessing and using VoidAnime (voidanime.online), you accept and agree to be bound 
                by the terms and provisions of this agreement. If you do not agree to these terms, 
                please do not use our service.
              </p>
              <p>
                We reserve the right to modify these terms at any time. Your continued use of VoidAnime 
                after any changes indicates your acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* Section 2: Description of Service */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-anime-primary" />
              2. Description of Service
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>VoidAnime provides the following services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Anime and manga database browsing and search</li>
                <li>Personal watch/read list tracking</li>
                <li>Progress tracking across episodes/chapters</li>
                <li>Anime recommendations and discovery</li>
                <li>User reviews and ratings</li>
                <li>Seasonal anime calendars</li>
                <li>Statistics and analytics about your viewing habits</li>
              </ul>
              <p className="mt-4">
                Our service is provided free of charge to help anime and manga fans track their journey.
              </p>
            </div>
          </section>

          {/* Section 3: User Conduct */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-anime-primary" />
              3. User Conduct
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>You agree NOT to use our service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Upload, post, or transmit any illegal content</li>
                <li>Harass, threaten, or intimidate other users</li>
                <li>Impersonate any person or entity</li>
                <li>Spider, scrape, or crawl our website</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Introduce viruses, malware, or other harmful code</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Post copyrighted content without authorization</li>
              </ul>
              <p className="mt-4 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
                <strong className="text-yellow-400">Note:</strong> VoidAnime is an information aggregation service. 
                We do not host, store, or distribute any anime or manga content ourselves.
              </p>
            </div>
          </section>

          {/* Section 4: Intellectual Property */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Copyright className="w-6 h-6 text-anime-primary" />
              4. Intellectual Property Rights
            </h2>
            <div className="text-zinc-300 space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Our Content</h3>
                  <p>
                    The VoidAnime website, including but not limited to its design, logo, branding, 
                    graphics, and software, is the intellectual property of VoidAnime. All rights reserved.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Third-Party Content</h3>
                  <p>
                    All anime and manga information displayed on VoidAnime is provided by AniList, 
                    Jikan (MyAnimeList), and Kitsu APIs. We do not claim ownership of this third-party 
                    content.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">User-Generated Content</h3>
                  <p>
                    You retain ownership of any content you submit to VoidAnime (reviews, comments, etc.). 
                    By submitting content, you grant us a worldwide, non-exclusive license to use, display, 
                    and distribute that content.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Disclaimer */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-anime-primary" />
              5. Disclaimer of Warranties
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                VOIDANIME IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
                INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                We do not warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The service will be uninterrupted or error-free</li>
                <li>The information provided will be accurate or reliable</li>
                <li>Any errors will be corrected</li>
              </ul>
              <p className="mt-4">
                We are not responsible for the availability or content of external websites linked 
                from our service.
              </p>
            </div>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">6. Limitation of Liability</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                IN NO EVENT SHALL VOIDANIME, ITS FOUNDERS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR ANY 
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR 
                RELATED TO YOUR USE OF THE SERVICE.
              </p>
              <p>
                This includes, but is not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Loss of data or profits</li>
                <li>Service interruptions</li>
                <li>Errors or omissions in content</li>
                <li>Unauthorized access to your account</li>
              </ul>
            </div>
          </section>

          {/* Section 7: DMCA Policy */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">7. DMCA Policy</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We respect intellectual property rights and expect our users to do the same. If you 
                believe your copyrighted work has been infringed, please send a DMCA notice to our 
                designated agent.
              </p>
              <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A] mt-4">
                <p className="text-zinc-400 text-sm">
                  <strong className="text-white">DMCA Agent:</strong> contact@voidanime.online
                </p>
              </div>
              <p className="mt-4">
                Please include: (1) description of copyrighted work, (2) location of infringement, 
                (3) your contact information, (4) a statement of good faith belief, (5) a statement 
                of accuracy, and (6) your signature.
              </p>
            </div>
          </section>

          {/* Section 8: Termination */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">8. Termination</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We may terminate or suspend your access to VoidAnime immediately, without prior notice 
                or liability, for any reason, including breach of these Terms.
              </p>
              <p>
                Upon termination, your right to use the service will immediately cease. If you wish 
                to delete your account, contact us at contact@voidanime.online.
              </p>
            </div>
          </section>

          {/* Section 9: Governing Law */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">9. Governing Law</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the 
                jurisdiction in which VoidAnime operates, without regard to its conflict of law provisions.
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
                If you have any questions about these Terms of Service, please contact us:
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
