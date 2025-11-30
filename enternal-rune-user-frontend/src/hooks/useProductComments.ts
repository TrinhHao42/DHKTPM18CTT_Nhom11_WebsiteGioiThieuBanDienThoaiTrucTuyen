import { useState, useEffect } from 'react'
import { CommentsPageResponse } from '@/types/Comment'
import { CommentService } from '@/services/commentService'

// Simple cache to avoid repeated API calls
const commentDataCache = new Map<string | number, CommentsPageResponse>()

export const useProductComments = (productId: string | number, enabled: boolean = true) => {
  const [commentData, setCommentData] = useState<CommentsPageResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !productId) return

    // Check cache first
    const cachedData = commentDataCache.get(productId)
    if (cachedData) {
      setCommentData(cachedData)
      return
    }

    const fetchComments = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const data = await CommentService.getComments(productId, 0, 1) // Just get first page to get summary data
        commentDataCache.set(productId, data) // Cache the result
        setCommentData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch comments')
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [productId, enabled])

  return { commentData, isLoading, error }
}