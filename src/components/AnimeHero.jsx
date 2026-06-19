import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AnimeHero({ movie }) {
  if (!movie) return null

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : ''

  return (
    <section className="relative mx-4 sm:mx-6 lg:mx-8 my-12 rounded-3xl overflow-hidden border border-white/[0.08] shadow-card">
      <div className="absolute inset-0 bg-anime-gradient" />

      {backdrop && (
        <img
          src={backdrop}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/90 to-brand-bg/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-brand-gold-muted/15" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 lg:p-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center md:text-left"
        >
          <span className="badge-gold mb-4 inline-flex">Featured Anime</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-text mb-4 tracking-tight">
            {movie.title}
          </h2>
          <p className="text-brand-muted text-base leading-relaxed mb-6 line-clamp-2 max-w-lg">
            {movie.overview}
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link to={`/movie/${movie.id}`} className="btn-primary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Anime
            </Link>
            <Link to="/genre/16" className="btn-secondary">
              Browse All Anime
            </Link>
          </div>
        </motion.div>

        {movie.poster_path && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex-shrink-0"
          >
            <div className="w-44 sm:w-52 rounded-2xl overflow-hidden ring-2 ring-brand-gold/30 poster-glow">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
