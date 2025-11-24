'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import Link from 'next/link';
import { ProductDashboardListResponse, ProductStatus } from '@/types/product';
import { productService } from '@/services/productService';

interface ProductTableProps {
  products: ProductDashboardListResponse[];
  loading?: boolean;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  onSearch: (keyword: string) => void;
  onFilterByStatus: (status: ProductStatus | 'all') => void;
  onFilterByBrand: (brand: string) => void;
  onChangePage: (page: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  products,
  loading,
  pagination,
  onSearch,
  onFilterByStatus,
  onFilterByBrand,
  onChangePage,
  onDelete,
}: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterStatus, setFilterStatus] = useState<ProductStatus | 'all'>('all');

  // Get unique brands from products
  const brands = Array.from(new Set(products.map((product) => product.brandName)));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleStatusChange = (status: string) => {
    setFilterStatus(status as ProductStatus | 'all');
    if (status === 'all') {
      onFilterByStatus('all' as any);
    } else {
      onFilterByStatus(status as ProductStatus);
    }
  };

  const handleBrandChange = (brand: string) => {
    setFilterBrand(brand);
    onFilterByBrand(brand === 'all' ? '' : brand);
  };

  const handleDeleteClick = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${name}"?`)) {
      onDelete(id);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'warning';
      case 'OUT_OF_STOCK':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header Section */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách sản phẩm
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            {pagination.totalElements} sản phẩm
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products/new"
            className="bg-brand-500 text-theme-sm shadow-theme-xs hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 font-medium text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Filter and Search Section */}
      <form onSubmit={handleSearch} className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-theme-sm focus:border-brand-500 focus:ring-brand-500 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Brand Filter */}
          <select
            value={filterBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="text-theme-sm focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-theme-sm focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang bán</option>
            <option value="INACTIVE">Ngừng bán</option>
            <option value="OUT_OF_STOCK">Hết hàng</option>
          </select>
        </div>
      </form>

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
                Sản phẩm
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                SKU
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Thương hiệu
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Giá
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Đánh giá
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
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
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="py-3">
                    <div className="h-4 w-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] bg-gray-200 rounded-md dark:bg-gray-700 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-16 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-24 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-12 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-20 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow
                  key={product.prodId}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <TableCell className="py-3">
                    <input
                      type="checkbox"
                      className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800"
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                          width={50}
                          height={50}
                          src={product.imageUrl || '/images/product/placeholder.jpg'}
                          className="h-[50px] w-[50px] object-cover"
                          alt={product.prodName}
                        />
                      </div>
                      <div>
                        <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                          {product.prodName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.prodColor} - {product.prodVersion}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.prodModel}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {product.brandName}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 font-medium text-gray-800 dark:text-white/90">
                    {productService.formatPrice(product.currentPrice)}
                  </TableCell>
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {product.prodRating.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge size="sm" color={getStatusBadgeColor(product.productStatus)}>
                      {productService.getStatusLabel(product.productStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/products/${product.prodId}/edit`}
                        className="hover:text-brand-600 dark:hover:text-brand-400 p-2 text-gray-500 dark:text-gray-400"
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
                        onClick={() => handleDeleteClick(product.prodId, product.prodName)}
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
              ))
            ) : null}
          </TableBody>
        </Table>

        {!loading && products.length === 0 && (
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
            <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Hiển thị {pagination.page * pagination.size + 1}-
            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} của{' '}
            {pagination.totalElements} sản phẩm
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangePage(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Trước
            </button>
            
            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
              const pageNum = pagination.page < 3 ? i : pagination.page - 2 + i;
              if (pageNum >= pagination.totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onChangePage(pageNum)}
                  className={`text-theme-sm rounded-lg border px-3 py-2 font-medium ${
                    pageNum === pagination.page
                      ? 'bg-brand-600 border-brand-600 hover:bg-brand-700 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              onClick={() => onChangePage(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
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
