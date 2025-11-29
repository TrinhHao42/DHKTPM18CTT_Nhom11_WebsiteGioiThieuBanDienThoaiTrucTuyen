'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { BrandDashboardListResponse } from '@/types/brand';

interface BrandTableProps {
  brands: BrandDashboardListResponse[];
  loading?: boolean;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  onSearch: (keyword: string) => void;
  onChangePage: (page: number) => void;
  onDelete: (id: number) => void;
}

export default function BrandTable({
  brands,
  loading,
  pagination,
  onSearch,
  onChangePage,
  onDelete,
}: BrandTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleDeleteClick = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa thương hiệu "${name}"?\nĐiều này có thể ảnh hưởng đến các sản phẩm liên quan.`)) {
      onDelete(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      true: { bg: 'bg-success-100 dark:bg-success-900/30', text: 'text-success-700 dark:text-success-400', label: 'Hoạt động' },
      false: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', label: 'Không hoạt động' },
    };
    const config = statusConfig[status] || statusConfig.INACTIVE;
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Generate page numbers
  const pageNumbers = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(0, pagination.page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(pagination.totalPages - 1, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách thương hiệu
          </h3>
          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
            {pagination.totalElements} thương hiệu
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/brands/new"
            className="bg-brand-500 text-sm shadow-xs hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm thương hiệu
          </Link>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-800/30">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
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
              placeholder="Tìm kiếm thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </form>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 pl-6 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                />
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Thương hiệu
              </TableCell>
              <TableCell
                isHeader
                className="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                Số lượng sản phẩm
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
                Hành động
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              // Loading skeleton
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-3 pl-6">
                    <div className="h-4 w-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-lg dark:bg-gray-700 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-32 animate-pulse"></div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-16 mx-auto animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mx-auto animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : brands.length > 0 && (
              brands.map((brand, index) => (
                <TableRow
                  key={brand.brandId || index}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="py-3 pl-6">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-brand-600 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      {brand.brandLogoUrl ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={brand.brandLogoUrl}
                            alt={brand.brandName}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {brand.brandName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-800 dark:text-white/90">
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      {brand.productCount}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    {getStatusBadge(brand.brandStatus)}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/brands/${brand.brandId}/edit`}
                        className="p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
                        title="Chỉnh sửa"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(brand.brandId, brand.brandName)}
                        className="p-2 text-gray-500 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400"
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
              ))
            )}
          </TableBody>
        </Table>
        
      {!loading && brands.length === 0 && (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy thương hiệu nào</p>
          </div>
        )}
      </div>


      {/* Pagination */}
      {brands.length > 0 && pagination.totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50/30 px-6 py-4 sm:flex-row dark:border-gray-800 dark:bg-gray-800/20">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị trang {pagination.page + 1} / {pagination.totalPages} ({pagination.totalElements} thương hiệu)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangePage(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Trước
            </button>
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onChangePage(pageNum)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                  pageNum === pagination.page
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]'
                }`}
              >
                {pageNum + 1}
              </button>
            ))}
            <button
              onClick={() => onChangePage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
