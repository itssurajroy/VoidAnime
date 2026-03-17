import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function SectionTitle({
  children,
  className,
  showViewMore = false,
  href = '#',
  icon: Icon,
}: {
  children: React.ReactNode;
  className?: string;
  showViewMore?: boolean;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className={cn('mb-6 flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 bg-[#8b5cf6] rounded-full" />
        {Icon && <Icon className="w-6 h-6 text-[#8b5cf6]" />}
        <h2 className="text-2xl font-black text-white font-headline uppercase tracking-tight">{children}</h2>
      </div>
      {showViewMore && (
        <Link
          href={href}
          className="flex items-center gap-1.5 text-[13px] font-bold text-white/40 hover:text-[#8b5cf6] transition-colors group"
        >
          View More
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
