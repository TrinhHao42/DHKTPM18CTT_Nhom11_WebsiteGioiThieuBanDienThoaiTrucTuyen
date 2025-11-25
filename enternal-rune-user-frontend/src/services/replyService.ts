import AxiosInstance from '@/configs/AxiosInstance'
import { CommentResponse, CommentsPageResponse, CreateCommentRequest } from '@/types/Comment'

export class ReplyService {
  /**
   * Post a reply to a comment
   * KHÔNG yêu cầu đăng nhập - tất cả user đều có thể reply
   */
  static async postReply(
    productId: string | number,
    commentId: number,
    replyData: {
      content: string
      displayName: string
    }
  ): Promise<CommentResponse> {
    // Validate and prepare variables at the top for error handling scope
    let validProductId: number | undefined
    let requestUrl: string | undefined
    
    try {
      // Validate productId
      if (!productId || (typeof productId === 'string' && productId.trim() === '')) {
        throw new Error('Product ID is required')
      }

      validProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId
      if (isNaN(validProductId) || validProductId <= 0) {
        throw new Error(`Invalid product ID: ${productId}`)
      }

      // Validate commentId  
      if (!commentId || !Number.isInteger(commentId) || commentId <= 0) {
        throw new Error('Valid comment ID is required')
      }

      // Validate reply content
      if (!replyData?.content || typeof replyData.content !== 'string' || !replyData.content.trim()) {
        throw new Error('Reply content is required')
      }

      // Validate display name
      if (!replyData?.displayName || typeof replyData.displayName !== 'string' || !replyData.displayName.trim()) {
        throw new Error('Display name is required')
      }

      // Prepare request URL for error handling
      requestUrl = `/api/products/${validProductId}/comments/${commentId}/replies`

      // Prepare request data matching backend CreateCommentRequest DTO
      const requestData: CreateCommentRequest = {
        rating: 0, // Replies don't have ratings - must be 0, not null
        content: replyData.content.trim(),
        displayName: replyData.displayName.trim(),
        parentCommentId: commentId // Include parentCommentId in request body
      }

      const response = await AxiosInstance.post<CommentResponse>(
        requestUrl,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          withCredentials: false, // KHÔNG yêu cầu đăng nhập để reply
          timeout: 10000,
          validateStatus: (status) => status < 500 // Don't throw for 4xx errors, handle them manually
        }
      )
      
      return response.data
      
    } catch (error: unknown) {
      // Handle specific error cases
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response: { 
            status: number
            statusText?: string
            headers?: Record<string, string>
            data?: string | { message?: string; errors?: Record<string, string[]> } | null
          } 
        }

        if (axiosError.response.status === 400) {
          // Handle case where backend returns empty string or invalid data
          if (!axiosError.response.data || 
              axiosError.response.data === '' ||
              typeof axiosError.response.data !== 'object' ||
              !('message' in axiosError.response.data) ||
              !axiosError.response.data.message) {
            
            // Specific error messages based on common 400 causes
            const possibleCauses = [
              `productId=${validProductId || productId} không tồn tại trong database`,
              `commentId=${commentId} không tồn tại hoặc không thuộc product này`,
              'Validation failed: rating, content, displayName, hoặc parentCommentId không hợp lệ',
              'Request body không đúng định dạng CreateCommentRequest',
              'Backend không thể parse JSON request'
            ]
            
            throw new Error(`Lỗi 400: Backend validation failed. Nguyên nhân có thể:\n${possibleCauses.join('\n')}`)
          }
          const errorMessage = (axiosError.response.data as { message: string }).message
          throw new Error(`Lỗi 400: ${errorMessage}`)
        }

        if (axiosError.response.status === 404) {
          throw new Error('Không tìm thấy bình luận để phản hồi.')
        }

        if (axiosError.response.status === 429) {
          throw new Error('Bạn đang phản hồi quá nhanh. Vui lòng chờ một chút.')
        }

        if (axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data) {
          throw new Error(axiosError.response.data.message || 'Unknown error')
        }
      }

      throw new Error('Không thể gửi phản hồi. Vui lòng thử lại.')
    }
  }

  /**
   * Get replies for a specific comment
   * KHÔNG yêu cầu đăng nhập - tất cả user đều có thể xem replies
   */
  static async getReplies(
    productId: string | number,
    commentId: number,
    page: number = 0,
    size: number = 10
  ): Promise<CommentsPageResponse> {
    try {
      if (!productId || (typeof productId === 'string' && productId.trim() === '')) {
        throw new Error('Product ID is required')
      }

      const validProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId
      if (isNaN(validProductId) || validProductId <= 0) {
        throw new Error(`Invalid product ID: ${productId}`)
      }

      if (!commentId || commentId <= 0) {
        throw new Error('Comment ID is required')
      }

      const response = await AxiosInstance.get<CommentsPageResponse>(
        `/api/products/${validProductId}/comments/${commentId}/replies`,
        {
          params: { page, size },
          withCredentials: false, // KHÔNG yêu cầu đăng nhập
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        }
      )
      return response.data
    } catch {
      return {
        comments: [],
        currentPage: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {}
      }
    }
  }
}