const LoadingSkeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
  )
}

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <LoadingSkeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-6 w-1/2" />
        <LoadingSkeleton className="h-3 w-full" />
        <div className="flex justify-between">
          <LoadingSkeleton className="h-8 w-16" />
          <LoadingSkeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

export const DashboardSkeleton = () => {
  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6">
          <LoadingSkeleton className="h-12 w-12 rounded-xl mb-4" />
          <LoadingSkeleton className="h-8 w-16 mb-2" />
          <LoadingSkeleton className="h-4 w-24" />
        </div>
        <div className="bg-white rounded-2xl p-6">
          <LoadingSkeleton className="h-12 w-12 rounded-xl mb-4" />
          <LoadingSkeleton className="h-8 w-16 mb-2" />
          <LoadingSkeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6">
        <LoadingSkeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <LoadingSkeleton className="h-24 rounded-2xl" />
          <LoadingSkeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default LoadingSkeleton