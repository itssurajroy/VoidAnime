'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface AnimeBreadcrumbsProps {
    anime: {
        id: string;
        name: string;
        jname?: string;
    };
}

export function AnimeBreadcrumbs({ anime }: AnimeBreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/30 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
            <Link href="/home" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Home className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/azlist/all" className="hover:text-primary transition-colors">Anime</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white truncate max-w-[200px]">{anime.name}</span>
        </nav>
    )
}
