import { useState, useEffect } from 'react'
import Row from './Row'
import { getGenreRecommendations } from '../services/tmdb'
import { getGenreIds, normalizeMedia } from '../utils/media'

export default function GenreRecommendations({ item, mediaType = 'movie' }) {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!item?.id) return

    const genreIds = getGenreIds(item)
    if (genreIds.length === 0) {
      const fallback =
        mediaType === 'tv'
          ? item.recommendations?.results || item.similar?.results || []
          : item.recommendations?.results || item.similar?.results || []
      setRecommendations(fallback.filter((r) => r.id !== item.id).slice(0, 12).map(normalizeMedia))
      setIsLoading(false)
      return
    }

    let cancelled = false
    const fetchRecs = async () => {
      setIsLoading(true)
      try {
        const results = await getGenreRecommendations(genreIds, mediaType, item.id)
        if (!cancelled) {
          setRecommendations(results.map(normalizeMedia))
        }
      } catch {
        if (!cancelled) {
          const fallback = item.recommendations?.results || item.similar?.results || []
          setRecommendations(fallback.filter((r) => r.id !== item.id).slice(0, 12).map(normalizeMedia))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchRecs()
    return () => {
      cancelled = true
    }
  }, [item, mediaType])

  if (!isLoading && recommendations.length === 0) return null

  return (
    <div className="mt-10 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden">
      <Row title="More Like This" movies={recommendations} isLoading={isLoading} />
    </div>
  )
}
