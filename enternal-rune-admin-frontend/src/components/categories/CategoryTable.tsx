'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Badge from '@/components/ui/badge/Badge';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
  image: string;
  productsCount: number;
  status: 'active' | 'inactive';
  order: number;
  createdAt: string;
  level: number; // Thêm level để hiển thị indent
};

// Mock data với cấu trúc phân cấp
const categoryData: Category[] = [
  // Level 0 - Parent categories
  {
    id: '1',
    name: 'Điện thoại',
    slug: 'dien-thoai',
    description: 'Điện thoại thông minh các loại',
    parent: null,
    image: '/images/product/product-01.jpg',
    productsCount: 234,
    status: 'active',
    order: 1,
    createdAt: '2024-01-15',
    level: 0,
  },
  // Level 1 - Children of Điện thoại
  {
    id: '2',
    name: 'iPhone',
    slug: 'iphone',
    description: 'Dòng điện thoại Apple iPhone',
    parent: 'Điện thoại',
    image: '/images/product/product-02.jpg',
    productsCount: 89,
    status: 'active',
    order: 1,
    createdAt: '2024-01-16',
    level: 1,
  },
  {
    id: '3',
    name: 'Samsung',
    slug: 'samsung',
    description: 'Điện thoại Samsung Galaxy',
    parent: 'Điện thoại',
    image: '/images/product/product-03.jpg',
    productsCount: 67,
    status: 'active',
    order: 2,
    createdAt: '2024-01-17',
    level: 1,
  },
  {
    id: '10',
    name: 'Xiaomi',
    slug: 'xiaomi',
    description: 'Điện thoại Xiaomi Mi, Redmi',
    parent: 'Điện thoại',
    image: '/images/product/product-04.jpg',
    productsCount: 78,
    status: 'active',
    order: 3,
    createdAt: '2024-01-23',
    level: 1,
  },
  // Level 0
  {
    id: '4',
    name: 'Laptop',
    slug: 'laptop',
    description: 'Máy tính xách tay',
    parent: null,
    image: '/images/product/product-04.jpg',
    productsCount: 156,
    status: 'active',
    order: 2,
    createdAt: '2024-01-18',
    level: 0,
  },
  // Level 1
  {
    id: '5',
    name: 'MacBook',
    slug: 'macbook',
    description: 'Laptop Apple MacBook',
    parent: 'Laptop',
    image: '/images/product/product-01.jpg',
    productsCount: 45,
    status: 'active',
    order: 1,
    createdAt: '2024-01-19',
    level: 1,
  },
  {
    id: '11',
    name: 'Dell',
    slug: 'dell',
    description: 'Laptop Dell XPS, Inspiron',
    parent: 'Laptop',
    image: '/images/product/product-02.jpg',
    productsCount: 56,
    status: 'active',
    order: 2,
    createdAt: '2024-01-24',
    level: 1,
  },
  // Level 0
  {
    id: '6',
    name: 'Tablet',
    slug: 'tablet',
    description: 'Máy tính bảng',
    parent: null,
    image: '/images/product/product-02.jpg',
    productsCount: 89,
    status: 'active',
    order: 3,
    createdAt: '2024-01-20',
    level: 0,
  },
  // Level 0
  {
    id: '7',
    name: 'Phụ kiện',
    slug: 'phu-kien',
    description: 'Phụ kiện điện tử',
    parent: null,
    image: '/images/product/product-03.jpg',
    productsCount: 342,
    status: 'active',
    order: 4,
    createdAt: '2024-01-21',
    level: 0,
  },
  // Level 1
  {
    id: '8',
    name: 'Tai nghe',
    slug: 'tai-nghe',
    description: 'Tai nghe, earbuds',
    parent: 'Phụ kiện',
    image: '/images/product/product-04.jpg',
    productsCount: 123,
    status: 'active',
    order: 1,
    createdAt: '2024-01-22',
    level: 1,
  },
  {
    id: '9',
    name: 'Sạc & Cáp',
    slug: 'sac-cap',
    description: 'Sạc dự phòng, cáp sạc',
    parent: 'Phụ kiện',
    image: '/images/product/product-01.jpg',
    productsCount: 156,
    status: 'active',
    order: 2,
    createdAt: '2024-01-22',
    level: 1,
  },
];

export default function CategoryTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // Filter logic
  const filteredCategories = categoryData.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || category.status === statusFilter;

    const matchesLevel =
      levelFilter === 'all' ||
      (levelFilter === 'parent' && category.parent === null) ||
      (levelFilter === 'child' && category.parent !== null);

    return matchesSearch && matchesStatus && matchesLevel;
  });

  // Sort categories by order
  const sortedCategories = filteredCategories.sort((a, b) => {
    return a.order - b.order;
  });

  const getStatusBadgeColor = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Tạm ẩn';
      default:
        return status;
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-theme-lg font-semibold text-gray-800 dark:text-white/90">
              Danh sách danh mục
            </h3>
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">
              Quản lý danh mục sản phẩm
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Thêm danh mục
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dark:border-white-800 bg-white-50/50 dark:bg-white-800/30 border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm ẩn</option>
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">Tất cả cấp</option>
            <option value="parent">Danh mục cha</option>
            <option value="child">Danh mục con</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-y border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-800/30">
            <TableRow>
              <TableCell
                isHeader
                className="text-theme-xs py-3 pl-4 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800"
                />
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Tên danh mục
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Slug
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                Sản phẩm
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-center font-medium text-gray-500 dark:text-gray-400"
              >
                Thứ tự
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
                Hành động
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedCategories.map((category) => (
              <TableRow
                key={category.id}
                className="transition-colors hover:bg-purple-50/30 dark:hover:bg-purple-900/10"
              >
                <TableCell className="py-3 pl-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800"
                  />
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="flex-shrink-0 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                      <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <code className="text-theme-sm rounded bg-gray-100 px-2 py-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <span className="text-theme-sm inline-flex items-center gap-1 font-medium text-gray-800 dark:text-white/90">
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
                    {category.productsCount}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <span className="text-theme-sm inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {category.order}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-center">
                  <Badge size="sm" color={getStatusBadgeColor(category.status)}>
                    {getStatusText(category.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-2 text-gray-500 transition-colors hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
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
                    </button>
                    <button
                      className="hover:text-error-600 dark:hover:text-error-400 p-2 text-gray-500 transition-colors dark:text-gray-400"
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
            ))}
          </TableBody>
        </Table>

        {sortedCategories.length === 0 && (
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy danh mục nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {sortedCategories.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50/30 px-6 py-4 sm:flex-row dark:border-gray-800 dark:bg-gray-800/20">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Hiển thị {sortedCategories.length} trong tổng {categoryData.length} danh mục
          </p>
          <div className="flex items-center gap-2">
            <button className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              Trước
            </button>
            <button className="text-theme-sm rounded-lg border border-purple-600 bg-purple-600 px-3 py-2 font-medium text-white transition-colors hover:bg-purple-700">
              1
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
