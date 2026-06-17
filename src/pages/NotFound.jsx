import { Link, useLocation } from 'react-router-dom'

export default function NotFound() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-brand-purple/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">
        <div className="relative mb-6">
          <p
            className="text-[10rem] sm:text-[14rem] font-black leading-none select-none text-gradient"
            style={{ WebkitTextFillColor: 'transparent' }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl glass border border-brand-cyan/30 flex items-center justify-center shadow-glow-cyan">
              <svg className="w-10 h-10 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-3">
          Scene Not Found
        </h1>
        <p className="text-brand-muted text-base mb-2 leading-relaxed">
          Looks like this page got cut from the final edit.
        </p>
        {location.pathname && (
          <p className="text-brand-muted/60 text-sm font-mono mb-8 px-3 py-1 glass rounded-lg inline-block">
            {location.pathname}
          </p>
        )}

        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <Link to="/" id="notfound-home-btn" className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link to="/search" id="notfound-browse-btn" className="btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Movies
          </Link>
        </div>
      </div>
    </div>
  )
}
