export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12 w-full h-full">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-brand-surface border-t-brand-cyan border-r-brand-purple" />
        <div className="absolute inset-0 rounded-full shadow-glow-cyan opacity-50" />
      </div>
    </div>
  )
}
