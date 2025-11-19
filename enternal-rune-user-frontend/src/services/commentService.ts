/**
 * CommentService - Frontend service for product comments and ratings
 * Handles API calls to backend comment endpoints với CORS fix
 * 
 * Features:
 * - Automatic endpoint selection (JSON vs Multipart)
 * - CORS support with credentials
 * - Error handling with user-friendly messages
 * - Authentication support
 */

import AxiosInstance from '@/configs/AxiosInstance'
import { CommentResponse, CommentsPageResponse, CreateCommentRequest } from '@/types/Comment'

export class CommentService {
  private static readonly BASE_URL = '/api/products'

  /**
   * Get comments for a product with pagination
   * @param productId - Product ID
   * @param page - Page number (0-based)
   * @param size - Number of comments per page
   */
  static async getComments(
    productId: string | number, 
    page: number = 0, 
    size: number = 10
  ): Promise<CommentsPageResponse> {
    try {
      const response = await AxiosInstance.get<CommentsPageResponse>(
        `${this.BASE_URL}/${productId}/comments`,
        {
          params: { page, size },
          withCredentials: true // Cho phép gửi cookies/credentials
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw new Error('Không thể tải bình luận. Vui lòng thử lại.')
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
      console.error('Error posting comment:', error)
      
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
      `${this.BASE_URL}/${productId}/comments/text`,
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
      `${this.BASE_URL}/${productId}/comments`,
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
   * Check if user is authenticated (có thể gọi trước khi post comment)
   */
  static async checkAuth(): Promise<boolean> {
    try {
      const response = await AxiosInstance.get('/api/auth/check', {
        withCredentials: true
      })
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  /**
   * Get rating distribution for a product
   */
  static async getRatingDistribution(productId: string | number): Promise<Record<string, number>> {
    try {
      const response = await AxiosInstance.get<Record<string, number>>(
        `${this.BASE_URL}/${productId}/rating-distribution`,
        {
          withCredentials: true
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fetching rating distribution:', error)
      throw new Error('Không thể tải thống kê đánh giá.')
    }
  }

  /**
   * Get average rating for a product
   */
  static async getAverageRating(productId: string | number): Promise<number> {
    try {
      const response = await AxiosInstance.get<number>(
        `${this.BASE_URL}/${productId}/average-rating`,
        {
          withCredentials: true
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fetching average rating:', error)
      throw new Error('Không thể tải điểm đánh giá trung bình.')
    }
  }
}