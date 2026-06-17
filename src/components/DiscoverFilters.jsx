import { useEffect, useState } from 'react'
import { getGenres } from '../services/tmdb'
import { useDiscoverStore } from '../store/discoverStore'

export default function DiscoverFilters() {
  const [genres, setGenres] = useState([])
  const { filters, setFilter, toggleGenre, resetFilters } = useDiscoverStore()

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres()
        setGenres(data.genres || [])
      } catch (err) {
        console.error('Failed to load genres', err)
      }
    }
    fetchGenres()
  }, [])

  return (
    <div className="glass rounded-2xl p-6 mb-8 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Smart Discovery</h2>
        <button onClick={resetFilters} className="text-sm text-gray-400 hover:text-white transition-colors">
          Reset Filters
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Genres Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Genre</label>
            <select
              value={filters.with_genres[0] || ''}
              onChange={(e) => {
                const val = e.target.value
                setFilter('with_genres', val ? [Number(val)] : [])
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-red transition-colors"
            >
              <option value="">Any Genre</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Release Year</label>
            <select
              value={filters.primary_release_year}
              onChange={(e) => setFilter('primary_release_year', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-red transition-colors"
            >
              <option value="">Any Year</option>
              {Array.from({ length: 50 }).map((_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year}>{year}</option>
              })}
            </select>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Min Rating</label>
            <select
              value={filters['vote_average.gte']}
              onChange={(e) => setFilter('vote_average.gte', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-red transition-colors"
            >
              <option value="">Any Rating</option>
              <option value="8">8+ ⭐️</option>
              <option value="7">7+ ⭐️</option>
              <option value="6">6+ ⭐️</option>
              <option value="5">5+ ⭐️</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
            <select
              value={filters.sort_by}
              onChange={(e) => setFilter('sort_by', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-red transition-colors"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="popularity.asc">Least Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Newest</option>
              <option value="primary_release_date.asc">Oldest</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
            <select
              value={filters.with_original_language}
              onChange={(e) => setFilter('with_original_language', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-brand-red transition-colors"
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
