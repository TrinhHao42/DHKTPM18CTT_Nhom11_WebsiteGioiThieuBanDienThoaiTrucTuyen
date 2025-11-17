'use client';
import React, { useState } from 'react';
import Badge from '@/components/ui/badge/Badge';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

type CancelRequest = {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  total: number;
  status: 'pending' |'completed' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  paymentMethod: string;
  createdAt: string;
};

// Mock data
const cancelRequestData: CancelRequest[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      avatar: '/images/user/user-01.jpg',
    },
    total: 1250000,
    status: 'completed',
    paymentStatus: 'refunded',
    paymentMethod: 'COD',
    createdAt: '2024-03-15',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      avatar: '/images/user/user-02.jpg',
    },
    total: 850000,
    status: 'pending',
    paymentStatus: 'paid',
    paymentMethod: 'Banking',
    createdAt: '2024-03-14',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      avatar: '/images/user/user-03.jpg',
    },
    total: 3200000,
    status: 'pending',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    createdAt: '2024-03-14',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      name: 'Phạm Thị D',
      email: 'phamthid@email.com',
      avatar: '/images/user/user-04.jpg',
    },
    total: 1650000,
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: 'COD',
    createdAt: '2024-03-13',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customer: {
      name: 'Hoàng Văn E',
      email: 'hoangvane@email.com',
      avatar: '/images/user/user-05.jpg',
    },
    total: 2100000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'E-Wallet',
    createdAt: '2024-03-13',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customer: {
      name: 'Vũ Thị F',
      email: 'vuthif@email.com',
      avatar: '/images/user/user-06.jpg',
    },
    total: 450000,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'Banking',
    createdAt: '2024-03-12',
  }
];

export default function CancelRequestTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');

  // Filter logic
  const filteredCancelRequests = cancelRequestData.filter((cancelRequest) => {
    const matchesSearch =
      cancelRequest.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancelRequest.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancelRequest.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cancelRequest.status === statusFilter;

    const matchesPaymentStatus =
      paymentStatusFilter === 'all' || cancelRequest.paymentStatus === paymentStatusFilter;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const getStatusBadgeColor = (status: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'info';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã từ chối';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  const getPaymentStatusBadgeColor = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'unpaid':
        return 'warning';
      case 'refunded':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getPaymentStatusText = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'unpaid':
        return 'Chưa thanh toán';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
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
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
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

          {/* Right side: filters + export */}
          <div className="flex flex-wrap items-center justify-end gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="focus:border-brand-500 focus:ring-brand-500/20 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="focus:border-brand-500 focus:ring-brand-500/20 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">Thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="refunded">Đã hoàn tiền</option>
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
                className="w-12 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <input
                  type="checkbox"
                  className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                />
              </TableCell>
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
                Trạng thái
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
                Ngày yêu cầu
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
            {filteredCancelRequests.map((cancelRequest) => (
              <TableRow
                key={cancelRequest.id}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02]"
              >
                <TableCell className="py-3 text-center">
                  <input
                    type="checkbox"
                    className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                  />
                </TableCell>
                <TableCell className="py-3">
                  <Link
                    href={`/cancel-requests/${cancelRequest.id}`}
                    className="text-brand-600 hover:text-brand-700 dark:text-brand-400 font-medium"
                  >
                    {cancelRequest.orderNumber}
                  </Link>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cancelRequest.customer.avatar}
                      alt={cancelRequest.customer.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {cancelRequest.customer.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {cancelRequest.customer.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(cancelRequest.total)}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{cancelRequest.paymentMethod}</p>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <Badge color={getStatusBadgeColor(cancelRequest.status)}>
                    {getStatusText(cancelRequest.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <Badge color={getPaymentStatusBadgeColor(cancelRequest.paymentStatus)} size="sm">
                    {getPaymentStatusText(cancelRequest.paymentStatus)}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(cancelRequest.createdAt)}
                </TableCell>
                <TableCell className="py-3 text-center">
                    <Link
                      href={`/cancel-requests/${cancelRequest.id}`}
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCancelRequests.length === 0 && (
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
            <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy yêu cầu nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCancelRequests.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              Trước
            </button>
            <button className="bg-brand-600 border-brand-600 hover:bg-brand-700 rounded-lg border px-3 py-2 text-sm font-medium text-white transition-colors">
              1
            </button>
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              2
            </button>
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              3
            </button>
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
