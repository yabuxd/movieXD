import LoadingSpinner from './LoadingSpinner'

export default function VideoPlayer({
  title,
  embedUrl,
  isResolving,
  error,
  source,
  sources,
  onSwitchSource,
  className = '',
}) {
  return (
    <div className={`relative w-full h-full bg-black flex flex-col ${className}`}>
      {!isResolving && sources && (sources.archive || sources.youtube || sources.trailer) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-brand-bg/90 border-b border-brand-border flex-wrap shrink-0">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Source:</span>
          {sources.archive && (
            <button
              type="button"
              onClick={() => onSwitchSource?.('archive')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                source === 'archive'
                  ? 'bg-brand-gold text-brand-bg border-brand-gold'
                  : 'bg-transparent text-gray-400 border-gray-600 hover:text-white'
              }`}
            >
              Archive.org
            </button>
          )}
          {sources.youtube && (
            <button
              type="button"
              onClick={() => onSwitchSource?.('youtube')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                source === 'youtube'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-transparent text-gray-400 border-gray-600 hover:text-white'
              }`}
            >
              YouTube
            </button>
          )}
          {sources.trailer && (
            <button
              type="button"
              onClick={() => onSwitchSource?.('trailer')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                source === 'trailer'
                  ? 'bg-brand-gold-muted/10 text-brand-gold-muted border-brand-gold-muted/30'
                  : 'bg-transparent text-gray-400 border-gray-600 hover:text-white'
              }`}
            >
              Trailer
            </button>
          )}
        </div>
      )}

      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        {isResolving ? (
          <div className="flex flex-col items-center gap-3 p-8">
            <LoadingSpinner />
            <p className="text-brand-gold font-semibold text-sm animate-pulse">
              Finding full-length playback...
            </p>
          </div>
        ) : error ? (
          <div className="text-center p-6">
            <p className="text-red-500 font-bold mb-2">{error}</p>
            {sources?.trailer && (
              <button type="button" onClick={() => onSwitchSource?.('trailer')} className="btn-primary mt-2">
                Play Trailer
              </button>
            )}
          </div>
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p className="text-gray-500">Initializing player...</p>
        )}
      </div>
    </div>
  )
}
