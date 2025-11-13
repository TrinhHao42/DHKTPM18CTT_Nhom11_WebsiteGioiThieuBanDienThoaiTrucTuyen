'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

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

// Mock data
const reviewData: Review[] = [
  {
    id: '1',
    customerName: 'Nguyễn Văn An',
    customerAvatar: '/images/user/user-01.jpg',
    productName: 'iPhone 15 Pro Max',
    productImage: '/images/product/product-01.jpg',
    rating: 5,
    comment: 'Sản phẩm rất tốt, giao hàng nhanh. Đóng gói cẩn thận. Rất hài lòng!',
    status: 'replied',
    createdAt: '2024-10-20',
    reply: 'Cảm ơn anh đã tin tưởng và ủng hộ shop!',
    helpful: 24,
  },
  {
    id: '2',
    customerName: 'Trần Thị Bình',
    customerAvatar: '/images/user/user-02.jpg',
    productName: 'MacBook Pro M3',
    productImage: '/images/product/product-02.jpg',
    rating: 4,
    comment: 'Máy đẹp, chạy mượt. Chỉ hơi tiếc là không có quà tặng kèm.',
    status: 'approved',
    createdAt: '2024-10-19',
    helpful: 18,
  },
  {
    id: '3',
    customerName: 'Lê Hoàng Cường',
    customerAvatar: '/images/user/user-03.jpg',
    productName: 'AirPods Pro Gen 2',
    productImage: '/images/product/product-03.jpg',
    rating: 5,
    comment: 'Tai nghe chống ồn tốt, pin trâu, âm thanh hay. Đáng đồng tiền!',
    status: 'replied',
    createdAt: '2024-10-18',
    reply: 'Shop cảm ơn bạn! Chúc bạn trải nghiệm tuyệt vời!',
    helpful: 32,
  },
  {
    id: '4',
    customerName: 'Phạm Minh Đức',
    customerAvatar: '/images/user/user-04.jpg',
    productName: 'Samsung Galaxy S24 Ultra',
    productImage: '/images/product/product-04.jpg',
    rating: 3,
    comment: 'Máy ổn nhưng giao hàng hơi lâu. Hy vọng shop cải thiện thời gian giao hàng.',
    status: 'pending',
    createdAt: '2024-10-17',
    helpful: 5,
  },
  {
    id: '5',
    customerName: 'Võ Thị Em',
    customerAvatar: '/images/user/user-01.jpg',
    productName: 'iPad Pro 12.9 inch',
    productImage: '/images/product/product-01.jpg',
    rating: 5,
    comment: 'Màn hình đẹp xuất sắc, hiệu năng mạnh mẽ. Rất đáng mua!',
    status: 'approved',
    createdAt: '2024-10-16',
    helpful: 41,
  },
  {
    id: '6',
    customerName: 'Hoàng Văn Phong',
    customerAvatar: '/images/user/user-02.jpg',
    productName: 'Apple Watch Series 9',
    productImage: '/images/product/product-02.jpg',
    rating: 4,
    comment: 'Đồng hồ đẹp, nhiều tính năng. Pin hơi yếu so với mong đợi.',
    status: 'pending',
    createdAt: '2024-10-15',
    helpful: 12,
  },
  {
    id: '7',
    customerName: 'Đặng Thị Giang',
    customerAvatar: '/images/user/user-03.jpg',
    productName: 'Sony WH-1000XM5',
    productImage: '/images/product/product-03.jpg',
    rating: 5,
    comment: 'Chất lượng âm thanh tuyệt vời, chống ồn đỉnh cao. Giá hơi cao nhưng xứng đáng!',
    status: 'replied',
    createdAt: '2024-10-14',
    reply: 'Cảm ơn bạn đã đánh giá! Rất vui khi sản phẩm làm bạn hài lòng!',
    helpful: 28,
  },
  {
    id: '8',
    customerName: 'Bùi Xuân Hiếu',
    customerAvatar: '/images/user/user-04.jpg',
    productName: 'Dell XPS 15',
    productImage: '/images/product/product-04.jpg',
    rating: 2,
    comment: 'Máy bị lỗi bàn phím sau 1 tuần sử dụng. Đang chờ shop hỗ trợ bảo hành.',
    status: 'pending',
    createdAt: '2024-10-13',
    helpful: 3,
  },
];

export default function ReviewTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showReplyModal, setShowReplyModal] = useState<string | null>(null);

  // Filter logic
  const filteredReviews = reviewData.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);

    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

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

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'replied':
        return 'Đã phản hồi';
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      default:
        return status;
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="replied">Đã phản hồi</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="p-6 transition-colors hover:bg-amber-50/20 dark:hover:bg-amber-900/5"
          >
            <div className="flex gap-4">
              {/* Customer Avatar */}

              {/* Review Content */}
              <div className="min-w-0 flex-1">
                {/* Header */}
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div className="flex flex-1 gap-4">
                    <Image
                      src={review.customerAvatar}
                      alt={review.customerName}
                      width={48}
                      height={48}
                      className="aspect-square rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                    />
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800 dark:text-white/90">
                        {review.customerName}
                      </h4>
                      <Badge size="sm" color={getStatusBadgeColor(review.status)}>
                        {getStatusText(review.status)}
                      </Badge>
                    </div>
                    <div className="text-theme-sm flex items-center gap-3 text-gray-500 dark:text-gray-400">
                      {renderStars(review.rating)}
                      <span>•</span>
                      <span>{review.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-3 flex w-fit items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800/50">
                  <Image
                    src={review.productImage}
                    alt={review.productName}
                    width={32}
                    height={32}
                    className="h-[50px] w-[50px] object-cover"
                  />
                  <span className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                    {review.productName}
                  </span>
                </div>

                {/* Comment */}
                <p className="mb-3 text-gray-700 dark:text-gray-300">{review.comment}</p>

                {/* Reply (if exists) */}
                {review.reply && (
                  <div className="mb-3 ml-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-3 dark:bg-blue-900/20">
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
                      <span className="text-theme-sm font-semibold text-blue-700 dark:text-blue-300">
                        Phản hồi từ Shop
                      </span>
                    </div>
                    <p className="text-theme-sm text-gray-700 dark:text-gray-300">{review.reply}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button className="text-theme-sm inline-flex items-center gap-1.5 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    {review.helpful} hữu ích
                  </button>

                  {review.status === 'pending' && (
                    <>
                      <button className="text-theme-sm inline-flex items-center gap-1.5 font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Duyệt
                      </button>

                      <button className="text-theme-sm inline-flex items-center gap-1.5 font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
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
                    </>
                  )}

                  {review.status === 'approved' && !review.reply && (
                    <button className="text-theme-sm inline-flex items-center gap-1.5 font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300">
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
                  )}

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

      {filteredReviews.length === 0 && (
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
      {filteredReviews.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-amber-50/20 px-6 py-4 sm:flex-row dark:border-gray-800 dark:bg-amber-900/10">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Hiển thị {filteredReviews.length} trong tổng {reviewData.length} đánh giá
          </p>
          <div className="flex items-center gap-2">
            <button className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              Trước
            </button>
            <button className="text-theme-sm bg-brand-500 rounded-lg px-3 py-2 font-medium text-white">
              1
            </button>
            <button className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              2
            </button>
            <button className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
