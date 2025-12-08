import { useState, useRef, useEffect } from 'react'
import { CommentService } from '@/services/commentService'
import { CreateCommentRequest, UploadImage, CommentResponse, CommentStatus, CommentsPageResponse } from '@/types/Comment'
import { toast } from 'react-hot-toast'
import { getUserFromLocalStorage } from '@/lib/utils'

interface UseCommentFormProps {
  productId: string | number
  commentsData: CommentsPageResponse | null
  setCommentsData: (data: CommentsPageResponse | null | ((prev: CommentsPageResponse | null) => CommentsPageResponse | null)) => void
  onSuccess?: () => void
  onReset?: () => void
}

export const useCommentForm = ({ 
  productId, 
  commentsData, 
  setCommentsData, 
  onSuccess,
  onReset
}: UseCommentFormProps) => {
  // Form state
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [images, setImages] = useState<UploadImage[]>([])
  const [submitting, setSubmitting] = useState(false)
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize display name from localStorage
  useEffect(() => {
    const setFromLocal = () => {
      const user = getUserFromLocalStorage()
      if (user) {
        setDisplayName(user.userName)
      } else {
        setDisplayName('Người dùng ẩn danh')
      }
    }

    // Initial load
    setFromLocal()

    // Listen for storage events so cross-tab login/logout updates the form
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user') {
        setFromLocal()
      }
    }

    window.addEventListener('storage', handleStorage)
    // Also listen to focus events - helpful if login happened in another tab
    window.addEventListener('focus', setFromLocal)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', setFromLocal)
    }
  }, [setDisplayName])

  const resetForm = () => {
    setRating(5)
    setComment('')
    // Don't reset displayName - keep user name or anonymous
    setImages([])
    setHoverRating(0)
    
    // Call external reset callback (e.g., to reset react-hook-form)
    if (onReset) {
      onReset()
    }
  }

  const handleSubmit = async (e: React.FormEvent, formData?: {
    rating: number | null
    comment: string
    displayName: string
  }) => {
    e.preventDefault()

    // Sử dụng formData nếu được truyền vào (từ CommentForm), nếu không thì dùng internal state
    const submitRating = formData?.rating ?? rating
    const submitComment = formData?.comment ?? comment
    const submitDisplayName = formData?.displayName ?? displayName

    // Validation đầy đủ trước khi submit
    if (!productId || (typeof productId === 'string' && productId.trim() === '')) {
      toast.error('ID sản phẩm không hợp lệ')
      return
    }

    const validProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId
    if (isNaN(validProductId) || validProductId <= 0) {
      toast.error('ID sản phẩm phải là số dương')
      return
    }
    // if (!submitRating || submitRating < 1 || submitRating > 5) {
    //   toast.error('Vui lòng chọn số sao đánh giá từ 1-5')
    //   return
    // }
    if (!submitComment || !submitComment.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận')
      return
    }
    if (submitComment.trim().length < 10) {
      toast.error('Nội dung đánh giá phải có ít nhất 10 ký tự')
      return
    }
    if (!submitDisplayName || !submitDisplayName.trim()) {
      toast.error('Vui lòng nhập tên hiển thị')
      return
    }

    // Kiểm tra ảnh (nếu có)
    const imageFiles = images.length > 0 ? images.map(img => img.file) : undefined
    if (imageFiles) {
      for (const file of imageFiles) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
          toast.error(`Ảnh ${file.name} quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.`)
          return
        }
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} không phải là file ảnh hợp lệ.`)
          return
        }
      }
    }

    setSubmitting(true)

    // Tạo optimistic comment ID duy nhất
    const optimisticId = Date.now() + Math.random()

    // Create optimistic comment for UI
    const optimisticComment: CommentResponse = {
      id: optimisticId,
      productId: validProductId,
      displayName: submitDisplayName.trim(),
      isAnonymous: false,
      status: CommentStatus.PENDING,
      rating: submitRating,
      content: submitComment.trim(),
      createdAt: new Date().toISOString(),
      images: imageFiles ? imageFiles.map((file, index) => ({
        id: index,
        fileName: file.name,
        url: URL.createObjectURL(file), // Tạo preview URL cho optimistic UI
        size: file.size,
        displayOrder: index
      })) : [],
    }

    // Add optimistic comment to UI (sử dụng callback để tránh race condition)
    setCommentsData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        comments: [optimisticComment, ...prev.comments],
        totalElements: prev.totalElements + 1
      }
    })

    try {
      // Chuẩn bị dữ liệu gửi
      const requestData: CreateCommentRequest = {
        rating: submitRating,
        content: submitComment.trim(),
        displayName: submitDisplayName.trim()
      }

      // Gửi comment
      const response = await CommentService.postComment(validProductId, requestData, imageFiles)
      setCommentsData(prev => {
        if (!prev) return prev
        return {
          ...prev,
          comments: prev.comments.map(c =>
            c.id === optimisticId ? { ...response, images: response.images || [] } : c
          ),
          totalElements: prev.totalElements, // Keep same count
          totalRatings: (prev.totalRatings || 0) + 1, // Update rating count
        }
      })
      resetForm()
      if (imageFiles && imageFiles.length > 0) {
        toast.success(`Đánh giá với ${imageFiles.length} ảnh đã được gửi thành công! 📸`)
      } else {
        toast.success('Đánh giá của bạn đã được gửi thành công! ⭐')
      }

      // Call success callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 500)
      }

    } catch (error) {
      console.error('❌ Error submitting comment:', error)
      setCommentsData(prev => {
        if (!prev) return prev
        optimisticComment.images.forEach(img => {
          if (img.url.startsWith('blob:')) {
            URL.revokeObjectURL(img.url)
          }
        })
        return {
          ...prev,
          comments: prev.comments.filter(c => c.id !== optimisticId),
          totalElements: prev.totalElements - 1
        }
      })
      const errorMessage = error instanceof Error ? error.message : 'Không thể gửi bình luận. Vui lòng thử lại.'
      toast.error(errorMessage)

    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const maxFiles = 6 - images.length
    const selectedFiles = Array.from(files).slice(0, maxFiles)

    selectedFiles.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Ảnh ${file.name} quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.`)
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} không phải là file ảnh hợp lệ.`)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string
        setImages(prev => [...prev, { file, previewUrl }])
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  return {
    // Form state
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
    removeImage,
    resetForm
  }
}