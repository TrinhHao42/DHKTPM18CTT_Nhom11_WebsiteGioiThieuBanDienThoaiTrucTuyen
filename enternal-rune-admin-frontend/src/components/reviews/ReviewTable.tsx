'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { adminCommentService, AdminComment, AdminCommentResponse } from '@/services/adminCommentService';

type Review = {
  id: string;
  customerName: string;
  customerAvatar: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'replied';
  createdAt: string;
  reply?: string;
  helpful: number;
};

export default function ReviewTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showReplyModal, setShowReplyModal] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  
  // API state management
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentReplies, setCommentReplies] = useState<Record<string, AdminComment[]>>({});
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [loadingReplies, setLoadingReplies] = useState<Set<number>>(new Set());
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 20,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Fetch replies for a specific comment with caching (lazy loading)
  const fetchRepliesForComment = async (comment: AdminComment): Promise<AdminComment[]> => {
    if (!comment.cmProduct?.prodId) return [];
    
    const cacheKey = `${comment.cmProduct.prodId}-${comment.cmId}`;
    
    // Check cache first
    if (commentReplies[cacheKey]) {
      return commentReplies[cacheKey];
    }

    // Add to loading state
    setLoadingReplies(prev => new Set([...prev, comment.cmId]));
    
    try {
      const repliesData = await adminCommentService.getCommentReplies(
        comment.cmProduct.prodId,
        comment.cmId,
        0,
        50
      );
      
      if (repliesData.comments && repliesData.comments.length > 0) {
        // Convert CommentReply to AdminComment format
        const convertedReplies = repliesData.comments.map(reply => ({
          cmId: reply.id,
          cmContent: reply.content,
          cmRating: reply.rating,
          cmDate: reply.createdAt,
          cmStatus: reply.status,
          displayName: reply.displayName,
          ipAddress: '',
          replyCount: reply.replyCount,
          parentCommentId: reply.parentCommentId,
          reply: false,
          images: reply.images || []
        }));
        
        // Cache the replies
        setCommentReplies(prev => ({
          ...prev,
          [cacheKey]: convertedReplies
        }));
        
        return convertedReplies;
      }
      
      return [];
    } catch (err) {
      console.error(`Error fetching replies for comment ${comment.cmId}:`, err);
      return [];
    } finally {
      // Remove from loading state
      setLoadingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(comment.cmId);
        return newSet;
      });
    }
  };

  // Toggle expand replies for a comment (lazy load when expanded)
  const toggleReplies = async (comment: AdminComment) => {
    const isExpanded = expandedComments.has(comment.cmId);
    
    if (isExpanded) {
      // Collapse
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(comment.cmId);
        return newSet;
      });
    } else {
      // Expand and load replies if not cached
      setExpandedComments(prev => new Set([...prev, comment.cmId]));
      
      const cacheKey = `${comment.cmProduct?.prodId}-${comment.cmId}`;
      if (!commentReplies[cacheKey] && comment.cmProduct?.prodId) {
        const replies = await fetchRepliesForComment(comment);
        
        // Update the specific comment with replies
        setComments(prevComments => 
          prevComments.map(c => 
            c.cmId === comment.cmId ? { ...c, replies } : c
          )
        );
      }
    }
  };

  // Fetch comments from API (without replies - lazy loading approach)
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await adminCommentService.getAllComments({
        page: pagination.currentPage,
        size: pagination.pageSize,
        search: searchTerm || undefined,
        ratingFilter: ratingFilter !== 'all' ? ratingFilter : undefined,
        statusFilter: statusFilter !== 'all' ? statusFilter : undefined,
      });
      
      // Set comments without replies (much faster initial load)
      // Replies will be loaded on-demand when user expands them
      setComments(response.comments.map(comment => ({ ...comment, replies: [] })));
      
      setPagination({
        currentPage: response.currentPage,
        pageSize: response.pageSize,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious,
      });
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu đánh giá');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search and filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset to first page when searching/filtering
      setPagination(prev => ({ ...prev, currentPage: 0 }));
      // Clear replies cache and expanded state when searching/filtering
      setCommentReplies({});
      setExpandedComments(new Set());
      fetchComments();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, ratingFilter, statusFilter]);

  // Handle pagination changes
  useEffect(() => {
    if (pagination.currentPage > 0) {
      fetchComments();
    }
  }, [pagination.currentPage]);

  // Initial load
  useEffect(() => {
    fetchComments();
  }, []);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  // Handle reply submission
  const handleSubmitReply = async () => {
    if (!showReplyModal || !replyText.trim()) return;

    const commentId = parseInt(showReplyModal);

    try {
      setSubmittingReply(true);
      
      const response = await adminCommentService.replyToComment(
        commentId, 
        replyText.trim()
      );
      
      if (response.status === 'success') {
        // Close modal and reset form
        setShowReplyModal(null);
        setReplyText('');
        
        // Clear replies cache for this specific comment to get fresh data
        const comment = comments.find(c => c.cmId === commentId);
        if (comment && comment.cmProduct?.prodId) {
          const cacheKey = `${comment.cmProduct.prodId}-${commentId}`;
          setCommentReplies(prev => {
            const updated = { ...prev };
            delete updated[cacheKey];
            return updated;
          });
          
          // Auto-expand replies to show the new reply
          setExpandedComments(prev => new Set([...prev, commentId]));
          
          // Refresh replies for this specific comment
          const updatedReplies = await fetchRepliesForComment(comment);
          setComments(prevComments => 
            prevComments.map(c => 
              c.cmId === commentId ? { 
                ...c, 
                replies: updatedReplies,
                replyCount: updatedReplies.length 
              } : c
            )
          );
        }
        
        // Show success message
        alert('Phản hồi đã được thêm thành công!');
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('Không thể gửi phản hồi. Vui lòng thử lại.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const getStatusBadgeColor = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'replied':
        return 'success';
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      default:
        return 'warning';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'
            }`}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  // Generate deterministic avatar SVG data URI from a name (initials)
  const generateAvatar = (name?: string) => {
    const display = (name || 'Người dùng ẩn danh').trim();
    // Get initials (max 2 chars)
    const parts = display.split(/\s+/).filter(Boolean);
    let initials = '';
    if (parts.length === 0) initials = 'U';
    else if (parts.length === 1) initials = parts[0].slice(0, 2);
    else initials = (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1));
    initials = initials.toUpperCase();

    // Deterministic background color from name
    const colors = [
      ['#FDE68A', '#F59E0B'], // amber gradient
      ['#BBF7D0', '#10B981'], // green
      ['#BFDBFE', '#3B82F6'], // blue
      ['#E9D5FF', '#8B5CF6'], // purple
      ['#FECACA', '#EF4444'], // red
      ['#FEF3C7', '#F59E0B'], // yellow
      ['#CFFAFE', '#06B6D4'], // teal
    ];
    let hash = 0;
    for (let i = 0; i < display.length; i++) {
      hash = display.charCodeAt(i) + ((hash << 5) - hash);
      hash |= 0;
    }
    const palette = colors[Math.abs(hash) % colors.length];
    const bgStart = palette[0];
    const bgEnd = palette[1];
    const fg = '#ffffff';

    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'>
        <defs>
          <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stop-color='${bgStart}' />
            <stop offset='100%' stop-color='${bgEnd}' />
          </linearGradient>
        </defs>
        <circle cx='64' cy='64' r='64' fill='url(#g)' />
        <text x='64' y='72' text-anchor='middle' fill='${fg}' font-family='Inter, Arial, sans-serif' font-size='52' font-weight='700' dominant-baseline='middle'>${initials}</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-theme-lg font-semibold text-gray-800 dark:text-white/90">
              Đánh giá & phản hồi
            </h3>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">
              Quản lý đánh giá và phản hồi khách hàng
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/categories/new"
              className="bg-brand-500 text-theme-sm shadow-theme-xs hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Xuất báo cáo
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dark:border-white-800 bg-white-50/30 dark:bg-white-900/10 border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm đánh giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Tất cả sao</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
            <option value="4">⭐⭐⭐⭐ (4 sao)</option>
            <option value="3">⭐⭐⭐ (3 sao)</option>
            <option value="2">⭐⭐ (2 sao)</option>
            <option value="1">⭐ (1 sao)</option>
          </select>

        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Đang tải...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : comments.map((comment) => (
          <div
            key={comment.cmId}
            className="p-6 transition-colors hover:bg-amber-50/20 dark:hover:bg-amber-900/5"
          >
            <div className="flex gap-4">
              {/* Customer Avatar */}

              {/* Review Content */}
              <div className="min-w-0 flex-1">
                {/* Header */}
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div className="flex flex-1 gap-4">
                    {
                      (() => {
                        const name = comment.cmUser?.userName || comment.displayName || 'Người dùng ẩn danh';
                        const rawAvatar = comment.cmUser?.userAvatar;
                        // Treat default avatar path as missing and generate one instead
                        const avatar = (rawAvatar && rawAvatar !== '/images/user/default-avatar.jpg') ? rawAvatar : generateAvatar(name);
                        return (
                          <Image
                            src={avatar}
                            alt={name}
                            width={48}
                            height={48}
                            unoptimized
                            className="aspect-square rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                          />
                        );
                      })()
                    }
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800 dark:text-white/90">
                        {comment.cmUser?.userName || 'Người dùng ẩn danh'}
                      </h4>
                    </div>
                    <div className="text-theme-sm flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      {comment.cmRating ? renderStars(comment.cmRating) : (
                        <span className="text-gray-400 text-sm">Không có đánh giá</span>
                      )}
                      <span>•</span>
                      <span>{new Date(comment.cmDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-3 flex w-fit items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                  <Image
                    src={comment.cmProduct?.prodImageUrl || '/images/product/default-product.jpg'}
                    alt={comment.cmProduct?.prodName || 'Product'}
                    width={32}
                    height={32}
                    className="h-[50px] w-[50px] object-cover"
                  />
                  <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                    {comment.cmProduct?.prodName || 'Sản phẩm'}
                  </span>
                </div>

                {/* Comment */}
                <p className="mb-3 text-gray-700 dark:text-gray-300">{comment.cmContent}</p>

                {/* Show Replies Toggle Button (only if comment has potential replies) */}
                {(comment.replyCount > 0 || expandedComments.has(comment.cmId)) && (
                  <div className="mb-3">
                    <button
                      onClick={() => toggleReplies(comment)}
                      disabled={loadingReplies.has(comment.cmId)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                    >
                      {loadingReplies.has(comment.cmId) ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                          Đang tải phản hồi...
                        </>
                      ) : (
                        <>
                          <svg
                            className={`h-4 w-4 transition-transform ${expandedComments.has(comment.cmId) ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {expandedComments.has(comment.cmId) 
                            ? `Ẩn phản hồi (${comment.replyCount})` 
                            : `Xem phản hồi (${comment.replyCount})`
                          }
                        </>
                      )}
                    </button>
                    
                    {/* Replies (only show when expanded) */}
                    {expandedComments.has(comment.cmId) && comment.replies && comment.replies.length > 0 && (
                      <div className="mt-2 ml-4 space-y-2">
                        {comment.replies.map((reply, index) => (
                          <div key={reply.cmId || index} className="rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-3 dark:bg-blue-900/20">
                            <div className="mb-1 flex items-center gap-2">
                              <svg
                                className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                              </svg>
                              <span className={`text-theme-sm font-semibold ${reply.displayName === 'ADMIN' ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
                                Phản hồi từ {reply.displayName || 'Ẩn danh'}
                              </span>
                              {reply.cmDate && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  • {new Date(reply.cmDate).toLocaleString('vi-VN')}
                                </span>
                              )}
                            </div>
                            <p className="text-theme-sm text-gray-700 dark:text-gray-300">{reply.cmContent}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <span className="text-theme-sm text-gray-500 dark:text-gray-400">
                    ID: {comment.cmId}
                  </span>

                  {(() => {
                    // Check if admin has already replied (need to check cache for accurate status)
                    const cacheKey = `${comment.cmProduct?.prodId}-${comment.cmId}`;
                    const cachedReplies = commentReplies[cacheKey];
                    const hasAdminReply = cachedReplies?.some(reply => reply.displayName === 'ADMIN') || 
                                         comment.replies?.some(reply => reply.displayName === 'ADMIN');
                    
                    return !hasAdminReply ? (
                      <button 
                        onClick={() => setShowReplyModal(comment.cmId.toString())}
                        className="text-theme-sm inline-flex items-center gap-1.5 font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                          />
                        </svg>
                        Phản hồi
                      </button>
                    ) : (
                      <span className="text-theme-sm text-green-600 dark:text-green-400 font-medium">
                        ✓ ADMIN đã phản hồi
                      </span>
                    );
                  })()}

                  <button className="text-theme-sm text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300 inline-flex items-center gap-1.5 transition-colors">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="h-12 w-12 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy đánh giá nào</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalElements > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-amber-50/20 px-6 py-4 sm:flex-row dark:border-gray-800 dark:bg-amber-900/10">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Hiển thị {comments.length} trong tổng {pagination.totalElements} đánh giá
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevious}
              className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03] disabled:opacity-50 disabled:cursor-not-allowed">
              Trước
            </button>
            <span className="text-theme-sm bg-brand-500 rounded-lg px-3 py-2 font-medium text-white">
              {pagination.currentPage + 1}
            </span>
            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03] disabled:opacity-50 disabled:cursor-not-allowed">
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div 
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!submittingReply) {
              setShowReplyModal(null);
              setReplyText('');
            }
          }}
        >
          <div 
            className="relative w-full max-w-lg rounded-xl border bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Phản hồi đánh giá
              </h3>
              <button
                onClick={() => {
                  setShowReplyModal(null);
                  setReplyText('');
                }}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                disabled={submittingReply}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nội dung phản hồi
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nhập phản hồi của bạn với tư cách ADMIN..."
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  disabled={submittingReply}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Phản hồi sẽ hiển thị với tên "ADMIN"
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowReplyModal(null);
                  setReplyText('');
                }}
                disabled={submittingReply}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500/20 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={submittingReply || !replyText.trim()}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submittingReply ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi phản hồi'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
