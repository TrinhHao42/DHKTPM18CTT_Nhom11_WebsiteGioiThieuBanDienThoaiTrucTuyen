import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { CommentItem } from './CommentItem'
import { CommentsPageResponse } from '@/types/Comment'

interface CommentListProps {
  commentsData: CommentsPageResponse | null
  loading: boolean
  loadingMore: boolean
  onLoadMore: () => void
  onImageClick?: (url: string) => void
  onRefresh?: () => void
}

export const CommentList: React.FC<CommentListProps> = ({
  commentsData,
  loading,
  loadingMore,
  onLoadMore,
  onImageClick,
  onRefresh
}) => {
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3)
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="border-b pb-4 mb-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!commentsData) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Không thể tải bình luận</p>
      </div>
    )
  }

  return (
    <div>
      {/* Comments Header */}
      {commentsData.comments.length > 0 && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Đánh giá từ khách hàng ({commentsData.totalElements})
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mới nhất
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Comments */}
        {commentsData.comments.slice(0, visibleCommentsCount).map((comment, index) => (
          <CommentItem 
            key={comment.id || index} 
            comment={comment}
            onImageClick={onImageClick}
            onImageDeleted={() => {
              if (onRefresh) {
                onRefresh()
              }
            }}
          />
        ))}

        {/* Local Load More Button (first 5 comments) */}
        {visibleCommentsCount < commentsData.comments.length && (
          <div className="text-center pt-6">
            <button
              onClick={() => setVisibleCommentsCount(prev => Math.min(prev + 3, commentsData.comments.length))}
              className="bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-blue-700 font-medium px-8 py-4 rounded-xl transition-all duration-200 flex items-center gap-3 mx-auto border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
            >
              <span>Xem thêm {Math.min(5, commentsData.comments.length - visibleCommentsCount)} đánh giá</span>
              <FaChevronDown />
            </button>
          </div>
        )}

        {/* API Load More Button (when all current comments are shown) */}
        {visibleCommentsCount >= commentsData.comments.length && commentsData.hasNext && (
          <div className="text-center pt-6">
            <button
              onClick={() => {
                onLoadMore()
                setVisibleCommentsCount(prev => prev + 5) // Prepare for new comments
              }}
              disabled={loadingMore}
              className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-medium px-8 py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 mx-auto border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-600 border-t-transparent"></div>
                  Đang tải thêm từ server...
                </>
              ) : (
                <>
                  <span>Tải thêm đánh giá từ server</span>
                  <FaChevronDown />
                </>
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {commentsData.comments.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7m0 0v10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có đánh giá nào
            </h3>
            <p className="text-gray-600 mb-4">
              Sản phẩm này chưa có đánh giá từ khách hàng.
            </p>
            <p className="text-blue-600 font-medium">
              Hãy là người đầu tiên chia sẻ trải nghiệm!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}