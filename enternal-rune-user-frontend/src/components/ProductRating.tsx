'use client'

import React, { useState, useRef } from 'react'
import { CommentsPageResponse } from '@/types/Comment'
import Image from 'next/image'
import { useComments } from '@/hooks/useComments'
import { CommentForm } from '@/components/comments/CommentForm'
import { CommentList } from '@/components/comments/CommentList'
import { RatingBreakdown } from '@/components/comments/RatingBreakdown'
import { CommentExamples } from '@/components/comments/CommentExamples'

interface ProductRatingProps {
  productId: string | number
  initialData?: CommentsPageResponse
  // optional external comments management from a parent component
  externalCommentsData?: CommentsPageResponse | null
  externalSetCommentsData?: (data: CommentsPageResponse | null | ((prev: CommentsPageResponse | null) => CommentsPageResponse | null)) => void
  externalLoading?: boolean
  externalLoadingMore?: boolean
  externalLoadMoreComments?: () => void | Promise<void>
  externalRefreshComments?: () => void | Promise<void>
}

export default function ProductRating({ productId, initialData, externalCommentsData, externalSetCommentsData, externalLoading, externalLoadingMore, externalLoadMoreComments, externalRefreshComments }: ProductRatingProps) {
  // Refs
  const formRef = useRef<HTMLDivElement>(null)
  
  // Custom hooks or external state
  const {
    commentsData: internalCommentsData,
    setCommentsData: internalSetCommentsData,
    loading: internalLoading,
    loadingMore: internalLoadingMore,
    loadMoreComments: internalLoadMoreComments,
    refreshComments: internalRefreshComments
  } = useComments({ productId, initialData })

  const commentsData = externalCommentsData ?? internalCommentsData
  const setCommentsData = externalSetCommentsData ?? internalSetCommentsData
  const loading = externalLoading ?? internalLoading
  const loadingMore = externalLoadingMore ?? internalLoadingMore
  const loadMoreComments = externalLoadMoreComments ?? internalLoadMoreComments
  const refreshComments = externalRefreshComments ?? internalRefreshComments

  // UI states
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [showExamples, setShowExamples] = useState(false)

  // Helper functions
  const handleImageClick = (url: string) => {
    if (url) setSelectedImageUrl(url)
  }

  const closeModal = () => setSelectedImageUrl(null)

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden my-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đánh giá sản phẩm</h2>
            <p className="text-gray-600">Chia sẻ trải nghiệm và đọc đánh giá từ khách hàng khác</p>
          </div>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showExamples ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn'}
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Rating Overview */}
        <RatingBreakdown
          ratingCounts={commentsData?.ratingDistribution}
          total={commentsData?.totalRatings}
          averageRating={commentsData?.averageRating}
        />

        {/* Examples (conditional) */}
        {showExamples && (
          <div className="border-t border-gray-100 pt-8">
            <CommentExamples />
          </div>
        )}

        {/* Comment Form */}
        <div ref={formRef} className="border-t border-gray-100 pt-8">
          <CommentForm
            productId={productId}
            commentsData={commentsData}
            setCommentsData={setCommentsData}
            onSuccess={refreshComments}
          />
        </div>

        {/* Comments List */}
        <div className="border-t border-gray-100 pt-8">
          <CommentList
            commentsData={commentsData}
            loading={loading}
            loadingMore={loadingMore}
            onLoadMore={loadMoreComments}
            onImageClick={handleImageClick}
          />
        </div>
      </div>

      {/* Image full-size modal */}
      {selectedImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm" onClick={closeModal}>
          <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeModal} 
              className="absolute -top-12 right-0 z-10 bg-white text-gray-700 hover:bg-gray-100 rounded-full p-3 transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-[80vh] bg-white rounded-xl overflow-hidden shadow-2xl">
              <Image 
                src={selectedImageUrl} 
                alt="Full size" 
                fill 
                className="object-contain" 
                quality={95}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}