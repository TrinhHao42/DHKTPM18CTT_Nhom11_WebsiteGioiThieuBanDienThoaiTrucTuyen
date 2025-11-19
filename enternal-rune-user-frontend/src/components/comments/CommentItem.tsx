import React from 'react'
import { FaUser, FaCalendarAlt } from 'react-icons/fa'
import Image from 'next/image'
import { StarRating } from '@/components/ui/StarRating'
import { CommentResponse } from '@/types/Comment'

interface CommentItemProps {
  comment: CommentResponse
  onImageClick?: (url: string) => void
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onImageClick }) => {
  const displayName = comment.displayName || comment.username || 'Ẩn danh'
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Comment Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-sm">
          <FaUser className="text-white text-lg" />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="font-bold text-gray-900 text-lg">{displayName}</span>
            <div className="flex items-center gap-2">
              <StarRating rating={comment.rating} size="sm" />
              <span className="text-sm font-medium text-gray-600">
                {comment.rating}/5
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <FaCalendarAlt />
            <span>{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>Đã mua hàng</span>
          </div>

          {/* Comment Content */}
          {comment.content && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border-l-4 border-blue-400">
              <p className="text-gray-800 leading-relaxed">{comment.content}</p>
            </div>
          )}

          {/* Comment Images */}
          {comment.images && comment.images.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Hình ảnh từ khách hàng:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {comment.images.map((image, imgIndex) => (
                  <div key={image.id || imgIndex} className="relative group">
                    <Image
                      src={image.url}
                      alt={image.fileName}
                      width={120}
                      height={120}
                      className="w-full h-24 object-cover rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={() => onImageClick ? onImageClick(image.url) : window.open(image.url, '_blank')}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Helpful Actions */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Hữu ích
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Báo cáo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}