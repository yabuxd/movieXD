export function getMediaTitle(item) {
  return item?.title || item?.name || 'Untitled'
}

export function getMediaDate(item) {
  return item?.release_date || item?.first_air_date || null
}

export function getMediaYear(item) {
  const date = getMediaDate(item)
  return date ? new Date(date).getFullYear() : 'TBA'
}

export function getMediaPath(item) {
  if (item?.media_type === 'tv') return `/tv/${item.id}`
  if (item?.media_type === 'movie') return `/movie/${item.id}`
  if (item?.name && !item?.title) return `/tv/${item.id}`
  return `/movie/${item.id}`
}

const YOUTUBE_EMBED_BASE = 'https://www.youtube-nocookie.com/embed'

export function buildYoutubeEmbedUrl(key, { searchList = null, autoplay = true } = {}) {
  const params = new URLSearchParams()
  if (autoplay) params.set('autoplay', '1')
  params.set('rel', '0')
  params.set('modestbranding', '1')

  if (searchList) {
    params.set('listType', 'search')
    params.set('list', searchList)
    return `${YOUTUBE_EMBED_BASE}?${params.toString()}`
  }

  if (!key) return null
  return `${YOUTUBE_EMBED_BASE}/${key}?${params.toString()}`
}

export function buildYoutubeWatchUrl(key) {
  return key ? `https://www.youtube.com/watch?v=${key}` : null
}

export function pickYoutubeTrailer(videos) {
  const results = videos?.results ?? (Array.isArray(videos) ? videos : [])
  const match =
    results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    results.find((v) => v.site === 'YouTube')

  if (!match?.key) return null

  return {
    key: match.key,
    name: match.name,
    type: match.type,
    site: match.site,
    url: buildYoutubeEmbedUrl(match.key),
    watchUrl: buildYoutubeWatchUrl(match.key),
  }
}

export function withTrailer(item) {
  if (!item) return item
  const trailer = pickYoutubeTrailer(item.videos)
  if (!trailer) return item
  return {
    ...item,
    trailer_key: trailer.key,
    trailer_url: trailer.url,
    trailer,
  }
}

export function normalizeMedia(item, mediaType = null) {
  if (!item) return item
  const resolvedType =
    mediaType ||
    item.media_type ||
    (item.name && !item.title ? 'tv' : 'movie')
  const normalized = {
    ...item,
    title: getMediaTitle(item),
    release_date: getMediaDate(item),
    media_type: resolvedType,
  }
  return item.trailer_key || item.trailer ? normalized : withTrailer(normalized)
}

export function normalizeMovieResults(results = [], mediaType = 'movie') {
  return results
    .filter((item) => item && item.id)
    .map((item) => normalizeMedia(item, mediaType))
}

export function getGenreIds(item) {
  if (item?.genres?.length) {
    return item.genres.map((g) => g.id)
  }
  return item?.genre_ids || []
}

export function formatRuntime(minutes) {
  if (!minutes || minutes <= 0) return null
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
