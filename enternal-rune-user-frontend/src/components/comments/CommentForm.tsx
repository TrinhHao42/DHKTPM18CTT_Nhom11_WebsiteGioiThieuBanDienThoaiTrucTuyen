import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { StarRating } from '@/components/ui/StarRating'
import { useCommentForm } from '@/hooks/useCommentForm'
import { CommentsPageResponse } from '@/types/Comment'
import { getUserFromLocalStorage } from '@/lib/utils'
import UploadImage from './UploadImage'

// Validation schema
// Schema động: nếu chưa mua thì không validate rating
const getCommentSchema = (hasPurchased: boolean) =>
  yup.object().shape({
    ...(hasPurchased ? {
      rating: yup
        .number()
        .required('Vui lòng chọn số sao đánh giá')
        .min(1, 'Vui lòng chọn ít nhất 1 sao')
        .max(5, 'Không thể chọn quá 5 sao'),
    } : {}),
    displayName: yup
      .string()
      .when('isLoggedIn', {
        is: false,
        then: (schema) => schema
          .required('Vui lòng nhập tên hiển thị')
          .min(2, 'Tên phải có ít nhất 2 ký tự')
          .max(50, 'Tên không được vượt quá 50 ký tự')
          .trim(),
        otherwise: (schema) => schema.optional()
      }),
    comment: yup
      .string()
      .required('Vui lòng nhập nội dung đánh giá')
      .min(10, 'Nội dung đánh giá phải có ít nhất 10 ký tự')
      .max(1000, 'Nội dung đánh giá không được vượt quá 1000 ký tự')
      .trim()
  })

interface CommentFormProps {
  productId: string | number
  commentsData: CommentsPageResponse | null
  setCommentsData: (data: CommentsPageResponse | null | ((prev: CommentsPageResponse | null) => CommentsPageResponse | null)) => void
  onSuccess?: () => void
  hasPurchased?: boolean // Thêm prop xác định đã mua hàng chưa,
  isPaid?: boolean // Thêm prop xác định đã thanh toán chưa
}

export const CommentForm: React.FC<CommentFormProps> = ({
  productId,
  commentsData,
  setCommentsData,
  onSuccess,
  hasPurchased,
  isPaid
}) => {
  const isLoggedIn = getUserFromLocalStorage() !== null
  const user = getUserFromLocalStorage()

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(getCommentSchema(Boolean(hasPurchased))),
    defaultValues: {
      rating: 5, // Default 5 sao thay vì 0
      displayName: isLoggedIn ? user?.userName || '' : 'Người dùng ẩn danh',
      comment: ''
    }
  })

  const ratingRaw = watch('rating')
  const rating: number = hasPurchased ? (typeof ratingRaw === 'number' ? ratingRaw : 0) : 0
  const displayName = watch('displayName')
  const comment = watch('comment')
  const [hoverRating, setHoverRating] = React.useState(0)

  const {
    images,
    submitting,
    fileInputRef,
    handleImageUpload,
    removeImage,
    handleSubmit: submitComment
  } = useCommentForm({
    productId,
    commentsData,
    setCommentsData,
    onSuccess,
    onReset: () => {
      // Reset react-hook-form về default values
      setValue('rating', 5) 
      setValue('comment', '')
    }
  })

  // Update displayName when login state changes
  useEffect(() => {
    if (isLoggedIn && user?.userName) {
      setValue('displayName', user.userName)
    } else if (!isLoggedIn) {
      setValue('displayName', 'Người dùng ẩn danh')
    }
  }, [isLoggedIn, user?.userName, setValue])

  // Custom submit handler that integrates with existing logic
  const onSubmit = async (data: { rating?: unknown; displayName?: string; comment: string }) => {
    const fakeEvent = {
      preventDefault: () => { },
      target: document.createElement('form')
    } as unknown as React.FormEvent

    // Nếu chưa mua thì không truyền rating (rating = null hoặc undefined)
    await submitComment(fakeEvent, {
      rating: hasPurchased ? (typeof data.rating === 'number' ? data.rating : 5) : null,
      comment: data.comment.trim(),
      displayName: data.displayName?.trim() || 'Người dùng ẩn danh'
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border-2 border-dashed border-blue-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Chia sẻ đánh giá của bạn</h3>
          <p className="text-gray-600">Giúp khách hàng khác bằng trải nghiệm thực tế của bạn</p>
          {isPaid === false && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center justify-center gap-2 text-orange-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Bạn chưa mua sản phẩm này</span>
              </div>
              <p className="text-sm text-orange-600 mt-2">Bạn có thể chia sẻ bình luận nhưng không thể đánh giá sao. Chỉ khách hàng đã mua hàng mới có thể đánh giá sao để đảm bảo độ chính xác.</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating Input: chỉ hiển thị nếu đã mua hàng */}
          {isPaid && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Đánh giá của bạn *
              </label>
              <div className="flex flex-col items-center gap-3">
                <StarRating
                  rating={hoverRating || rating}
                  interactive
                  onRatingChange={(newRating) => setValue('rating', newRating)}
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
                {errors.rating && (
                  <p className="text-sm text-red-500">{errors.rating.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Name Input */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Tên của bạn {isLoggedIn ? '' : '*'}
            </label>
            <input
              {...register('displayName')}
              type="text"
              disabled={isLoggedIn}
              className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${isLoggedIn ? 'bg-gray-50 cursor-not-allowed' : ''
                } ${errors.displayName ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : ''}`}
              placeholder={isLoggedIn ? 'Tên đã được tự động điền' : 'Nhập tên hiển thị của bạn'}
              required={!isLoggedIn}
            />
            {errors.displayName && (
              <p className="text-sm text-red-500 mt-2">{errors.displayName.message}</p>
            )}
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
              {...register('comment')}
              className={`w-full p-4 border-2 border-gray-200 rounded-xl h-32 resize-none focus:ring-3 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 ${errors.comment ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : ''
                }`}
              placeholder="Hãy chia sẻ trải nghiệm chi tiết về sản phẩm - chất lượng, tính năng, dịch vụ..."
              required
              maxLength={1000}
            />
            {errors.comment && (
              <p className="text-sm text-red-500 mt-2">{errors.comment.message}</p>
            )}
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                Ít nhất 10 ký tự để đánh giá có ý nghĩa
              </div>
              <div className={`text-sm font-medium ${comment?.length > 900 ? 'text-red-500' : 'text-gray-500'}`}>
                {comment?.length || 0}/1000
              </div>
            </div>
          </div>

          <UploadImage
            images={images}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || isSubmitting || (hasPurchased && !rating) || !comment?.trim() || (!isLoggedIn && !displayName?.trim())}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {submitting || isSubmitting ? (
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

            {((hasPurchased && !rating) || !comment?.trim() || (!isLoggedIn && !displayName?.trim())) && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Vui lòng điền đầy đủ thông tin bắt buộc: <span className="font-medium">
                  {[
                    (hasPurchased && !rating) && 'Đánh giá sao',
                    !comment?.trim() && 'Nội dung',
                    (!isLoggedIn && !displayName?.trim()) && 'Tên hiển thị'
                  ].filter(Boolean).join(', ')}
                </span>
              </p>
            )}

            {((!hasPurchased || rating) && comment?.trim() && (isLoggedIn || displayName?.trim())) && (
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