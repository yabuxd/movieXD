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
          bg: '#0A0F1E',
          surface: '#141B2D',
          card: '#1B2540',
          cyan: '#06B6D4',
          purple: '#8B5CF6',
          text: '#F8FAFC',
          muted: '#94A3B8',
          border: 'rgba(255,255,255,0.08)',
          // legacy aliases for gradual migration
          dark: '#0A0F1E',
          accent: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, rgba(10,15,30,0.95) 0%, rgba(10,15,30,0.55) 50%, transparent 100%)',
        'hero-bottom': 'linear-gradient(to top, #0A0F1E 0%, transparent 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(10,15,30,0.95) 0%, transparent 60%)',
        'anime-gradient': 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.2) 100%)',
        'cinematic-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(6,182,212,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 24px rgba(6, 182, 212, 0.25)',
        'glow-cyan-lg': '0 0 40px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 24px rgba(139, 92, 246, 0.3)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.5), 0 0 24px rgba(6, 182, 212, 0.15)',
        'nav': '0 4px 24px rgba(0, 0, 0, 0.3)',
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
