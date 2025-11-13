import React from 'react'

interface LoadingSkeletonProps {
  count?: number
  height?: string
  className?: string
}

export default function LoadingSkeleton({ 
  count = 1, 
  height = 'h-4', 
  className = '' 
}: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-300 rounded ${height} ${className}`}
        />
      ))}
    </>
  )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-300 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <LoadingSkeleton height="h-6" />
        <LoadingSkeleton height="h-4" count={2} />
        <div className="flex justify-between items-center">
          <LoadingSkeleton height="h-6" className="w-20" />
          <LoadingSkeleton height="h-8" className="w-16" />
        </div>
      </div>
    </div>
  )
}

// Grid Loading Skeleton
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}