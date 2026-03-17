'use client';

import React from 'react';

export const ONE_PIECE_EMOJIS = [
    {
        name: 'luffy',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#000" strokeWidth="2" />
                <path d="M20 40 Q50 20 80 40" stroke="#000" strokeWidth="3" fill="none" />
                <circle cx="35" cy="45" r="5" fill="#000" />
                <circle cx="65" cy="45" r="5" fill="#000" />
                <path d="M30 70 Q50 85 70 70" stroke="#000" strokeWidth="3" fill="none" />
                <rect x="10" y="35" width="80" height="10" rx="5" fill="#8B4513" />
            </svg>
        )
    },
    {
        name: 'zoro',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#228B22" stroke="#000" strokeWidth="2" />
                <path d="M25 45 Q50 35 75 45" stroke="#000" strokeWidth="3" fill="none" />
                <circle cx="35" cy="50" r="4" fill="#000" />
                <circle cx="65" cy="50" r="4" fill="#000" />
                <path d="M40 70 H60" stroke="#000" strokeWidth="2" />
                <path d="M30 30 L40 40 M60 30 L70 40" stroke="#000" strokeWidth="2" />
            </svg>
        )
    },
    {
        name: 'nami',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#FFA500" stroke="#000" strokeWidth="2" />
                <circle cx="35" cy="45" r="6" fill="#000" />
                <circle cx="65" cy="45" r="6" fill="#000" />
                <path d="M35 70 Q50 80 65 70" stroke="#000" strokeWidth="3" fill="none" />
                <path d="M20 30 Q50 10 80 30" stroke="#000" strokeWidth="4" fill="none" />
            </svg>
        )
    },
    {
        name: 'usopp',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#D2691E" stroke="#000" strokeWidth="2" />
                <circle cx="35" cy="45" r="4" fill="#000" />
                <circle cx="65" cy="45" r="4" fill="#000" />
                <rect x="45" y="45" width="25" height="6" rx="3" fill="#D2691E" stroke="#000" strokeWidth="1" />
                <path d="M40 75 Q50 80 60 75" stroke="#000" strokeWidth="2" fill="none" />
            </svg>
        )
    },
    {
        name: 'sanji',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#F0E68C" stroke="#000" strokeWidth="2" />
                <path d="M15 45 Q35 25 60 45" stroke="#000" strokeWidth="3" fill="none" />
                <circle cx="65" cy="50" r="4" fill="#000" />
                <path d="M40 70 Q50 75 60 70" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M60 70 L70 75" stroke="#000" strokeWidth="2" />
            </svg>
        )
    },
    {
        name: 'chopper',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#FFC0CB" stroke="#000" strokeWidth="2" />
                <rect x="30" y="20" width="40" height="30" rx="10" fill="#FF1493" stroke="#000" strokeWidth="2" />
                <path d="M35 35 H65 M50 20 V50" stroke="#FFF" strokeWidth="4" />
                <circle cx="40" cy="65" r="4" fill="#000" />
                <circle cx="60" cy="65" r="4" fill="#000" />
                <circle cx="50" cy="75" r="3" fill="#4169E1" />
            </svg>
        )
    },
    {
        name: 'robin',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#4B0082" stroke="#000" strokeWidth="2" />
                <path d="M20 30 Q50 20 80 30 V60 Q50 50 20 60 Z" fill="#000" />
                <circle cx="40" cy="55" r="4" fill="#FFF" />
                <circle cx="60" cy="55" r="4" fill="#FFF" />
                <path d="M45 75 H55" stroke="#000" strokeWidth="2" />
            </svg>
        )
    },
    {
        name: 'franky',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#87CEEB" stroke="#000" strokeWidth="2" />
                <rect x="35" y="40" width="30" height="20" fill="#B0C4DE" stroke="#000" strokeWidth="2" />
                <circle cx="40" cy="50" r="3" fill="#000" />
                <circle cx="60" cy="50" r="3" fill="#000" />
                <path d="M40 75 Q50 85 60 75" stroke="#000" strokeWidth="4" fill="none" />
                <path d="M50 10 V30" stroke="#87CEEB" strokeWidth="10" strokeLinecap="round" />
            </svg>
        )
    },
    {
        name: 'brook',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#000" />
                <circle cx="50" cy="55" r="35" fill="#FFF" stroke="#000" strokeWidth="2" />
                <circle cx="40" cy="50" r="6" fill="#000" />
                <circle cx="60" cy="50" r="6" fill="#000" />
                <path d="M40 75 Q50 85 60 75" stroke="#000" strokeWidth="3" fill="none" />
                <path d="M20 40 Q50 0 80 40" stroke="#000" strokeWidth="20" fill="none" />
            </svg>
        )
    },
    {
        name: 'jinbe',
        svg: (
            <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#4682B4" stroke="#000" strokeWidth="2" />
                <path d="M30 40 Q50 30 70 40" stroke="#000" strokeWidth="5" fill="none" />
                <circle cx="35" cy="55" r="3" fill="#000" />
                <circle cx="65" cy="55" r="3" fill="#000" />
                <path d="M35 80 Q50 90 65 80" stroke="#000" strokeWidth="4" fill="none" />
                <path d="M25 60 L35 70 M75 60 L65 70" stroke="#FFF" strokeWidth="4" />
            </svg>
        )
    }
];

export function EmojiRenderer({ content }: { content: string }) {
    const parts = content.split(/(:[a-z_]+:)/g);
    
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith(':') && part.endsWith(':')) {
                    const emojiName = part.slice(1, -1);
                    const emoji = ONE_PIECE_EMOJIS.find(e => e.name === emojiName);
                    if (emoji) {
                        return (
                            <span key={i} className="inline-block w-8 h-8 align-middle mx-1 transition-transform hover:scale-125" title={emojiName}>
                                {emoji.svg}
                            </span>
                        );
                    }
                }
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}
