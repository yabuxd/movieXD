import HeroBanner from '../components/HeroBanner'
import Row from '../components/Row'
import {
  MOCK_HERO,
  MOCK_TRENDING,
  MOCK_POPULAR,
  MOCK_TOP_RATED,
  MOCK_UPCOMING,
} from '../data/mockData'

// All movies pooled together (deduplicated by id)
const ALL = [
  ...MOCK_TRENDING,
  ...MOCK_POPULAR,
  ...MOCK_TOP_RATED,
  ...MOCK_UPCOMING,
].filter((m, i, a) => a.findIndex((x) => x.id === m.id) === i)

// Helper: filter by TMDB genre id
const byGenre = (id) => ALL.filter((m) => (m.genre_ids || []).includes(id))

// Most common genre id → label pairs (TMDB standard ids)
const GENRE_ROWS = [
  { id: 28,    label: 'Action'    },
  { id: 878,   label: 'Sci-Fi'   },
  { id: 18,    label: 'Drama'    },
  { id: 35,    label: 'Comedy'   },
  { id: 53,    label: 'Thriller' },
  { id: 27,    label: 'Horror'   },
  { id: 80,    label: 'Crime'    },
  { id: 12,    label: 'Adventure'},
  { id: 16,    label: 'Animation'},
  { id: 10749, label: 'Romance'  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Hero */}
      <HeroBanner movie={MOCK_HERO} />

      {/* Primary Rows */}
      <div className="relative z-10 -mt-8 pb-4 space-y-10">
        <Row title="Trending Now"        movies={MOCK_TRENDING}  badge="Hot" />
        <Row title="Popular on CineFlow" movies={MOCK_POPULAR}              />
        <Row title="Top Rated"           movies={MOCK_TOP_RATED}            />
        <Row title="Coming Soon"         movies={MOCK_UPCOMING}  badge="New" />
      </div>

      {/* Divider */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="text-gray-600 text-xs font-semibold uppercase tracking-widest">Browse by Genre</span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>
      </div>

      {/* Genre Rows — only rendered when the genre has at least 2 movies */}
      <div className="pb-16 space-y-10">
        {GENRE_ROWS.map(({ id, label }) => {
          const movies = byGenre(id)
          if (movies.length < 2) return null
          return <Row key={id} title={label} movies={movies} />
        })}
      </div>
    </div>
  )
}
