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

export function normalizeMedia(item, mediaType = null) {
  if (!item) return item
  const resolvedType =
    mediaType ||
    item.media_type ||
    (item.name && !item.title ? 'tv' : 'movie')
  return {
    ...item,
    title: getMediaTitle(item),
    release_date: getMediaDate(item),
    media_type: resolvedType,
  }
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
