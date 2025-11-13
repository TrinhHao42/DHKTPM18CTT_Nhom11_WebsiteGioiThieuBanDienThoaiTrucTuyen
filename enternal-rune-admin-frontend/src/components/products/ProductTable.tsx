'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import Link from 'next/link';

// Define the TypeScript interface for the product
interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  image: string;
}

// Sample product data
const productData: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 13"',
    sku: 'MBP-13-001',
    category: 'Laptop',
    price: 2399.0,
    stock: 45,
    status: 'active',
    image: '/images/product/product-01.jpg',
  },
  {
    id: 2,
    name: 'Apple Watch Ultra',
    sku: 'AW-ULT-002',
    category: 'Watch',
    price: 879.0,
    stock: 0,
    status: 'out-of-stock',
    image: '/images/product/product-02.jpg',
  },
  {
    id: 3,
    name: 'iPhone 15 Pro Max',
    sku: 'IPH-15PM-003',
    category: 'Smartphone',
    price: 1869.0,
    stock: 128,
    status: 'active',
    image: '/images/product/product-03.jpg',
  },
  {
    id: 4,
    name: 'iPad Pro 3rd Gen',
    sku: 'IPD-PRO3-004',
    category: 'Tablet',
    price: 1699.0,
    stock: 32,
    status: 'active',
    image: '/images/product/product-04.jpg',
  },
  {
    id: 5,
    name: 'AirPods Pro 2nd Gen',
    sku: 'AP-PRO2-005',
    category: 'Accessories',
    price: 240.0,
    stock: 5,
    status: 'active',
    image: '/images/product/product-05.jpg',
  },
  {
    id: 6,
    name: 'Magic Keyboard',
    sku: 'MK-001',
    category: 'Accessories',
    price: 149.0,
    stock: 78,
    status: 'active',
    image: '/images/product/product-01.jpg',
  },
  {
    id: 7,
    name: 'Magic Mouse',
    sku: 'MM-002',
    category: 'Accessories',
    price: 89.0,
    stock: 0,
    status: 'out-of-stock',
    image: '/images/product/product-02.jpg',
  },
  {
    id: 8,
    name: 'MacBook Air M2',
    sku: 'MBA-M2-008',
    category: 'Laptop',
    price: 1299.0,
    stock: 64,
    status: 'active',
    image: '/images/product/product-03.jpg',
  },
];

export default function ProductTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get unique categories
  const categories = Array.from(new Set(productData.map((product) => product.category)));

  // Filter products based on search and filters
  const filteredProducts = productData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadgeColor = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'out-of-stock':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'Đang bán';
      case 'inactive':
        return 'Tạm ngưng';
      case 'out-of-stock':
        return 'Hết hàng';
      default:
        return status;
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
            {filteredProducts.length} sản phẩm
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
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-theme-sm focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-theme-sm focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Tạm ngưng</option>
            <option value="out-of-stock">Hết hàng</option>
          </select>

          {/* Export Button */}
          <button className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Xuất file
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
                Danh mục
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
                Tồn kho
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
            {filteredProducts.length > 0
              ? filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
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
                            src={product.image}
                            className="h-[50px] w-[50px] object-cover"
                            alt={product.name}
                          />
                        </div>
                        <div>
                          <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {product.sku}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 font-medium text-gray-800 dark:text-white/90">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      <span
                        className={`${
                          product.stock === 0
                            ? 'text-error-600 dark:text-error-400'
                            : product.stock < 10
                              ? 'text-orange-600 dark:text-orange-400'
                              : ''
                        }`}
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge size="sm" color={getStatusBadgeColor(product.status)}>
                        {getStatusText(product.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/products/${product.id}/edit`}
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
              : null}
          </TableBody>
        </Table>

        {filteredProducts.length === 0 && (
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
      {filteredProducts.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Hiển thị 1-{filteredProducts.length} của {productData.length} sản phẩm
          </p>
          <div className="flex items-center gap-2">
            <button className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              Trước
            </button>
            <button className="text-theme-sm bg-brand-600 border-brand-600 hover:bg-brand-700 rounded-lg border px-3 py-2 font-medium text-white">
              1
            </button>
            <button className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              2
            </button>
            <button className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              3
            </button>
            <button className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
