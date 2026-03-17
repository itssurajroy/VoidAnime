"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface UseRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number
}

interface UseRefreshReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  isRefreshing: boolean
  pullDistance: number
}

export function useRefresh({
  onRefresh,
  threshold = 100,
}: UseRefreshOptions): UseRefreshReturn {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  const startYRef = useRef(0)
  const currentYRef = useRef(0)
  const isPullingRef = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startYRef.current = e.touches[0].clientY
    isPullingRef.current = false
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const currentY = e.touches[0].clientY
    const diff = currentY - startYRef.current

    if (diff > 0 && !isPullingRef.current) {
      isPullingRef.current = true
    }

    if (isPullingRef.current && diff > 0) {
      currentYRef.current = diff
      const clampedDiff = Math.min(diff * 0.5, threshold * 1.5)
      setPullDistance(clampedDiff)
    }
  }, [threshold])

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    setPullDistance(0)
    isPullingRef.current = false
    startYRef.current = 0
    currentYRef.current = 0
  }, [pullDistance, threshold, isRefreshing, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: true })
    container.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return { containerRef, isRefreshing, pullDistance }
}
