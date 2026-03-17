'use client';

import { cn } from "@/lib/utils";

interface RankBadgeProps {
    rank: string;
    className?: string;
}

export function RankBadge({ rank, className }: RankBadgeProps) {
    const getBadge = () => {
        switch (rank) {
            case 'Pirate King':
                return (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                        <path d="M12 2L4 5V11C4 16.1 7.4 20.9 12 22C16.6 20.9 20 16.1 20 11V5L12 2Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="11" r="4" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 7V15M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'S-Class Wizard':
                return (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                        <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 7L14 11H18L15 13.5L16 17.5L12 15L8 17.5L9 13.5L6 11H10L12 7Z" fill="currentColor" />
                    </svg>
                );
            case 'Hunter':
                return (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                        <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
                        <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'Genin':
                return (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                        <path d="M3 10H21V14H3V10Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 9V10M12 14V15" stroke="currentColor" strokeWidth="2" />
                    </svg>
                );
            default: // Trainee
                return (
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full", className)}>
                        <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
        }
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            {getBadge()}
        </div>
    );
}
