"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface CharacterCardProps {
  id: string
  name: string
  image?: string
  role: "Main" | "Supporting" | "Secondary" | string
  className?: string
}

export function CharacterCard({
  id,
  name,
  image,
  role,
  className,
}: CharacterCardProps) {
  const roleVariant = role === "Main" ? "default" : role === "Supporting" ? "secondary" : "outline"

  return (
    <Link
      href={`/character/${id}`}
      className={cn(
        "group relative flex flex-col items-center text-center",
        className
      )}
    >
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-full bg-surface-tertiary ring-4 ring-transparent group-hover:ring-brand-500/50 transition-all">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="128px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            ?
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h4 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-brand-400 transition-colors">
          {name}
        </h4>
        <Badge variant={roleVariant} className="text-xs">
          {role}
        </Badge>
      </div>
    </Link>
  )
}

export function CharacterCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shimmer" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-20 rounded shimmer mx-auto" />
        <div className="h-5 w-24 rounded shimmer mx-auto" />
      </div>
    </div>
  )
}
