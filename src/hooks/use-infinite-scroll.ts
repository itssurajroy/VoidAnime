"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface UseInfiniteScrollOptions {
  threshold?: number
  onLoadMore: () => Promise<void>
  enabled?: boolean
}

interface UseInfiniteScrollReturn {
  observerTarget: React.RefObject<HTMLDivElement | null>
  isIntersecting: boolean
}

export function useInfiniteScroll({
  threshold = 0.1,
  onLoadMore,
  enabled = true,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const observerTarget = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const isLoadingRef = useRef(false)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && enabled && !isLoadingRef.current) {
        setIsIntersecting(true)
        isLoadingRef.current = true
        Promise.resolve(onLoadMore()).finally(() => {
          isLoadingRef.current = false
        })
      }
    },
    [enabled, onLoadMore]
  )

  useEffect(() => {
    const target = observerTarget.current
    if (!target || !enabled) return

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
    })

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [threshold, enabled, handleIntersect])

  return { observerTarget, isIntersecting }
}
