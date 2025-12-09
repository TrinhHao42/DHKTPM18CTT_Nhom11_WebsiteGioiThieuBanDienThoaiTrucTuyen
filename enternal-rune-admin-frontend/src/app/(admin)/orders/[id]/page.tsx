'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import Badge from '@/components/ui/badge/Badge';
import { getOrderDetail, OrderDetail } from '@/services/orderService';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderDetail(parseInt(orderId));
      setOrder(data);
    } catch (err: any) {
      console.error('Error fetching order detail:', err);
      setError(err?.response?.data?.message || 'Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
        <PageBreadCrumb pageTitle="Chi tiết đơn hàng" />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-gray-500">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
        <PageBreadCrumb pageTitle="Chi tiết đơn hàng" />
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Không tìm thấy đơn hàng</h3>
          <p className="mb-4 text-sm text-gray-500">{error || 'Đơn hàng không tồn tại hoặc đã bị xóa'}</p>
          <button
            onClick={() => router.push('/orders')}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb */}
      <PageBreadCrumb pageTitle={`Chi tiết đơn hàng #ORD${order.orderId}`} />

      {/* Back Button */}
      <button
        onClick={() => router.push('/orders')}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại danh sách
      </button>

      {/* Order Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Đơn hàng #ORD{order.orderId}</h2>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(order.orderDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Items & Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Sản phẩm ({order.orderDetails.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.orderDetails.map((item, index) => (
                <div key={index} className="flex gap-4 p-6">
                  <img
                    src={item.productVariantResponse.imageUrl || '/placeholder.png'}
                    alt={item.productVariantResponse.variantName}
                    className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.productVariantResponse.variantName}
                    </h4>
                    {item.productVariantResponse.color && (
                      <p className="mt-1 text-sm text-gray-500">
                        Màu sắc: {item.productVariantResponse.color}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(item.productVariantResponse.price)} / sản phẩm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Địa chỉ giao hàng
            </h3> 
            {order.orderShippingAddress ? (
              <div className="space-y-2 text-sm text-gray-600">
                <span>{order.orderShippingAddress.streetName}, </span>
                <span>{order.orderShippingAddress.wardName}, </span>
                <span>{order.orderShippingAddress.cityName}, </span>
                <span>{order.orderShippingAddress.countryName}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Chưa có địa chỉ giao hàng</p>
            )}
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Địa chỉ giao hàng
            </h3> 
            {order.orderShippingAddress ? (
              <div className="space-y-2 text-sm text-gray-600">
                <span>{order.orderShippingAddress.streetName}, </span>
                <span>{order.orderShippingAddress.wardName}, </span>
                <span>{order.orderShippingAddress.cityName}, </span>
                <span>{order.orderShippingAddress.countryName}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Chưa có địa chỉ giao hàng</p>
            )}
          </div>
        </div>

        {/* Right Column - Customer & Payment Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Thông tin khách hàng
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Họ tên</p>
                <p className="font-medium text-gray-900">{order.orderUser.userName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{order.orderUser.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Thông tin thanh toán
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(order.orderTotalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="font-medium text-green-600">Miễn phí</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(order.orderTotalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Section - Full Width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Status History */}
        {order.paymentStatusHistory && order.paymentStatusHistory.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Lịch sử thanh toán
            </h3>
            <div className="space-y-3">
              {order.paymentStatusHistory.map((status, index) => (
                <div 
                  key={`payment-${status.statusId}-${index}`}
                  className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{status.statusName}</p>
                      <p className="text-xs text-gray-500 mt-1">{status.note}</p>
                      {status.description && (
                        <p className="text-xs text-gray-400 mt-1">{status.description}</p>
                      )}
                    </div>
                    <Badge 
                      color={
                        status.statusCode === 'PAID' ? 'success' : 
                        status.statusCode === 'PENDING' ? 'warning' : 
                        status.statusCode === 'FAILED' ? 'error' : 'info'
                      }
                    >
                      {status.statusCode}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(status.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Status History */}
        {order.shippingStatusHistory && order.shippingStatusHistory.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Lịch sử giao hàng
            </h3>
            <div className="space-y-3">
              {order.shippingStatusHistory.map((status, index) => (
                <div 
                  key={`shipping-${status.statusId}-${index}`}
                  className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                >
                  <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-white ${
                    status.statusCode === 'DELIVERED' ? 'bg-green-500' :
                    status.statusCode === 'SHIPPED' ? 'bg-blue-500' :
                    status.statusCode === 'PROCESSING' ? 'bg-yellow-500' :
                    status.statusCode === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{status.statusName}</p>
                      <p className="text-xs text-gray-500 mt-1">{status.note}</p>
                      {status.description && (
                        <p className="text-xs text-gray-400 mt-1">{status.description}</p>
                      )}
                    </div>
                    <Badge 
                      color={
                        status.statusCode === 'DELIVERED' ? 'success' :
                        status.statusCode === 'SHIPPED' ? 'info' :
                        status.statusCode === 'PROCESSING' ? 'warning' :
                        status.statusCode === 'CANCELLED' ? 'error' : 'info'
                      }
                    >
                      {status.statusCode}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(status.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
