const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function tmdbImageUrl(path, size = 'w342') {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export const POSTER = {
  card: 'w185',
  cardHi: 'w342',
  detail: 'w500',
  thumb: 'w92',
}

export const BACKDROP = {
  hero: 'w780',
  heroHi: 'w1280',
  section: 'w780',
}

export const POSTER_SIZES = '(max-width: 640px) 160px, (max-width: 768px) 192px, 208px'

export function tmdbPosterProps(path) {
  if (!path) return null
  if (path.startsWith('http')) {
    return { src: path }
  }

  return {
    src: tmdbImageUrl(path, POSTER.card),
    srcSet: [
      `${tmdbImageUrl(path, POSTER.thumb)} 92w`,
      `${tmdbImageUrl(path, POSTER.card)} 185w`,
      `${tmdbImageUrl(path, POSTER.cardHi)} 342w`,
    ].join(', '),
    sizes: POSTER_SIZES,
  }
}

export function tmdbBackdropProps(path) {
  if (!path) return null
  if (path.startsWith('http')) {
    return { src: path }
  }

  return {
    src: tmdbImageUrl(path, BACKDROP.hero),
    srcSet: [
      `${tmdbImageUrl(path, BACKDROP.section)} 780w`,
      `${tmdbImageUrl(path, BACKDROP.heroHi)} 1280w`,
    ].join(', '),
    sizes: '100vw',
  }
}
