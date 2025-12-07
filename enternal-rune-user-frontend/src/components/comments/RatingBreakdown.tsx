import React from 'react'
import { FaStar } from 'react-icons/fa'
import { StarRating } from '@/components/ui/StarRating'

interface RatingBreakdownProps {
  ratingCounts?: Record<string, number>
  total?: number
  averageRating?: number
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ ratingCounts = {}, total = 0, averageRating = 0 }) => {
  // Always show rating breakdown, even if no ratings yet
  // Compute total number of ratings from ratingCounts (defensive in case parent passed comment count instead)
  const ratingsTotal = Object.values(ratingCounts || {}).reduce((sum, val) => {
    const n = Number(val || 0)
    return sum + (Number.isFinite(n) ? n : 0)
  }, 0) || total || 0

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Overall Rating */}
        <div className="text-center lg:text-left lg:min-w-[200px]">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0'}
            </div>
            <StarRating rating={Math.round(averageRating)} />
            <div className="text-sm text-gray-600 mt-3 font-medium">
              {ratingsTotal} {ratingsTotal === 1 ? 'đánh giá' : 'đánh giá'}
            </div>
            {ratingsTotal > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Từ khách hàng đã mua
              </div>
            )}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết đánh giá</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = (ratingCounts && ratingCounts[stars.toString()]) ? ratingCounts[stars.toString()] : 0
              const percentage = ratingsTotal > 0 && Number.isFinite(count) ? (count / ratingsTotal) * 100 : 0
              
              return (
                <div key={stars} className="flex items-center gap-3 group">
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <span className="text-sm font-medium text-gray-700">{stars}</span>
                    <FaStar className="text-yellow-500 text-sm" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out group-hover:from-yellow-500 group-hover:to-yellow-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12 text-right">
                    {count}
                  </span>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}