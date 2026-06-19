/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080808',
          surface: '#121212',
          card: '#1A1A1A',
          elevated: '#222222',
          gold: '#D4AF37',
          'gold-hover': '#E6C55A',
          'gold-muted': '#B38A2F',
          text: '#F5F5F5',
          muted: '#9E9E9E',
          border: 'rgba(255,255,255,0.08)',
          // legacy aliases for gradual migration
          cyan: '#D4AF37',
          purple: '#B38A2F',
          dark: '#080808',
          accent: '#D4AF37',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.4) 100%)',
        'hero-bottom': 'linear-gradient(to top, #080808 0%, transparent 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, transparent 60%)',
        'anime-gradient': 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(179,138,47,0.2) 100%)',
        'cinematic-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(179,138,47,0.04) 0%, transparent 50%)',
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.2)',
        'glow-gold-lg': '0 0 35px rgba(212, 175, 55, 0.3)',
        'glow-cyan': '0 0 20px rgba(212, 175, 55, 0.2)',
        'glow-cyan-lg': '0 0 35px rgba(212, 175, 55, 0.3)',
        'glow-purple': '0 0 20px rgba(179, 138, 47, 0.15)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(212, 175, 55, 0.12)',
        'nav': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
