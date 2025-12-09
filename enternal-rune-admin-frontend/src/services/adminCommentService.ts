import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';

// Create a separate axios instance for public admin comment endpoints (no auth required)
const publicAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface AdminComment {
  cmId: number;
  cmRating: number | null;
  cmContent: string;
  cmDate: string;
  cmStatus: string;
  displayName: string;
  ipAddress: string;
  cmUser?: {
    userName: string;
    userAvatar?: string;
  };
  cmProduct?: {
    prodId: number;
    prodName: string;
    prodImageUrl?: string;
  };
  comment?: {
    cmContent: string;
    displayName?: string;
    cmDate?: string;
  }; // Reply comment info
  replies?: AdminComment[]; // All replies for this comment
  replyCount: number;
  parentCommentId?: number | null;
  reply: boolean;
  images?: CommentImage[];
}

export interface CommentImage {
  imgId: number;
  imgUrl: string;
}

export interface CommentReply {
  id: number;
  content: string;
  rating: number | null;
  displayName: string;
  username: string | null;
  status: string;
  createdAt: string;
  productId: number;
  parentCommentId: number;
  images: any[];
  replies: null;
  replyCount: number;
  hasPurchased: boolean;
  anonymous: boolean;
}

export interface AdminCommentResponse {
  comments: AdminComment[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface AdminCommentMetrics {
  totalReviews: number;
  totalReplies: number;
  averageRating: number;
  recentReviews: number;
  ratingDistribution: Record<number, number>;
}

class AdminCommentService {
  private baseURL = '/api/admin/comments';

  /**
   * Get all comments with pagination and filters
   */
  async getAllComments(params: {
    page?: number;
    size?: number;
    search?: string;
    ratingFilter?: string;
    statusFilter?: string;
  }): Promise<AdminCommentResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.ratingFilter && params.ratingFilter !== 'all') queryParams.append('ratingFilter', params.ratingFilter);
    if (params.statusFilter && params.statusFilter !== 'all') queryParams.append('statusFilter', params.statusFilter);

    const response = await publicAxiosInstance.get<AdminCommentResponse>(
      `${this.baseURL}?${queryParams.toString()}`
    );

    return response.data;
  }

  /**
   * Get comments for a specific product
   */
  async getCommentsByProduct(productId: number, page = 0, size = 20): Promise<any> {
    const response = await publicAxiosInstance.get(
      `${this.baseURL}/product/${productId}?page=${page}&size=${size}`
    );
    return response.data;
  }

  /**
   * Get admin review metrics - same pattern as getAllComments
   */
  async getReviewMetrics(): Promise<AdminCommentMetrics> {
    // Use same axios instance and endpoint pattern as getAllComments
    const response = await publicAxiosInstance.get<AdminCommentMetrics>(`${this.baseURL}/stats`);
    return response.data;
  }

  /**
   * Update comment status
   */
  async updateCommentStatus(commentId: number, status: string): Promise<{ status: string; message: string }> {
    const response = await publicAxiosInstance.put<{ status: string; message: string }>(
      `${this.baseURL}/${commentId}/status?status=${status}`,
      {}
    );
    return response.data;
  }

  /**
   * Reply to a comment
   */
  async replyToComment(commentId: number, reply: string): Promise<{ status: string; message: string; reply?: AdminComment }> {
    const response = await publicAxiosInstance.post<{ status: string; message: string; reply?: AdminComment }>(
      `${this.baseURL}/${commentId}/reply`,
      { reply }
    );
    return response.data;
  }

  /**
   * Get replies for a specific comment
   */
  async getCommentReplies(productId: number, commentId: number, page = 0, size = 50): Promise<{
    comments: CommentReply[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    const response = await publicAxiosInstance.get(
      `/api/products/${productId}/comments/${commentId}/replies?page=${page}&size=${size}`
    );
    return response.data;
  }
}

export const adminCommentService = new AdminCommentService();