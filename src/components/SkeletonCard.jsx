export default function SkeletonCard({ variant = 'default' }) {
  const isAnime = variant === 'anime'

  return (
    <div className="flex-shrink-0 w-40 sm:w-48 md:w-52">
      <div
        className={`relative rounded-2xl overflow-hidden aspect-[2/3] skeleton shadow-card ${
          isAnime ? 'ring-1 ring-brand-purple/10' : 'ring-1 ring-white/[0.06]'
        }`}
      />
      <div className="mt-3 px-0.5 space-y-2">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="flex items-center gap-1.5">
          <div className="h-3 skeleton rounded w-1/4" />
          <div className="h-3 skeleton rounded w-1/4" />
        </div>
      </div>
    </div>
  )
}
