'use client';
import React, { useState, useEffect } from 'react';
import Badge from '@/components/ui/badge/Badge';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { getAllOrders, OrderListItem } from '@/services/orderService';

export default function OrderTable() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, paymentStatusFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 0) {
        fetchOrders();
      } else {
        setCurrentPage(0);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders(
        currentPage,
        10,
        searchTerm || undefined,
        paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
        statusFilter !== 'all' ? statusFilter : undefined
      );
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string): 'success' | 'error' | 'warning' | 'info' => {
    const upperStatus = status.toUpperCase();
    if (upperStatus.includes('DELIVERED') || upperStatus.includes('RECEIVED')) return 'success';
    if (upperStatus.includes('CANCEL') || upperStatus.includes('RETURNED') || upperStatus.includes('FAILED')) return 'error';
    if (upperStatus.includes('PENDING') || upperStatus.includes('PROCESSING')) return 'warning';
    if (upperStatus.includes('SHIPPED')) return 'info';
    return 'info';
  };

  const getPaymentStatusBadgeColor = (status: string): 'success' | 'error' | 'warning' | 'info' => {
    const upperStatus = status.toUpperCase();
    if (upperStatus.includes('PAID')) return 'success';
    if (upperStatus.includes('REFUND') || upperStatus.includes('CANCEL') || upperStatus.includes('FAILED')) return 'error';
    if (upperStatus.includes('EXPIRED')) return 'info';
    return 'warning';
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
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-sm text-gray-500">Đang tải đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Danh sách đơn hàng
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý và theo dõi tất cả đơn hàng
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative min-w-[250px] flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm đơn hàng, khách hàng..."
              className="focus:border-brand-500 focus:ring-brand-500/20 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
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
          </div>

          {/* Right side: filters */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* Shipping Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="focus:border-brand-500 focus:ring-brand-500/20 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Trạng thái giao hàng</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="SHIPPED">Đã giao cho vận chuyển</option>
              <option value="DELIVERED">Đã giao hàng</option>
              <option value="FAILED_DELIVERY">Giao hàng thất bại</option>
              <option value="RECEIVED">Đã nhận hàng</option>
              <option value="RETURNED">Đã trả hàng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="focus:border-brand-500 focus:ring-brand-500/20 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Trạng thái thanh toán</option>
              <option value="PENDING">Chờ thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="FAILED">Thanh toán thất bại</option>
              <option value="REFUNDED">Đã hoàn tiền</option>
              <option value="EXPIRED">Hết hạn</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
            <TableRow className="border-b border-gray-200 dark:border-gray-800">
              <TableCell
                isHeader
                className="py-3 text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Mã đơn hàng
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Khách hàng
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Tổng tiền
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Trạng thái giao hàng
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Thanh toán
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Ngày tạo
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.map((order) => (
              <TableRow
                key={order.orderId}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
              >
                <TableCell className="py-3 text-center">
                  <Link
                    href={`/orders/${order.orderId}`}
                    className="text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium"
                  >
                    #ORD{order.orderId}
                  </Link>
                </TableCell>
                <TableCell className="py-3 flex justify-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.userName || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.userEmail || 'N/A'}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <Badge color={getStatusBadgeColor(order.currentShippingStatus.statusCode)}>
                    {order.currentShippingStatus.statusName}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <Badge color={getPaymentStatusBadgeColor(order.currentPaymentStatus.statusCode)} size="sm">
                    {order.currentPaymentStatus.statusName}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(order.orderDate)}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/orders/${order.orderId}`}
                      className="hover:text-brand-600 dark:hover:text-brand-400 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      title="Xem chi tiết"
                    >
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.length === 0 && !loading && (
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {orders.length} trong tổng {totalItems} đơn hàng
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0 || loading}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 3) {
                pageNum = i;
              } else if (currentPage > totalPages - 3) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={loading}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1 || loading}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
