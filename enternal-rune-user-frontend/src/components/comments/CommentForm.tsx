import React from 'react'
import { FaImage, FaTimes } from 'react-icons/fa'
import Image from 'next/image'
import { StarRating } from '@/components/ui/StarRating'
import { useCommentForm } from '@/hooks/useCommentForm'
import { CommentsPageResponse } from '@/types/Comment'
import { getUserFromLocalStorage } from '@/lib/utils'

interface CommentFormProps {
  productId: string | number
  commentsData: CommentsPageResponse | null
  setCommentsData: (data: CommentsPageResponse | null | ((prev: CommentsPageResponse | null) => CommentsPageResponse | null)) => void
  onSuccess?: () => void
}

export const CommentForm: React.FC<CommentFormProps> = ({
  productId,
  commentsData,
  setCommentsData,
  onSuccess
}) => {
  const {
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
    displayName,
    setDisplayName,
    images,
    submitting,
    fileInputRef,
    handleSubmit,
    handleImageUpload,
    removeImage
  } = useCommentForm({
    productId,
    commentsData,
    setCommentsData,
    onSuccess
  })

  const isLoggedIn = getUserFromLocalStorage() !== null

  // Keep displayName in sync with the localStorage user value when login state changes.
  // This ensures the input shows the authorized user's name immediately when they log in.
  React.useEffect(() => {
    const user = getUserFromLocalStorage()
    if (user) {
      setDisplayName(user.userName)
    } else {
      setDisplayName('Người dùng ẩn danh')
    }
  }, [isLoggedIn, setDisplayName])

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border-2 border-dashed border-blue-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Chia sẻ đánh giá của bạn</h3>
          <p className="text-gray-600">Giúp khách hàng khác bằng trải nghiệm thực tế của bạn</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Input */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Đánh giá của bạn *
          </label>
          <div className="flex flex-col items-center gap-3">
            <StarRating
              rating={hoverRating || rating}
              interactive
              onRatingChange={setRating}
              onHover={setHoverRating}
              onLeave={() => setHoverRating(0)}
            />
            <div className="text-sm text-gray-600">
              {rating > 0 && (
                <span className="font-medium">
                  {rating === 1 && 'Rất tệ'}
                  {rating === 2 && 'Tệ'}
                  {rating === 3 && 'Bình thường'}
                  {rating === 4 && 'Tốt'}
                  {rating === 5 && 'Xuất sắc'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Name Input */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Tên của bạn {isLoggedIn ? '' : '*'}
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isLoggedIn}
            className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
              isLoggedIn ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
            placeholder={isLoggedIn ? 'Tên đã được tự động điền' : 'Nhập tên hiển thị của bạn'}
            required={!isLoggedIn}
          />
          {isLoggedIn && (
            <p className="text-sm text-green-600 mt-2">
              ✓ Bạn đã đăng nhập với tên: <span className="font-medium">{displayName}</span>
            </p>
          )}
        </div>

        {/* Comment Input */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Nội dung đánh giá *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl h-32 resize-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="Hãy chia sẻ trải nghiệm chi tiết về sản phẩm - chất lượng, tính năng, dịch vụ..."
            required
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500">
              Ít nhất 10 ký tự để đánh giá có ý nghĩa
            </div>
            <div className={`text-sm font-medium ${comment.length > 900 ? 'text-red-500' : 'text-gray-500'}`}>
              {comment.length}/1000
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Thêm hình ảnh thực tế 
            <span className="text-sm font-normal text-gray-500 ml-2">(Tùy chọn)</span>
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Bạn có thể tải lên tối đa 6 ảnh để chia sẻ trải nghiệm trực quan. 
            <span className="font-medium text-blue-600"> Không bắt buộc phải có ảnh</span> để gửi đánh giá.
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 6}
            className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-blue-600 font-medium w-full justify-center"
          >
            <FaImage className="text-xl" />
            <span>
              {images.length === 0 ? 'Chọn ảnh từ thiết bị' : `Đã chọn ${images.length}/6 ảnh`}
            </span>
          </button>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={image.previewUrl}
                    alt={`Preview ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting || !rating || !comment.trim() || (!isLoggedIn && !displayName.trim())}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Đang gửi đánh giá...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {images.length > 0 
                  ? `Gửi đánh giá với ${images.length} ảnh` 
                  : 'Gửi đánh giá'
                }
              </div>
            )}
          </button>
          
          {(!rating || !comment.trim() || (!isLoggedIn && !displayName.trim())) && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Vui lòng điền đầy đủ thông tin bắt buộc: <span className="font-medium">
                {[
                  !rating && 'Đánh giá sao',
                  !comment.trim() && 'Nội dung',
                  (!isLoggedIn && !displayName.trim()) && 'Tên hiển thị'
                ].filter(Boolean).join(', ')}
              </span>
            </p>
          )}
          
          {(rating && comment.trim() && (isLoggedIn || displayName.trim())) && (
            <p className="text-center text-sm text-green-600 mt-3 font-medium">
              ✓ Sẵn sàng gửi đánh giá {images.length > 0 ? `(có ${images.length} ảnh)` : '(không có ảnh)'}
            </p>
          )}
        </div>
      </form>
    </div>
    </div>
  )
}