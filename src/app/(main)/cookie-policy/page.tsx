'use client';

import { Cookie, Eye, Settings, Trash2, Mail, ChevronRight, Globe } from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-anime-primary to-anime-secondary mb-6 shadow-lg shadow-anime-primary/30">
            <Cookie className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Learn how VoidAnime uses cookies and similar technologies to enhance your experience.
          </p>
          <p className="text-zinc-500 text-sm mt-4">Last updated: March 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          {/* Section 1: What are Cookies */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <ChevronRight className="w-6 h-6 text-anime-primary" />
              1. What Are Cookies
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you 
                visit a website. They are widely used to make websites work more efficiently and provide 
                information to website owners.
              </p>
              <p>
                Cookies allow websites to recognize your device and remember information about your visit, 
                such as your preferred language, login information, and other settings. This can make your 
                next visit easier and the site more useful to you.
              </p>
            </div>
          </section>

          {/* Section 2: Types of Cookies We Use */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-anime-primary" />
              2. Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              
              {/* Essential Cookies */}
              <div className="p-6 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                <h3 className="text-lg font-bold text-white mb-2">Essential Cookies</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  These cookies are necessary for the website to function and cannot be switched off in our systems.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Authentication</span>
                    <span className="text-zinc-400">Session</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Security</span>
                    <span className="text-zinc-400">Session</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Preferences</span>
                    <span className="text-zinc-400">1 year</span>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="p-6 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                <h3 className="text-lg font-bold text-white mb-2">Analytics Cookies</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Google Analytics</span>
                    <span className="text-zinc-400">2 years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Page Views</span>
                    <span className="text-zinc-400">Session</span>
                  </div>
                </div>
              </div>

              {/* Advertising Cookies */}
              <div className="p-6 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                <h3 className="text-lg font-bold text-white mb-2">Advertising Cookies</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  These cookies are used to make advertising messages more relevant to you and your interests.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Google AdSense</span>
                    <span className="text-zinc-400">1 year</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Personalized Ads</span>
                    <span className="text-zinc-400">1 year</span>
                  </div>
                </div>
              </div>

              {/* Third-Party Cookies */}
              <div className="p-6 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                <h3 className="text-lg font-bold text-white mb-2">Third-Party Cookies</h3>
                <p className="text-zinc-400 text-sm mb-3">
                  Some cookies are placed by third-party services that appear on our pages.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">AniList API</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Authentication</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Firebase Auth</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Authentication</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Google Services</span>
                    <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Analytics/Ads</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Section 3: How We Use Cookies */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-anime-primary" />
              3. How We Use Cookies
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Authentication</strong> - To keep you signed in during your visit</li>
                <li><strong className="text-white">Preferences</strong> - To remember your settings and preferences</li>
                <li><strong className="text-white">Analytics</strong> - To understand how visitors use our site</li>
                <li><strong className="text-white">Advertising</strong> - To show relevant ads based on your interests</li>
                <li><strong className="text-white">Security</strong> - To protect against fraudulent activity</li>
                <li><strong className="text-white">Performance</strong> - To improve site speed and functionality</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Google AdSense Specific */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">4. Google AdSense & Advertising</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We use Google AdSense to display advertisements on our website. Google uses cookies to 
                serve ads based on your prior visits to our site and other sites on the internet.
              </p>
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 mt-4">
                <h4 className="font-bold text-yellow-400 mb-2">Important</h4>
                <p className="text-sm text-zinc-300">
                  Google&apos;s use of advertising cookies enables it and its partners to serve ads based 
                  on your visit to our site and/or other sites on the internet. You may opt out of 
                  personalized advertising by visiting{' '}
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-anime-primary hover:underline"
                  >
                    Google Ads Settings
                  </a>
                </p>
              </div>
              <p className="mt-4">
                For more information about how Google uses cookies in advertising, please visit{' '}
                <a 
                  href="https://policies.google.com/technologies/cookies" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-anime-primary hover:underline"
                >
                  Google&apos;s Cookie Policy
                </a>
              </p>
            </div>
          </section>

          {/* Section 5: Managing Cookies */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Settings className="w-6 h-6 text-anime-primary" />
              5. Managing Your Cookies
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                You have the right to decide whether to accept or reject cookies. You can manage your 
                cookie preferences in the following ways:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Browser Settings</h4>
                  <p className="text-sm text-zinc-400">
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="list-disc list-inside text-sm text-zinc-400 mt-2 space-y-1">
                    <li>View what cookies are stored</li>
                    <li>Delete specific cookies</li>
                    <li>Block all or certain types</li>
                    <li>Set preferences for certain sites</li>
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h4 className="font-bold text-white mb-2">Our Cookie Banner</h4>
                  <p className="text-sm text-zinc-400">
                    When you first visit VoidAnime, you can:
                  </p>
                  <ul className="list-disc list-inside text-sm text-zinc-400 mt-2 space-y-1">
                    <li>Accept all cookies</li>
                    <li>Decline non-essential cookies</li>
                    <li>Customize your preferences</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A] mt-4">
                <h4 className="font-bold text-white mb-2">Opt-Out Links</h4>
                <div className="space-y-2">
                  <a 
                    href="https://www.google.com/settings/ads" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-sm text-anime-primary hover:underline"
                  >
                    → Google Ads Settings
                  </a>
                  <a 
                    href="https://www.aboutads.info/choices" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-sm text-anime-primary hover:underline"
                  >
                    → Digital Advertising Alliance
                  </a>
                  <a 
                    href="https://www.youronlinechoices.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-sm text-anime-primary hover:underline"
                  >
                    → Your Online Choices (EU)
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Cookie List */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">6. Specific Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    <th className="text-left py-3 px-4 text-zinc-400 font-semibold">Cookie Name</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-semibold">Purpose</th>
                    <th className="text-left py-3 px-4 text-zinc-400 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  <tr className="border-b border-[#2A2A2A]">
                    <td className="py-3 px-4">firebase:authUser</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Essential</span></td>
                    <td className="py-3 px-4">Authentication</td>
                    <td className="py-3 px-4">Session</td>
                  </tr>
                  <tr className="border-b border-[#2A2A2A]">
                    <td className="py-3 px-4">theme-preference</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Essential</span></td>
                    <td className="py-3 px-4">Dark/Light mode</td>
                    <td className="py-3 px-4">1 year</td>
                  </tr>
                  <tr className="border-b border-[#2A2A2A]">
                    <td className="py-3 px-4">_ga</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Analytics</span></td>
                    <td className="py-3 px-4">Google Analytics</td>
                    <td className="py-3 px-4">2 years</td>
                  </tr>
                  <tr className="border-b border-[#2A2A2A]">
                    <td className="py-3 px-4">_gid</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Analytics</span></td>
                    <td className="py-3 px-4">Google Analytics</td>
                    <td className="py-3 px-4">24 hours</td>
                  </tr>
                  <tr className="border-b border-[#2A2A2A]">
                    <td className="py-3 px-4">NID</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Advertising</span></td>
                    <td className="py-3 px-4">Google AdSense</td>
                    <td className="py-3 px-4">6 months</td>
                  </tr>
                  <tr className="border-b border-[#2A2A2A]">
                    <td className="py-3 px-4">1P_JAR</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Advertising</span></td>
                    <td className="py-3 px-4">Google AdSense</td>
                    <td className="py-3 px-4">1 month</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">cookie-consent</td>
                    <td className="py-3 px-4"><span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Essential</span></td>
                    <td className="py-3 px-4">Consent preference</td>
                    <td className="py-3 px-4">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Updates to Policy */}
          <section className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4">7. Updates to This Policy</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for operational, legal, or regulatory reasons. We will post any changes on this page 
                and update the &quot;Last updated&quot; date at the top.
              </p>
              <p>
                We encourage you to review this policy periodically to stay informed about our use of cookies.
              </p>
            </div>
          </section>

          {/* Section 8: Contact */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-anime-primary/10 to-anime-secondary/10 border border-[#2A2A2A]">
            <h2 className="text-2xl font-heading font-black text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-anime-primary" />
              8. Contact Us
            </h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                If you have any questions about our use of cookies, please contact us:
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
