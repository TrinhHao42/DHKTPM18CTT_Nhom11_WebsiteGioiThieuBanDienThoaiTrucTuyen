import React, { useState, useEffect } from 'react'
import { FaUser, FaPaperPlane, FaTimes } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { getUserFromLocalStorage } from '@/lib/utils'

type ReplyFormProps = {
  commentId?: number
  parentDisplayName: string
  onCancel: () => void
  onReplySubmit?: (replyData: {
    commentId: number
    content: string
    displayName: string
  }) => void
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
  commentId,
  parentDisplayName,
  onCancel,
  onReplySubmit
}) => {
  const [replyContent, setReplyContent] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const isLoggedIn = getUserFromLocalStorage() !== null
  const user = getUserFromLocalStorage()

  useEffect(() => {
    if (isLoggedIn && user?.userName) {
      setDisplayName(user.userName)
    } else {
      setDisplayName('Người dùng ẩn danh')
    }
  }, [isLoggedIn, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!replyContent.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi')
      return
    }

    if (replyContent.trim().length < 5) {
      toast.error('Nội dung phản hồi phải có ít nhất 5 ký tự')
      return
    }

    if (!displayName.trim()) {
      toast.error('Vui lòng nhập tên hiển thị')
      return
    }

    setSubmitting(true)

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (onReplySubmit && commentId) {
        onReplySubmit({
          commentId,
          content: replyContent.trim(),
          displayName: displayName.trim()
        })
      }

      toast.success('Phản hồi đã được gửi thành công!')
      setReplyContent('')
      onCancel()

    } catch (error) {
      console.error('Error submitting reply:', error)
      toast.error('Không thể gửi phản hồi. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-dashed border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <FaUser className="text-blue-600" />
        <span className="text-sm font-medium text-gray-700">
          Phản hồi cho <span className="text-blue-600 font-semibold">{parentDisplayName}</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input (if not logged in) */}
        {!isLoggedIn && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên của bạn *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Nhập tên hiển thị của bạn"
              required
            />
          </div>
        )}

        {/* Reply Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung phản hồi *
          </label>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Viết phản hồi của bạn..."
            required
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <div className="text-xs text-gray-500">
              Ít nhất 5 ký tự
            </div>
            <div className={`text-xs font-medium ${replyContent.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
              {replyContent.length}/500
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !replyContent.trim() || (!isLoggedIn && !displayName.trim())}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Đang gửi...
              </>
            ) : (
              <>
                <FaPaperPlane className="w-3 h-3" />
                Gửi phản hồi
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-3 h-3" />
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}