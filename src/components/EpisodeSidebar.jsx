import { useState, useEffect, useRef } from 'react'
import { tmdbImageUrl, POSTER } from '../utils/tmdbImages'
import { formatRuntime } from '../utils/media'
import LoadingSpinner from './LoadingSpinner'

export default function EpisodeSidebar({
  seasons = [],
  episodesBySeason = {},
  loadingSeasons = {},
  selectedSeason,
  onSeasonChange,
  selectedEpisode,
  onSelectEpisode,
  onExpandSeason,
  isOpen,
  onToggle,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const playableSeasons = seasons.filter((s) => s.season_number > 0 && s.episode_count > 0)
  const activeSeason = selectedSeason ?? playableSeasons[0]?.season_number ?? null
  const episodes = activeSeason != null ? episodesBySeason[activeSeason] || [] : []
  const isLoading = activeSeason != null ? loadingSeasons[activeSeason] : false

  useEffect(() => {
    if (!dropdownOpen) return

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [dropdownOpen])

  const handleSeasonSelect = (seasonNumber) => {
    setDropdownOpen(false)
    if (seasonNumber !== activeSeason) {
      onSeasonChange?.(seasonNumber)
      onExpandSeason?.(seasonNumber)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-brand-surface border border-brand-border rounded-xl mb-3 text-white font-semibold text-sm"
        aria-expanded={isOpen}
      >
        <span>Episodes</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <aside
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-80 xl:w-96 shrink-0 bg-brand-surface border border-brand-border rounded-xl overflow-hidden flex flex-col max-h-[50vh] lg:max-h-none lg:h-full`}
      >
        <div className="px-4 py-3 border-b border-brand-border shrink-0">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-2">Episodes</h2>

          {playableSeasons.length > 0 && (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-expanded={dropdownOpen}
                aria-haspopup="listbox"
                className="w-full flex items-center justify-between px-3 py-2.5 bg-brand-bg border border-brand-border rounded-lg text-left hover:border-brand-gold/40 transition-colors"
              >
                <span className="text-white font-semibold text-sm">
                  Season {activeSeason}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <ul
                  role="listbox"
                  className="absolute z-20 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-brand-bg border border-brand-border rounded-lg shadow-xl"
                >
                  {playableSeasons.map((season) => (
                    <li key={season.season_number} role="option" aria-selected={season.season_number === activeSeason}>
                      <button
                        type="button"
                        onClick={() => handleSeasonSelect(season.season_number)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                          season.season_number === activeSeason
                            ? 'bg-brand-gold/15 text-brand-gold font-semibold'
                            : 'text-white hover:bg-white/5'
                        }`}
                      >
                        <span>Season {season.season_number}</span>
                        <span className="text-gray-500 text-xs">{season.episode_count} eps</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : episodes.length > 0 ? (
            episodes.map((ep) => {
              const isSelected =
                selectedEpisode?.season_number === ep.season_number &&
                selectedEpisode?.episode_number === ep.episode_number
              const thumb = tmdbImageUrl(ep.still_path, POSTER.thumb)

              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => onSelectEpisode(ep)}
                  className={`w-full flex gap-3 px-4 py-2.5 text-left transition-colors ${
                    isSelected
                      ? 'bg-brand-gold/15 border-l-2 border-brand-gold'
                      : 'hover:bg-white/5 border-l-2 border-transparent'
                  }`}
                >
                  <div className="w-24 h-14 rounded-lg overflow-hidden bg-brand-card shrink-0">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={ep.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                        E{ep.episode_number}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold">
                      {ep.episode_number}. {ep.name}
                    </p>
                    {ep.runtime > 0 && (
                      <p className="text-gray-500 text-[10px] mt-0.5">
                        {formatRuntime(ep.runtime)}
                      </p>
                    )}
                  </div>
                </button>
              )
            })
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">No episodes available.</p>
          )}
        </div>
      </aside>
    </>
  )
}
