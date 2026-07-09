import { useCallback, useState } from 'react'

const cleanTitle = (title = '') =>
  title
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9\s:]/g, '')
    .trim()

function titleMatches(candidate, title) {
  const source = cleanTitle(candidate)
  const target = cleanTitle(title)
  const targetLead = target.split(':')[0]
  const sourceLead = source.split(':')[0]

  return source.includes(targetLead) || target.includes(sourceLead)
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
    async (title, trailerKey, isTv = false) => {
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

      const searchSuffix = isTv ? 'full episodes' : 'full movie'
      const youtubeUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
        `${title} ${searchSuffix}`
      )}&autoplay=1`
      const trailerUrl = trailerKey
        ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`
        : null

      let archiveUrl = null

      try {
        const queryStr = isTv
          ? `title:(${title})`
          : `title:(${title}) AND mediatype:(movies)`
        const query = encodeURIComponent(queryStr)
        const response = await fetch(
          `https://archive.org/advancedsearch.php?q=${query}&fl[]=identifier&fl[]=title&fl[]=mediatype&rows=10&output=json`
        )
        const data = await response.json()
        const items = data?.response?.docs || []
        const match = items.find((item) => titleMatches(item.title, title)) || items[0]

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

        // Determine primary and fallback active source
        let activeSource = null
        let activeUrl = null

        if (archiveUrl) {
          activeSource = 'archive'
          activeUrl = archiveUrl
        } else if (youtubeUrl) {
          activeSource = 'youtube'
          activeUrl = youtubeUrl
        } else if (trailerUrl) {
          activeSource = 'trailer'
          activeUrl = trailerUrl
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
