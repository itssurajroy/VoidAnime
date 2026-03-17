import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: "light" | "medium" | "heavy";
}

export function GlassPanel({ children, intensity = "medium", className, ...props }: GlassPanelProps) {
  const intensityClasses = {
    light: "bg-white/[0.02] backdrop-blur-md border-white/5",
    medium: "bg-white/[0.04] backdrop-blur-xl border-white/10",
    heavy: "bg-black/40 backdrop-blur-2xl border-white/10",
  };

  return (
    <div
      className={cn(
        "rounded-[32px] border shadow-2xl relative overflow-hidden",
        intensityClasses[intensity],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
