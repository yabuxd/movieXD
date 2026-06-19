import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const GENRE_COLORS = {
  28: 'from-[#2d1414] to-[#121212] hover:from-[#3d1a1a]', // Action (Dark Crimson)
  12: 'from-[#221c10] to-[#121212] hover:from-[#302716]', // Adventure (Dark Bronze)
  16: 'from-brand-gold-muted/20 to-brand-surface hover:from-brand-gold-muted/30', // Animation/Anime (Muted Gold)
  35: 'from-[#2d2a14] to-[#121212] hover:from-[#3d391a]', // Comedy (Dark Yellow-Amber)
  80: 'from-[#1b1c1e] to-[#080808] hover:from-[#25272a]', // Crime (Dark Charcoal)
  99: 'from-[#14232d] to-[#121212] hover:from-[#1b303d]', // Documentary (Dark Slate Blue)
  18: 'from-[#25142d] to-[#121212] hover:from-[#331c3d]', // Drama (Dark Purple-Grey)
  10751: 'from-[#142d20] to-[#121212] hover:from-[#1b3d2c]', // Family (Dark Pine)
  14: 'from-[#2d1425] to-[#121212] hover:from-[#3d1c33]', // Fantasy (Dark Magenta-Grey)
  36: 'from-[#2d2214] to-[#121212] hover:from-[#3d2e1b]', // History (Dark Sepia)
  27: 'from-[#1f0a0a] to-[#080808] hover:from-[#2d0f0f]', // Horror (Dark Blood Red)
  10402: 'from-[#142d2c] to-[#121212] hover:from-[#1b3d3c]', // Music (Dark Teal-Grey)
  9648: 'from-[#1d1b22] to-[#080808] hover:from-[#27242e]', // Mystery (Dark Shadow)
  10749: 'from-[#3a1420] to-[#121212] hover:from-[#4d1b2b]', // Romance (Dark Rose)
  878: 'from-[#141b2d] to-[#121212] hover:from-[#1b253d]', // Sci-Fi (Dark Cosmic Blue)
  10770: 'from-[#2a2a2a] to-[#121212] hover:from-[#353535]', // TV Movie (Dark Grey)
  53: 'from-[#2d1a14] to-[#121212] hover:from-[#3d231b]', // Thriller (Dark Rust)
  10752: 'from-[#202422] to-[#121212] hover:from-[#2b302e]', // War (Dark Olive/Steel)
  37: 'from-[#2a1e14] to-[#121212] hover:from-[#38281b]', // Western (Dark Clay)
}

export default function GenreCard({ genre }) {
  const isAnime = genre.id === 16
  const gradient = GENRE_COLORS[genre.id] || 'from-brand-gold/10 to-brand-surface'

  return (
    <Link to={`/genre/${genre.id}`}>
      <motion.div
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`relative h-32 rounded-2xl overflow-hidden shadow-card bg-gradient-to-br ${gradient} p-4 flex items-end cursor-pointer group border border-white/[0.08] hover:border-brand-gold/40 transition-all duration-300 ${
          isAnime ? 'ring-1 ring-brand-gold-muted/30' : ''
        }`}
      >
        <div className="absolute inset-0 bg-brand-bg/20 group-hover:bg-transparent transition-colors duration-300" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow-gold" />
        <span className="relative z-10 text-brand-text font-bold text-lg drop-shadow-md tracking-wide">
          {genre.name}
        </span>
        {isAnime && (
          <span className="absolute top-3 right-3 badge-gold-muted text-[9px]">Anime</span>
        )}
      </motion.div>
    </Link>
  )
}
