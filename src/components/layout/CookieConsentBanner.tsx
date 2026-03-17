'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Settings, Check } from 'lucide-react';
import Link from 'next/link';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  advertising: boolean;
  timestamp?: string;
}

const CONSENT_KEY = 'voidanime-cookie-consent';

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    advertising: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(stored);
        updateGtagConsent(parsed);
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const updateGtagConsent = (consent: CookieConsent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': consent.advertising ? 'granted' : 'denied',
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'ad_user_data': consent.advertising ? 'granted' : 'denied',
        'ad_personalization': consent.advertising ? 'granted' : 'denied',
      });
    }
  };

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(newConsent);
    updateGtagConsent(newConsent);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      advertising: true,
    };
    saveConsent(fullConsent);
  };

  const declineAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      advertising: false,
    };
    saveConsent(minimalConsent);
  };

  const toggleSetting = (key: keyof Omit<CookieConsent, 'timestamp'>) => {
    if (key === 'necessary') return;
    const newConsent = {
      ...consent,
      [key]: !consent[key],
    };
    setConsent(newConsent);
  };

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
        {!showSettings ? (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-anime-primary/20 flex items-center justify-center shrink-0">
                <Cookie className="w-6 h-6 text-anime-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-black text-white text-lg mb-1">
                  We use cookies
                </h3>
                <p className="text-sm text-zinc-400">
                  We use cookies to improve your experience and show relevant ads. 
                  By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                </p>
              </div>
              <button 
                onClick={declineAll}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-[#2A2A2A] text-zinc-300 font-semibold hover:bg-white/5 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Customize
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-anime-primary text-white font-semibold hover:shadow-lg hover:shadow-anime-primary/30 transition-all"
              >
                <Check className="w-4 h-4" />
                Accept All
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link 
                href="/privacy-policy" 
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-zinc-600 mx-2">•</span>
              <Link 
                href="/cookie-policy" 
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-black text-white text-lg">
                Cookie Settings
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Necessary */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                <div>
                  <h4 className="font-semibold text-white text-sm">Essential Cookies</h4>
                  <p className="text-xs text-zinc-500">Required for the site to work</p>
                </div>
                <div className="w-10 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
              </div>

              {/* Analytics */}
              <div 
                onClick={() => toggleSetting('analytics')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${
                  consent.analytics 
                    ? 'bg-anime-primary/10 border-anime-primary/30' 
                    : 'bg-[#212121] border-[#2A2A2A] hover:border-zinc-600'
                }`}
              >
                <div>
                  <h4 className="font-semibold text-white text-sm">Analytics Cookies</h4>
                  <p className="text-xs text-zinc-500">Help us understand how you use the site</p>
                </div>
                <div className={`w-10 h-6 rounded-full flex items-center justify-center transition-colors ${
                  consent.analytics ? 'bg-anime-primary' : 'bg-zinc-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    consent.analytics ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </div>
              </div>

              {/* Advertising */}
              <div 
                onClick={() => toggleSetting('advertising')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${
                  consent.advertising 
                    ? 'bg-anime-primary/10 border-anime-primary/30' 
                    : 'bg-[#212121] border-[#2A2A2A] hover:border-zinc-600'
                }`}
              >
                <div>
                  <h4 className="font-semibold text-white text-sm">Advertising Cookies</h4>
                  <p className="text-xs text-zinc-500">Used for personalized ads (Google AdSense)</p>
                </div>
                <div className={`w-10 h-6 rounded-full flex items-center justify-center transition-colors ${
                  consent.advertising ? 'bg-anime-primary' : 'bg-zinc-600'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    consent.advertising ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={declineAll}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-[#2A2A2A] text-zinc-300 font-semibold hover:bg-white/5 transition-colors"
              >
                Decline All
              </button>
              <button
                onClick={() => saveConsent(consent)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-anime-primary text-white font-semibold hover:shadow-lg hover:shadow-anime-primary/30 transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
