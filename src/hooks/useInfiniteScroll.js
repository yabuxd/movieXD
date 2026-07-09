import { useCallback, useEffect, useRef } from 'react'

/**
 * Returns a callback ref for a sentinel element at the bottom of a list.
 * When the sentinel enters the viewport, `onLoadMore` runs if more data is available.
 */
export default function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '400px',
  enabled = true,
}) {
  const observerRef = useRef(null)
  const onLoadMoreRef = useRef(onLoadMore)
  const hasMoreRef = useRef(hasMore)
  const isLoadingRef = useRef(isLoading)
  const pendingRef = useRef(false)

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    hasMoreRef.current = hasMore
  }, [hasMore])

  useEffect(() => {
    isLoadingRef.current = isLoading
    if (!isLoading) {
      pendingRef.current = false
    }
  }, [isLoading])

  const tryLoadMore = useCallback(() => {
    if (
      !enabled ||
      !hasMoreRef.current ||
      isLoadingRef.current ||
      pendingRef.current
    ) {
      return
    }

    pendingRef.current = true
    const result = onLoadMoreRef.current()

    if (result?.then) {
      result.catch(() => {}).finally(() => {
        if (!isLoadingRef.current) {
          pendingRef.current = false
        }
      })
    }
  }, [enabled])

  const sentinelRef = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (!node || !enabled) return

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            tryLoadMore()
          }
        },
        { rootMargin, threshold: 0 }
      )

      observerRef.current.observe(node)
    },
    [enabled, rootMargin, tryLoadMore]
  )

  useEffect(() => {
    return () => observerRef.current?.disconnect()
  }, [])

  return sentinelRef
}
