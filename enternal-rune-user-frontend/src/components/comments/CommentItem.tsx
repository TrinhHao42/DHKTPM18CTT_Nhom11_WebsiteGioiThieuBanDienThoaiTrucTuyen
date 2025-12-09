import React, { useState, useEffect } from 'react'
import { FaUser, FaCalendarAlt, FaReply } from 'react-icons/fa'
import Image from 'next/image'
import { StarRating } from '@/components/ui/StarRating'
import { CommentResponse, CommentStatus } from '@/types/Comment'


import { ReplyForm } from './ReplyForm'
import { ReplyService } from '@/services/replyService'
import { CommentService } from '@/services/commentService'

import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
interface CommentItemProps {
  comment: CommentResponse
  onImageClick?: (url: string) => void
  onImageDeleted?: (imageId: number) => void
  preloadedReplies?: CommentResponse[] // Replies đã được load từ parent để tránh call API nhiều lần
  repliesLoaded?: boolean // Trạng thái load replies
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onImageClick, onImageDeleted, preloadedReplies = [], repliesLoaded: repliesLoadedFromParent = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [localReplies, setLocalReplies] = useState<CommentResponse[]>(comment.replies || [])
  // Sử dụng hasPurchased từ backend response thay vì check ở frontend
  const hasPurchased = comment.hasPurchased ?? null // Backend trả về purchase status của comment author
  const displayName = comment.displayName || comment.username || 'Ẩn danh'
  const router = useRouter()




  // Use preloaded replies from parent; do not call API in this component
  useEffect(() => {
    if (repliesLoadedFromParent) {
      // Use preloaded replies from parent
      setLocalReplies(preloadedReplies)
      return
    }
    setLocalReplies(comment.replies || [])
  }, [comment.replies, preloadedReplies, repliesLoadedFromParent])



  const handleDeleteImage = async (event: React.MouseEvent, imageId: number | undefined) => {
    event.preventDefault()
    event.stopPropagation()

    if (!imageId) {
      toast.error('ID ảnh không hợp lệ')
      return
    }

    if (!confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
      return
    }

    try {
      await CommentService.deleteCommentImage(imageId)
      toast.success('Đã xóa ảnh thành công')

      // Call callback to refresh comment data if provided
      if (onImageDeleted) {
        onImageDeleted(imageId)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Không thể xóa ảnh. Vui lòng thử lại.')
      }
    }
  }

  const handleReplySubmit = async (replyData: {
    commentId?: number
    content: string
    displayName: string
  }) => {
    if (!comment.id) {
      toast.error('Không thể phản hồi: ID bình luận không hợp lệ')
      return
    }

    // Generate unique temporary ID for optimistic update
    const optimisticId = -Date.now() // Use negative number for temporary IDs

    try {
      // Tạo reply optimistic (hiển thị ngay trên UI)
      const optimisticReply: CommentResponse = {
        id: optimisticId, // Temporary unique ID (negative number)
        content: replyData.content,
        rating: 0, // Replies không có rating
        displayName: replyData.displayName,
        isAnonymous: false,
        status: CommentStatus.APPROVED,
        createdAt: new Date().toISOString(),
        productId: comment.productId,
        parentCommentId: comment.id,
        images: []
      }

      // Thêm optimistic reply vào UI ngay lập tức
      setLocalReplies(prev => [...prev, optimisticReply])
      setShowReplyForm(false)

      // Gọi API thực tế
      const actualReply = await ReplyService.postReply(
        comment.productId,
        comment.id,
        {
          content: replyData.content,
          displayName: replyData.displayName
        }
      )
      setLocalReplies(prev => {
        // Check if actual reply already exists (to prevent duplicates)
        const hasActualReply = prev.some(reply => reply.id === actualReply.id)
        if (hasActualReply) {
          return prev.filter(reply => reply.id !== optimisticId)
        }

        return prev.map(reply =>
          reply.id === optimisticId ? {
            ...actualReply,
            // Ensure proper display  
            id: actualReply.id,
            content: actualReply.content,
            displayName: actualReply.displayName,
            createdAt: actualReply.createdAt,
            parentCommentId: actualReply.parentCommentId
          } : reply
        )
      })

      toast.success('Phản hồi đã được gửi thành công!')

    } catch (error) {
      setLocalReplies(prev =>
        prev.filter(reply => reply.id !== optimisticId)
      )

      const errorMessage = error instanceof Error ? error.message : 'Không thể gửi phản hồi. Vui lòng thử lại.'
      toast.error(errorMessage)
      setShowReplyForm(true) // Re-open form on error
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* Comment Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-sm">
          <FaUser className="text-white text-lg" />
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-900 text-lg">{displayName}</span>
              {/* Badge hiển thị trạng thái mua hàng */}
              {hasPurchased === true ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Đã mua hàng
                </span>
              ) : hasPurchased === false ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  Chưa mua hàng
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Đang kiểm tra...
                </span>
              )}
            </div>
            {/* Chỉ hiển thị rating nếu đã mua hàng */}
            {hasPurchased === true && comment.rating && comment.rating > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={comment.rating} size="sm" />
                <span className="text-sm font-medium text-gray-600">
                  {comment.rating}/5
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <FaCalendarAlt />
            <span>{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
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
                      className="w-full min-h-28 object-cover rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={() => onImageClick ? onImageClick(image.url) : window.open(image.url, '_blank')}
                    />

                    {/* Zoom overlay */}
                    <div className="absolute inset-0 bg-black/20 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>

                    {/* Delete button - only show for comment owner or when developing */}
                    {(comment.username || process.env.NODE_ENV === 'development') && (
                      <button
                        onClick={(e) => handleDeleteImage(e, image.id)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs font-medium"
                        title="Xóa ảnh"
                      >
                        ×
                      </button>
                    )}
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

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
            >
              <FaReply className="w-3 h-3" />
              Phản hồi
            </button>

            <button
              onClick={() => router.push(`/AssistanceChatScreen`)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Báo cáo
            </button>
          </div>

          {/* Replies Section */}
          {localReplies.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaReply className="w-3 h-3" />
                <span>{localReplies.length} phản hồi</span>
              </div>

              {localReplies.map((reply, index) => (
                <div key={`reply-${reply.id || `temp-${index}`}`} className="bg-gray-50 rounded-xl p-4 border-l-4 border-green-400">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                      <FaUser className="text-white text-sm" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                          {reply.displayName || 'Ẩn danh'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>

                      {reply.content && (
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {reply.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <ReplyForm
              commentId={comment.id}
              parentDisplayName={displayName}
              onCancel={() => setShowReplyForm(false)}
              onReplySubmit={handleReplySubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}