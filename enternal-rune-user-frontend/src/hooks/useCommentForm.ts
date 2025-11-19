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
}

export const useCommentForm = ({ 
  productId, 
  commentsData, 
  setCommentsData, 
  onSuccess 
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation - chỉ yêu cầu rating và nội dung, không bắt buộc tên vì đã tự động set
    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận')
      return
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error('Vui lòng chọn số sao đánh giá từ 1-5')
      return
    }

    setSubmitting(true)

    // Create optimistic comment for UI
    const optimisticComment: CommentResponse = {
      id: Date.now(), // temporary ID
      productId: Number(productId),
      displayName: displayName.trim(),
      isAnonymous: false,
      status: CommentStatus.PENDING,
      rating,
      content: comment.trim(),
      createdAt: new Date().toISOString(),
      images: images.map((img, index) => ({
        id: index,
        fileName: img.file.name,
        url: img.previewUrl,
        size: img.file.size,
        displayOrder: index
      })),
    }

    // Add optimistic comment to UI
    if (commentsData) {
      setCommentsData(prev => prev ? {
        ...prev,
        comments: [optimisticComment, ...prev.comments],
        totalElements: prev.totalElements + 1
      } : null)
    }

    try {
      const requestData: CreateCommentRequest = {
        rating,
        content: comment.trim(),
        displayName: displayName.trim()
      }

      // Chỉ gửi ảnh nếu có ảnh được chọn
      const imageFiles = images.length > 0 ? images.map(img => img.file) : undefined
      const response = await CommentService.postComment(productId, requestData, imageFiles)

      // Replace optimistic comment with real response
      if (commentsData) {
        setCommentsData(prev => prev ? {
          ...prev,
          comments: prev.comments.map(c => 
            c.id === optimisticComment.id ? response : c
          ),
          totalElements: prev.totalElements, // Keep same count
          totalRatings: prev.totalRatings + 1, // Update rating count
        } : null)
      }

      resetForm()
      
      // Success message based on whether images were included
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
      console.error('Error submitting comment:', error)
      toast.error(error instanceof Error ? error.message : 'Không thể gửi bình luận')
      
      // Remove optimistic comment on error
      if (commentsData) {
        setCommentsData(prev => prev ? {
          ...prev,
          comments: prev.comments.filter(c => c.id !== optimisticComment.id),
          totalElements: prev.totalElements - 1
        } : null)
      }
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
    
    // Refs
    fileInputRef,
    
    // Methods
    handleSubmit,
    handleImageUpload,
    removeImage,
    resetForm
  }
}