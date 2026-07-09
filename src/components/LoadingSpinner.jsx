export default function LoadingSpinner({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-5 w-5' : 'h-12 w-12'
  const padding = size === 'sm' ? 'py-0' : 'py-12'

  return (
    <div className={`flex justify-center items-center ${padding} w-full h-full`}>
      <div className="relative">
        <div className={`animate-spin rounded-full border-2 border-brand-surface border-t-brand-gold border-r-brand-gold-muted ${sizeClass}`} />
        {size !== 'sm' && <div className="absolute inset-0 rounded-full shadow-glow-gold opacity-50" />}
      </div>
    </div>
  )
}
