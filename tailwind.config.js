/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          card: 'var(--color-surface)',
          elevated: 'var(--color-surface)',
          gold: 'var(--color-accent)',
          'gold-hover': 'var(--color-accent-hover)',
          'gold-muted': 'var(--color-accent-muted)',
          text: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          border: 'var(--color-border)',
          cyan: 'var(--color-accent)',
          purple: 'var(--color-accent-muted)',
          dark: 'var(--color-bg)',
          accent: 'var(--color-accent)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, var(--color-bg) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)',
        'hero-bottom': 'linear-gradient(to top, var(--color-bg) 0%, transparent 100%)',
        'card-gradient': 'linear-gradient(to top, var(--color-bg) 0%, transparent 60%)',
        'anime-gradient': 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.2) 100%)',
        'cinematic-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(212, 175, 55, 0.04) 0%, transparent 50%)',
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.2)',
        'glow-gold-lg': '0 0 35px rgba(212, 175, 55, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.2)',
        'glow-cyan-lg': '0 0 35px rgba(0, 255, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(128, 0, 128, 0.15)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 16px 48px rgba(0, 0, 0, 0.15), 0 0 24px rgba(212, 175, 55, 0.12)',
        'nav': '0 4px 24px rgba(0, 0, 0, 0.05)',
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
