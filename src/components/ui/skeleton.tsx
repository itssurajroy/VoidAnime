"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

function Skeleton({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "shimmer" }) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowError(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (showError) {
    return (
      <div className={cn("flex items-center justify-center text-[10px] text-muted-foreground border border-dashed rounded-md", className)}>
        Load failed
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-md bg-surface-tertiary",
        (variant === "shimmer" || true) && "skeleton-shimmer",
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="aspect-[2/3] w-full rounded-xl bg-surface-tertiary skeleton-shimmer" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded skeleton-shimmer" />
      </div>
    </div>
  )
}

function SkeletonImage({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "aspect-[2/3] rounded-xl bg-surface-tertiary skeleton-shimmer",
        className
      )}
    />
  )
}

function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 rounded skeleton-shimmer",
            i === lines - 1 && "w-3/4"
          )}
        />
      ))}
    </div>
  )
}

function SkeletonGrid({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

function SkeletonDetailPage({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-72 aspect-[2/3] rounded-xl skeleton-shimmer" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-3/4 rounded skeleton-shimmer" />
          <div className="h-4 w-1/2 rounded skeleton-shimmer" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded skeleton-shimmer" />
            <div className="h-6 w-16 rounded skeleton-shimmer" />
            <div className="h-6 w-16 rounded skeleton-shimmer" />
          </div>
          <SkeletonText lines={4} />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-6 w-32 rounded skeleton-shimmer" />
        <SkeletonGrid count={6} />
      </div>
    </div>
  )
}

function SkeletonEpisodeList({ count = 12, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 h-[60px] rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-surface-tertiary skeleton-shimmer shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-surface-tertiary skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SkeletonEpisodeGrid({ count = 20, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square rounded-2xl bg-white/[0.03] border border-white/5 skeleton-shimmer" />
      ))}
    </div>
  )
}

function SkeletonWatchPage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="container max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-4 flex-1">
            <div className="h-4 w-48 rounded bg-white/5 skeleton-shimmer" />
            <div className="h-12 w-3/4 rounded bg-white/5 skeleton-shimmer" />
            <div className="flex gap-4">
              <div className="h-6 w-32 rounded-full bg-white/5 skeleton-shimmer" />
              <div className="h-6 w-32 rounded-full bg-white/5 skeleton-shimmer" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/5 skeleton-shimmer" />
            <div className="h-12 w-48 rounded-2xl bg-white/5 skeleton-shimmer" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 xl:col-span-9 space-y-10">
            {/* Player Skeleton */}
            <div className="aspect-video rounded-[32px] md:rounded-[48px] bg-white/5 border border-white/5 skeleton-shimmer" />

            {/* Controls Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-32 rounded-[32px] bg-white/5 border border-white/5 skeleton-shimmer" />
                <div className="h-32 rounded-[32px] bg-white/5 border border-white/5 skeleton-shimmer" />
              </div>
              <div className="h-32 rounded-[32px] bg-white/5 border border-white/5 skeleton-shimmer" />
            </div>

            {/* Synopsis Skeleton */}
            <div className="h-96 rounded-[40px] bg-white/5 border border-white/5 skeleton-shimmer" />
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-12 xl:col-span-3 space-y-8">
            <div className="h-[600px] xl:h-[800px] rounded-[40px] bg-white/5 border border-white/5 skeleton-shimmer" />
            <div className="h-64 rounded-[40px] bg-white/5 border border-white/5 skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonImage,
  SkeletonText,
  SkeletonGrid,
  SkeletonDetailPage,
  SkeletonEpisodeList,
  SkeletonEpisodeGrid,
  SkeletonWatchPage,
}
