'use client';

import { useState } from 'react';
import { X, BellRing } from 'lucide-react';
import { useSiteConfig } from '@/components/SettingsProvider';

export function NotificationBar() {
    const [isVisible, setIsVisible] = useState(true);
    const { config, loading } = useSiteConfig();

    if (loading || !config?.announcement?.enabled || !isVisible) {
        return null;
    }

    return (
        <div className="relative group overflow-hidden bg-primary/10 border border-primary/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 animate-in slide-in-from-top-4 duration-700 saas-shadow">
            {/* Glow Background */}
            <div className="absolute -inset-1 bg-primary/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity pointer-events-none" />
            
            <div className="relative z-10 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <BellRing className="w-5 h-5 text-primary animate-bounce" />
            </div>

            <div className="relative z-10 flex-1 min-w-0 pr-8">
                <p className="text-[13px] md:text-[14px] font-black text-white leading-relaxed uppercase tracking-tight line-clamp-2 md:line-clamp-none">
                    {config.announcement.message}
                </p>
            </div>

            <button 
                className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all active:scale-90"
                onClick={() => setIsVisible(false)}
                aria-label="Dismiss Notification"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}
