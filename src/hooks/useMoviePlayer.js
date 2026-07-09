import { useCallback, useState } from 'react'

const cleanTitle = (title = '') =>
  title
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9\s:]/g, '')
    .trim()

function titleMatches(candidate, title, year = null) {
  const source = cleanTitle(candidate)
  const target = cleanTitle(title)
  if (!source || !target) return false

  const targetLead = target.split(':')[0].trim()
  const sourceLead = source.split(':')[0].trim()
  if (targetLead.length < 2 || sourceLead.length < 2) return false

  const hasTitleMatch =
    source.includes(targetLead) ||
    target.includes(sourceLead) ||
    sourceLead.includes(targetLead) ||
    targetLead.includes(sourceLead)

  if (!hasTitleMatch) return false

  if (year) {
    const yearStr = String(year)
    if (candidate.includes(yearStr) || source.includes(yearStr)) return true
    // Allow match when archive title omits year but title otherwise aligns
    return targetLead.length >= 4
  }

  return true
}

function escapeArchiveTerm(term = '') {
  return term.replace(/[()]/g, '').trim()
}

export default function useMoviePlayer() {
  const [playerState, setPlayerState] = useState({
    source: null,
    embedUrl: null,
    isResolving: false,
    error: null,
    sources: {
      archive: null,
      youtube: null,
      trailer: null,
    },
  })

  const fallbackToTrailer = useCallback((trailerKey) => {
    if (!trailerKey) {
      setPlayerState((prev) => ({
        ...prev,
        source: null,
        embedUrl: null,
        isResolving: false,
        error: 'No movie playback or trailer is available for this title.',
      }))
      return
    }

    const trailerUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`
    setPlayerState((prev) => ({
      ...prev,
      source: 'trailer',
      embedUrl: trailerUrl,
      isResolving: false,
      error: null,
      sources: {
        ...prev.sources,
        trailer: trailerUrl,
      },
    }))
  }, [])

  const resolve = useCallback(
    async (title, trailerKey, isTv = false, episodeLabel = null, year = null) => {
      setPlayerState({
        source: null,
        embedUrl: null,
        isResolving: true,
        error: null,
        sources: {
          archive: null,
          youtube: null,
          trailer: null,
        },
      })

      const safeTitle = escapeArchiveTerm(title)
      const yearSuffix = year ? ` ${year}` : ''
      const searchQuery = episodeLabel
        ? `${title} ${episodeLabel} full episode`
        : `${title}${yearSuffix} ${isTv ? 'full episode' : 'full movie'}`
      const youtubeUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
        searchQuery
      )}&autoplay=1`
      const trailerUrl = trailerKey
        ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`
        : null

      let archiveUrl = null

      try {
        const yearClause = year && !episodeLabel ? ` AND year:(${year})` : ''
        const queryStr = episodeLabel
          ? `title:(${safeTitle}) AND title:(${episodeLabel}) AND mediatype:(movies)`
          : isTv
            ? `title:(${safeTitle}) AND mediatype:(movies)`
            : `title:(${safeTitle}) AND mediatype:(movies)${yearClause}`
        const query = encodeURIComponent(queryStr)
        const response = await fetch(
          `https://archive.org/advancedsearch.php?q=${query}&fl[]=identifier&fl[]=title&fl[]=mediatype&fl[]=year&rows=15&output=json`
        )
        const data = await response.json()
        const items = (data?.response?.docs || []).filter(
          (item) => !item.mediatype || item.mediatype === 'movies' || item.mediatype === 'video'
        )
        const match = items.find((item) => titleMatches(item.title, title, year))

        if (match?.identifier) {
          archiveUrl = `https://archive.org/embed/${match.identifier}`
        }
      } catch (error) {
        console.warn('Internet Archive lookup failed:', error)
      }

      setPlayerState((prev) => {
        const resolvedSources = {
          archive: archiveUrl,
          youtube: youtubeUrl,
          trailer: trailerUrl,
        }

        let activeSource = null
        let activeUrl = null

        if (archiveUrl) {
          activeSource = 'archive'
          activeUrl = archiveUrl
        } else if (trailerUrl) {
          activeSource = 'trailer'
          activeUrl = trailerUrl
        } else if (youtubeUrl) {
          activeSource = 'youtube'
          activeUrl = youtubeUrl
        }

        if (!activeSource) {
          return {
            source: null,
            embedUrl: null,
            isResolving: false,
            error: 'No playback sources available.',
            sources: resolvedSources,
          }
        }

        return {
          source: activeSource,
          embedUrl: activeUrl,
          isResolving: false,
          error: null,
          sources: resolvedSources,
        }
      })
    },
    []
  )

  const switchSource = useCallback((sourceType) => {
    setPlayerState((prev) => {
      const url = prev.sources[sourceType]
      if (!url) return prev
      return {
        ...prev,
        source: sourceType,
        embedUrl: url,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setPlayerState({
      source: null,
      embedUrl: null,
      isResolving: false,
      error: null,
      sources: {
        archive: null,
        youtube: null,
        trailer: null,
      },
    })
  }, [])

  return { ...playerState, resolve, fallbackToTrailer, switchSource, reset }
}
