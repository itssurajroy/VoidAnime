'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on the dashboard root
  if (segments.length <= 1) {
    return <div className="hidden md:flex text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Dashboard Hub</div>;
  }
  
  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        
        return (
          <Fragment key={href}>
            <Link
              href={href}
              className={cn(
                "transition-colors duration-300",
                isLast 
                    ? "text-primary pointer-events-none" 
                    : "text-white/30 hover:text-white"
              )}
            >
              {capitalizedSegment}
            </Link>
            {!isLast && <ChevronRight className="h-3 w-3 text-white/10" />}
          </Fragment>
        );
      })}
    </nav>
  );
}
