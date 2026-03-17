"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Play, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface EpisodeCardProps {
  id: string
  number: number
  title: string
  thumbnail?: string
  duration?: string
  isWatched?: boolean
  isCurrent?: boolean
  className?: string
}

export function EpisodeCard({
  id,
  number,
  title,
  thumbnail,
  duration,
  isWatched = false,
  isCurrent = false,
  className,
}: EpisodeCardProps) {
  return (
    <Link
      href={`/watch/${id}`}
      className={cn(
        "group relative flex items-center gap-4 p-2 rounded-lg bg-card hover:bg-card/80 transition-colors",
        isCurrent && "ring-2 ring-brand-500",
        className
      )}
    >
      <div className="relative flex-shrink-0 w-32 h-20 overflow-hidden rounded-md bg-surface-tertiary">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="128px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        {isWatched && (
          <div className="absolute top-1 right-1 bg-green-500/90 rounded-full p-0.5">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <div className="bg-brand-500 rounded-full p-2">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">
            EP {number}
          </Badge>
          {duration && (
            <span className="text-xs text-muted-foreground">{duration}</span>
          )}
        </div>
        <h4 className="font-medium text-sm text-foreground truncate">
          {title}
        </h4>
        {isWatched && (
          <span className="text-xs text-green-500">Watched</span>
        )}
      </div>
    </Link>
  )
}

export function EpisodeCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 p-2", className)}>
      <div className="relative flex-shrink-0 w-32 h-20 rounded-md bg-surface-tertiary shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-20 rounded shimmer" />
        <div className="h-4 w-full rounded shimmer" />
      </div>
    </div>
  )
}
