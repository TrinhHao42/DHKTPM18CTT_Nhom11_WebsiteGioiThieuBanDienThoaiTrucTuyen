// Enum for CommentStatus (should match backend enum)
export enum CommentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED', 
    REJECTED = 'REJECTED'
}

export interface Comment {
    id?: number
    content?: string
    rating: number
    displayName?: string
    username?: string  // from User entity if authenticated
    isAnonymous: boolean
    status: CommentStatus
    createdAt: string
    productId: number
    parentCommentId?: number
    images: ImageInfo[]
    replies?: CommentResponse[]
    replyCount?: number
    uploading?: boolean // For optimistic UI
}

export interface ImageInfo {
    id?: number
    fileName: string
    url: string
    size: number
    displayOrder: number
}

export interface CommentResponse {
    id?: number
    content?: string
    rating: number
    displayName?: string
    username?: string  // from User entity if authenticated
    isAnonymous: boolean
    status: CommentStatus
    createdAt: string
    productId: number
    parentCommentId?: number
    images: ImageInfo[]
    replies?: CommentResponse[]
    replyCount?: number
}

export interface CommentsPageResponse {
    comments: CommentResponse[]
    currentPage: number
    pageSize: number
    totalElements: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
    averageRating: number
    totalRatings: number
    ratingDistribution: Record<string, number>
}

export interface CreateCommentRequest {
    rating: number
    content?: string
    displayName?: string
    parentCommentId?: number
}

export interface UploadImage {
    file: File
    previewUrl: string
}