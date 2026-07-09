import { useState } from 'react'
import { tmdbImageUrl, POSTER } from '../utils/tmdbImages'
import { formatRuntime } from '../utils/media'
import LoadingSpinner from './LoadingSpinner'

export default function EpisodeSidebar({
  seasons = [],
  episodesBySeason = {},
  loadingSeasons = {},
  selectedEpisode,
  onSelectEpisode,
  onExpandSeason,
  isOpen,
  onToggle,
}) {
  const [expandedSeasons, setExpandedSeasons] = useState(() => {
    const first = seasons.find((s) => s.season_number > 0)
    return first ? new Set([first.season_number]) : new Set()
  })

  const toggleSeason = (seasonNumber) => {
    setExpandedSeasons((prev) => {
      const next = new Set(prev)
      if (next.has(seasonNumber)) {
        next.delete(seasonNumber)
      } else {
        next.add(seasonNumber)
        onExpandSeason?.(seasonNumber)
      }
      return next
    })
  }

  const playableSeasons = seasons.filter((s) => s.season_number > 0 && s.episode_count > 0)

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
          <h2 className="text-white font-bold text-sm uppercase tracking-wider">Episodes</h2>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {playableSeasons.map((season) => {
            const isExpanded = expandedSeasons.has(season.season_number)
            const episodes = episodesBySeason[season.season_number] || []
            const isLoading = loadingSeasons[season.season_number]

            return (
              <div key={season.season_number} className="border-b border-brand-border/50 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleSeason(season.season_number)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-semibold text-sm">
                    Season {season.season_number}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {season.episode_count} eps
                  </span>
                </button>

                {isExpanded && (
                  <div className="pb-2">
                    {isLoading ? (
                      <div className="flex justify-center py-4">
                        <LoadingSpinner />
                      </div>
                    ) : (
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
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </aside>
    </>
  )
}
