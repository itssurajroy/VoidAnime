'use client';

import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title?: string;
  text?: string;
  className?: string;
}

export function ShareButton({ title, text, className }: ShareButtonProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareData = {
      title: title || document.title,
      text: text || "Check out this anime on VoidAnime!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Anime URL has been copied to your clipboard.",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to Copy",
          description: "Could not copy the link.",
        });
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        "w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] sm:rounded-[20px] bg-white/5 border border-white/10 hover:bg-primary hover:text-black flex items-center justify-center text-white transition-all backdrop-blur-xl group shadow-xl active:scale-95",
        className
      )}
      title="Share Anime"
    >
      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
    </button>
  );
}
