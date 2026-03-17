import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, icon: Icon, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-2 mb-8", className)}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(147,51,234,0.2)]">
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="flex items-center gap-4">
            {!Icon && <div className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_20px_rgba(147,51,234,0.6)]" />}
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">{title}</h2>
        </div>
      </div>
      {subtitle && (
        <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.2em] ml-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
