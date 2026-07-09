import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useWatchlist } from '../context/WatchlistContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useContinueWatching } from '../context/ContinueWatchingContext'
import { getTvDetails, getTvSeasonDetails } from '../services/tmdb'
import useMoviePlayer from '../hooks/useMoviePlayer'
import LoadingSpinner from '../components/LoadingSpinner'
import VideoPlayer from '../components/VideoPlayer'
import EpisodeSidebar from '../components/EpisodeSidebar'
import GenreRecommendations from '../components/GenreRecommendations'
import { getMediaTitle, getMediaYear } from '../utils/media'

export default function SeriesDetails() {
  const { id } = useParams()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToHistory } = useContinueWatching()
  const { isAuthenticated } = useAuth()

  const [series, setSeries] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [episodesBySeason, setEpisodesBySeason] = useState({})
  const [loadingSeasons, setLoadingSeasons] = useState({})
  const [selectedSeason, setSelectedSeason] = useState(null)
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const {
    source: playerSource,
    embedUrl: playerEmbedUrl,
    isResolving: isPlayerResolving,
    error: playerError,
    sources: playerSources,
    resolve: resolvePlayer,
    switchSource,
    reset: resetPlayer,
  } = useMoviePlayer()

  const loadSeason = useCallback(async (seasonNumber) => {
    if (episodesBySeason[seasonNumber] || loadingSeasons[seasonNumber]) return

    setLoadingSeasons((prev) => ({ ...prev, [seasonNumber]: true }))
    try {
      const data = await getTvSeasonDetails(id, seasonNumber)
      setEpisodesBySeason((prev) => ({
        ...prev,
        [seasonNumber]: data.episodes || [],
      }))
    } catch (err) {
      console.error(`Failed to load season ${seasonNumber}:`, err)
    } finally {
      setLoadingSeasons((prev) => ({ ...prev, [seasonNumber]: false }))
    }
  }, [id, episodesBySeason, loadingSeasons])

  const playEpisode = useCallback((episode, showData) => {
    setSelectedEpisode(episode)
    setSelectedSeason(episode.season_number)
    const showTitle = getMediaTitle(showData)
    const episodeLabel = `S${episode.season_number}E${episode.episode_number}`
    const trailer = showData.trailer_key

    resolvePlayer(
      showTitle,
      trailer,
      true,
      episodeLabel,
      getMediaYear(showData)
    )
    setSidebarOpen(false)
  }, [resolvePlayer])

  const handleSeasonChange = useCallback((seasonNumber) => {
    setSelectedSeason(seasonNumber)
    loadSeason(seasonNumber)
  }, [loadSeason])

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true)
      setError(null)
      resetPlayer()
      setEpisodesBySeason({})
      setSelectedSeason(null)
      setSelectedEpisode(null)

      try {
        const data = await getTvDetails(id)
        setSeries(data)
        addToHistory({ ...data, title: data.name, release_date: data.first_air_date })

        const firstSeason = (data.seasons || []).find(
          (s) => s.season_number > 0 && s.episode_count > 0
        )

        if (firstSeason) {
          setSelectedSeason(firstSeason.season_number)
          const seasonData = await getTvSeasonDetails(id, firstSeason.season_number)
          const episodes = seasonData.episodes || []
          setEpisodesBySeason({ [firstSeason.season_number]: episodes })

          if (episodes.length > 0) {
            playEpisode(episodes[0], data)
          }
        }
      } catch (err) {
        console.error('Failed to load series details:', err)
        setError('Failed to load series details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
    window.scrollTo(0, 0)
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-2xl font-bold mb-4">{error || 'Series not found'}</h1>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    )
  }

  const title = getMediaTitle(series)
  const year = getMediaYear(series)
  const rating = series.vote_average > 0 ? series.vote_average.toFixed(1) : 'N/A'
  const genres = (series.genres || []).map((g) => g.name)
  const inWatchlist = isInWatchlist(series.id)
  const playerTitle = selectedEpisode
    ? `${title} — S${selectedEpisode.season_number}E${selectedEpisode.episode_number}: ${selectedEpisode.name}`
    : title

  return (
    <>
      <Helmet>
        <title>{title} — MovieXD</title>
        <meta name="description" content={series.overview?.substring(0, 160) || `Watch ${title} on MovieXD.`} />
      </Helmet>

      <div className="min-h-screen bg-brand-bg pt-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium bg-brand-surface/80 px-3 py-1.5 rounded-full border border-white/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>

            {isAuthenticated && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleWatchlist({ ...series, title: series.name, release_date: series.first_air_date })}
                  className={`btn-secondary text-sm py-2 ${inWatchlist ? 'border-red-500/50 text-red-400' : ''}`}
                >
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite({ ...series, title: series.name, release_date: series.first_air_date })}
                  className={`btn-secondary text-sm py-2 ${isFavorite(series.id) ? 'border-red-500 text-red-400' : ''}`}
                >
                  {isFavorite(series.id) ? 'Favorited' : 'Favorite'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,24rem)_minmax(0,1fr)] gap-4 lg:gap-6 lg:items-stretch">
            <div className="order-2 lg:order-1 min-h-0 overflow-hidden max-h-[50vh] lg:max-h-none lg:h-full">
              <EpisodeSidebar
                seasons={series.seasons || []}
                episodesBySeason={episodesBySeason}
                loadingSeasons={loadingSeasons}
                selectedSeason={selectedSeason}
                onSeasonChange={handleSeasonChange}
                selectedEpisode={selectedEpisode}
                onSelectEpisode={(ep) => playEpisode(ep, series)}
                onExpandSeason={loadSeason}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen((v) => !v)}
              />
            </div>

            <div className="order-1 lg:order-2 w-full min-w-0 rounded-2xl overflow-hidden border border-brand-border shadow-2xl">
              <VideoPlayer
                title={playerTitle}
                embedUrl={playerEmbedUrl}
                isResolving={isPlayerResolving}
                error={playerError}
                source={playerSource}
                sources={playerSources}
                onSwitchSource={switchSource}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {genres.map((g) => (
                <span key={g} className="badge-gold">{g}</span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <span className="text-[#D4AF37] font-bold">{rating} / 10</span>
              <span className="text-gray-400">{year}</span>
              {series.number_of_seasons > 0 && (
                <span className="text-gray-400">{series.number_of_seasons} season{series.number_of_seasons !== 1 ? 's' : ''}</span>
              )}
            </div>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              {series.overview || 'No description available.'}
            </p>
          </div>

          <GenreRecommendations item={series} mediaType="tv" />
        </div>
      </div>
    </>
  )
}
