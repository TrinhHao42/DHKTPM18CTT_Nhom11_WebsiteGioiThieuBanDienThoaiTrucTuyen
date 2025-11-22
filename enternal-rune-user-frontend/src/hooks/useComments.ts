import { useState, useEffect } from 'react'
import { CommentService } from '@/services/commentService'
import { CommentsPageResponse } from '@/types/Comment'
import { toast } from 'react-hot-toast'

interface UseCommentsProps {
  productId: string | number
  initialData?: CommentsPageResponse
}

export const useComments = ({ productId, initialData }: UseCommentsProps) => {
  const [commentsData, setCommentsData] = useState<CommentsPageResponse | null>(initialData || null)
  const [loading, setLoading] = useState(!initialData)
  const [loadingMore, setLoadingMore] = useState(false)

  // Load initial comments
  useEffect(() => {
    if (!initialData) {
      loadComments()
    }
  }, [productId, initialData]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadComments = async (page = 0, append = false) => {
    try {
      if (!append) setLoading(true)
      const data = await CommentService.getComments(productId, page, 10)
      
      if (append && commentsData) {
        setCommentsData({
          ...data,
          comments: [...commentsData.comments, ...data.comments]
        })
      } else {
        setCommentsData(data)
      }
    } catch (error) {
      console.error('Error loading comments:', error)
      toast.error('Không thể tải bình luận')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreComments = async () => {
    if (!commentsData?.hasNext || loadingMore) return
    
    setLoadingMore(true)
    const nextPage = commentsData.currentPage + 1
    await loadComments(nextPage, true)
  }

  const refreshComments = () => {
    loadComments(0, false)
  }

  return {
    commentsData,
    setCommentsData,
    loading,
    loadingMore,
    loadMoreComments,
    refreshComments
  }
}