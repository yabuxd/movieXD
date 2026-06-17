export default function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-36 sm:w-44 md:w-48">
      {/* Poster Skeleton */}
      <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-800 animate-pulse shadow-lg">
      </div>

      {/* Title + Year + Genres Skeletons */}
      <div className="mt-2.5 px-0.5 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4 animate-pulse"></div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="h-3 bg-gray-800 rounded w-1/4 animate-pulse"></div>
          <div className="h-3 bg-gray-800 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
