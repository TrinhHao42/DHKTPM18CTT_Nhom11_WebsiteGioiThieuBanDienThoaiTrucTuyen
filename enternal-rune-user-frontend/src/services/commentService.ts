import AxiosInstance from '@/configs/AxiosInstance'
import { CommentResponse, CommentsPageResponse, CreateCommentRequest } from '@/types/Comment'
import { API_ROUTES } from '@/router/router'

export class CommentService {
  private static isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Get comments for a product with pagination
   * KHÔNG yêu cầu đăng nhập - tất cả user đều có thể xem comments
   */
  static async getComments(
    productId: string | number,
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

      const response = await AxiosInstance.get<CommentsPageResponse>(
        API_ROUTES.PRODUCT_COMMENTS(validProductId),
        {
          params: { page, size },
          withCredentials: false, // KHÔNG yêu cầu đăng nhập để xem comments
          timeout: 15000,
          headers: {
            'Accept': 'application/json'
          }
        }
      )
      return response.data
    } catch (error: unknown) {
      throw error // Re-throw to maintain error propagation
    }
  }

  /**
   * Post a new comment for a product
   * Tự động chọn endpoint phù hợp: JSON nếu không có ảnh, Multipart nếu có ảnh
   */
  static async postComment(
    productId: string | number,
    commentData: CreateCommentRequest,
    images?: File[]
  ): Promise<CommentResponse> {
    try {
      // Nếu không có ảnh, gửi JSON đơn giản
      if (!images || images.length === 0) {
        return await this.postCommentTextOnly(productId, commentData)
      }

      // Nếu có ảnh, gửi multipart
      return await this.postCommentWithImages(productId, commentData, images)

    } catch (error: unknown) {
      // Handle specific error cases
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data?: { message?: string } } }

        if (axiosError.response.status === 429) {
          throw new Error('Bạn đang gửi bình luận quá nhanh. Vui lòng chờ một chút.')
        }

        if (axiosError.response.status === 413) {
          throw new Error('Ảnh tải lên quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.')
        }

        if (axiosError.response.status === 400) {
          throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.')
        }

        if (axiosError.response.status === 401) {
          throw new Error('Bạn cần đăng nhập để gửi bình luận.')
        }

        if (axiosError.response.status === 403) {
          throw new Error('Bạn không có quyền gửi bình luận.')
        }

        if (axiosError.response.data?.message) {
          throw new Error(axiosError.response.data.message)
        }
      }

      throw new Error('Không thể gửi bình luận. Vui lòng thử lại.')
    }
  }

  /**
   * Gửi comment chỉ có text (JSON endpoint)
   * Sử dụng endpoint: POST /api/products/{productId}/comments/text
   */
  private static async postCommentTextOnly(
    productId: string | number,
    commentData: CreateCommentRequest
  ): Promise<CommentResponse> {
    const response = await AxiosInstance.post<CommentResponse>(
      API_ROUTES.PRODUCT_COMMENT_TEXT_ONLY(productId),
      commentData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        timeout: 10000 // 10 seconds for text only
      }
    )
    return response.data
  }

  /**
   * Gửi comment có kèm ảnh (Multipart endpoint)
   * Sử dụng endpoint: POST /api/products/{productId}/comments
   */
  private static async postCommentWithImages(
    productId: string | number,
    commentData: CreateCommentRequest,
    images: File[]
  ): Promise<CommentResponse> {
    const formData = new FormData()

    // Add comment data as JSON blob
    const commentBlob = new Blob([JSON.stringify(commentData)], {
      type: 'application/json',
    })
    formData.append('comment', commentBlob)

    // Add image files
    images.forEach((file) => {
      formData.append('images', file)
    })

    const response = await AxiosInstance.post<CommentResponse>(
      API_ROUTES.PRODUCT_COMMENTS(productId),
      formData,
      {
        headers: {
          // Don't set Content-Type, let Axios handle multipart/form-data
        },
        withCredentials: true,
        timeout: 30000 // 30 seconds for file upload
      }
    )
    return response.data
  }

  /**
   * Check if user is authenticated 
   * CHỈ cần khi muốn post comment - xem comment thì KHÔNG cần
   */
  static async checkAuth(): Promise<boolean> {
    try {
      const response = await AxiosInstance.get('/api/auth/check', {
        withCredentials: true, // Cần credentials để check auth
        timeout: 5000,
        headers: {
          'Accept': 'application/json'
        }
      })
      return response.status === 200
    } catch {
      return false
    }
  }

  /**
   * Get rating distribution for a product
   * KHÔNG yêu cầu đăng nhập - tất cả user đều có thể xem
   */
  static async getRatingDistribution(productId: string | number): Promise<Record<string, number>> {
    try {
      if (!productId || (typeof productId === 'string' && productId.trim() === '')) {
        throw new Error('Product ID is required for rating distribution')
      }
      const validProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId
      if (isNaN(validProductId) || validProductId <= 0) {
        throw new Error(`Invalid product ID for rating distribution: ${productId}`)
      }

      const response = await AxiosInstance.get<Record<string, number>>(
        API_ROUTES.PRODUCT_RATING_DISTRIBUTION(validProductId),
        {
          withCredentials: false, // KHÔNG yêu cầu đăng nhập
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        }
      )
      return response.data
    } catch {
      return this.isDevelopment ? { '4': 1, '5': 2 } : {}
    }
  }

  /**
   * Get average rating for a product  
   * KHÔNG yêu cầu đăng nhập - tất cả user đều có thể xem
   */
  static async getAverageRating(productId: string | number): Promise<number> {
    try {
      if (!productId || (typeof productId === 'string' && productId.trim() === '')) {
        throw new Error('Product ID is required for average rating')
      }

      const validProductId = typeof productId === 'string' ? parseInt(productId, 10) : productId
      if (isNaN(validProductId) || validProductId <= 0) {
        throw new Error(`Invalid product ID for average rating: ${productId}`)
      }

      const response = await AxiosInstance.get<number>(
        API_ROUTES.PRODUCT_AVERAGE_RATING(validProductId),
        {
          withCredentials: false, // KHÔNG yêu cầu đăng nhập
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        }
      )
      return response.data
    } catch {
      return this.isDevelopment ? 4.7 : 0
    }
  }

}