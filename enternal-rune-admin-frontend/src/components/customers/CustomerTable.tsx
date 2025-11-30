'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import Link from 'next/link';
import { UserDashboardResponse, AuthProvider } from '@/types/customer';

interface CustomerTableProps {
  customers: UserDashboardResponse[];
  loading?: boolean;
  totalPages: number;
  currentPage: number;
  totalElements: number;
  onSearch: (keyword: string, activated: boolean | null) => void;
  onPageChange: (page: number, keyword: string, activated: boolean | null) => void;
  onDelete: (id: number) => Promise<void>;
}

export default function CustomerTable({
  customers,
  loading,
  totalPages,
  currentPage,
  totalElements,
  onSearch,
  onPageChange,
  onDelete,
}: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'activated' | 'inactivated'>('all');

  const handleSearch = () => {
    const activated = filterStatus === 'all' ? null : filterStatus === 'activated';
    onSearch(searchTerm , activated);
  };

  const handleFilterChange = (value: 'all' | 'activated' | 'inactivated') => {
    setFilterStatus(value);
    const activated = value === 'all' ? null : value === 'activated';
    onSearch(searchTerm , activated);
  };

  const handlePageChange = (page: number) => {
    const activated = filterStatus === 'all' ? null : filterStatus === 'activated';
    onPageChange(page, searchTerm , activated);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      try {
        await onDelete(id);
        // alert('Xóa khách hàng thành công!');
      } catch (error) {
        // alert('Xóa khách hàng thất bại!');
      }
    }
  };

  const getStatusBadgeColor = (activated: boolean) => {
    return activated ? 'success' : 'error';
  };

  const getStatusText = (activated: boolean) => {
    return activated ? 'Đã kích hoạt' : 'Chưa kích hoạt';
  };

  const getAuthProviderBadge = (provider: AuthProvider) => {
    const config: Record<AuthProvider, { color: 'primary' | 'success' | 'warning' | 'error' | 'light'; label: string }> = {
      LOCAL: { color: 'light', label: 'Local' },
      GOOGLE: { color: 'primary', label: 'Google' },
      FACEBOOK: { color: 'warning', label: 'Facebook' },
    };
    return config[provider] || config.LOCAL;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header Section */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách khách hàng
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            {totalElements} khách hàng
          </p>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-theme-sm focus:border-brand-500 focus:ring-brand-500 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
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

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value as 'all' | 'activated' | 'inactivated')}
            className="text-theme-sm focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="activated">Đã kích hoạt</option>
            <option value="inactivated">Chưa kích hoạt</option>
          </select>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-brand-500 text-theme-sm shadow-theme-xs hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white whitespace-nowrap"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                <input
                  type="checkbox"
                  className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                />
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Khách hàng
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                Đăng ký qua
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                Tổng đơn
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-end font-medium text-gray-500 dark:text-gray-400"
              >
                Tổng chi tiêu
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                Trạng thái
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="py-3">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                  </TableCell>
                  <TableCell className="py-3 text-end">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-auto animate-pulse" />
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse" />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : customers.length > 0 ? (
              customers.map((customer) => {
                const providerBadge = getAuthProviderBadge(customer.authProvider);
                return (
                  <TableRow
                    key={customer.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="py-3">
                      <input
                        type="checkbox"
                        className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {customer.name}
                      </p>
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-theme-sm text-gray-800 dark:text-white/90">
                        {customer.email}
                      </p>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge size="sm" color={providerBadge.color}>
                        {providerBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-center text-gray-500 dark:text-gray-400">
                      {customer.totalOrder}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-end font-medium text-gray-800 dark:text-white/90">
                      {customer.totalPrice?.toLocaleString('vi-VN')} ₫
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge size="sm" color={getStatusBadgeColor(customer.activate)}>
                        {getStatusText(customer.activate)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="hover:text-brand-600 dark:hover:text-brand-400 p-2 text-gray-500 dark:text-gray-400"
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
                        <button
                          onClick={() => handleDeleteClick(customer.id)}
                          className="hover:text-error-600 dark:hover:text-error-400 p-2 text-gray-500 dark:text-gray-400"
                          title="Xóa"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : null}
          </TableBody>
        </Table>

        {!loading && customers.length === 0 && (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy khách hàng nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && customers.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Trang {currentPage + 1} / {totalPages} - Tổng {totalElements} khách hàng
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
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
                  onClick={() => handlePageChange(pageNum)}
                  className={`text-theme-sm rounded-lg border px-3 py-2 font-medium ${
                    currentPage === pageNum
                      ? 'bg-brand-600 border-brand-600 text-white hover:bg-brand-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
