'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ReadMoreDescription({ text, maxLength = 250 }: { text: string; maxLength?: number }) {
    const [isTruncated, setIsTruncated] = useState(true);

    if (!text) return null;
    
    const toggleIsTruncated = () => setIsTruncated(!isTruncated);

    if (text.length <= maxLength) {
        return <p className="text-white/60 text-[15px] leading-relaxed font-medium tracking-wide">{text}</p>
    }

    return (
        <div className="relative">
            <p className={cn(
                "text-white/60 text-[15px] leading-relaxed font-medium tracking-wide transition-all duration-500",
                isTruncated && "line-clamp-3"
            )}>
                {text}
            </p>
            {isTruncated && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#18191d]/80 to-transparent pointer-events-none" />
            )}
            <button 
                onClick={toggleIsTruncated} 
                className="mt-2 text-primary font-black text-[11px] uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
                {isTruncated ? '[ + Read More ]' : '[ - Show Less ]'}
            </button>
        </div>
    )
}
