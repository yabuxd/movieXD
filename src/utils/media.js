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
  const type = item?.media_type || (item?.first_air_date && !item?.release_date ? 'tv' : 'movie')
  return type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`
}

export function normalizeMedia(item) {
  if (!item) return item
  return {
    ...item,
    title: getMediaTitle(item),
    release_date: getMediaDate(item),
    media_type: item.media_type || (item.first_air_date && !item.release_date ? 'tv' : 'movie'),
  }
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
