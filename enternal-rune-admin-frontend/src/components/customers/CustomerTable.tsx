'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import Link from 'next/link';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  joinDate: string;
  avatar: string;
}

const customerData: Customer[] = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '+84 912 345 678',
    totalOrders: 24,
    totalSpent: 5680.0,
    status: 'vip',
    joinDate: '2024-01-15',
    avatar: '/images/user/user-01.jpg',
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'tranthibinh@email.com',
    phone: '+84 923 456 789',
    totalOrders: 8,
    totalSpent: 1250.0,
    status: 'active',
    joinDate: '2024-03-20',
    avatar: '/images/user/user-02.jpg',
  },
  {
    id: 3,
    name: 'Lê Hoàng Cường',
    email: 'lehoangcuong@email.com',
    phone: '+84 934 567 890',
    totalOrders: 45,
    totalSpent: 12450.0,
    status: 'vip',
    joinDate: '2023-11-05',
    avatar: '/images/user/user-03.jpg',
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    email: 'phamthidung@email.com',
    phone: '+84 945 678 901',
    totalOrders: 3,
    totalSpent: 450.0,
    status: 'active',
    joinDate: '2024-08-10',
    avatar: '/images/user/user-04.jpg',
  },
  {
    id: 5,
    name: 'Hoàng Văn Em',
    email: 'hoangvanem@email.com',
    phone: '+84 956 789 012',
    totalOrders: 0,
    totalSpent: 0,
    status: 'inactive',
    joinDate: '2024-09-01',
    avatar: '/images/user/user-05.jpg',
  },
  {
    id: 6,
    name: 'Võ Thị Phương',
    email: 'vothiphuong@email.com',
    phone: '+84 967 890 123',
    totalOrders: 18,
    totalSpent: 3890.0,
    status: 'active',
    joinDate: '2024-02-28',
    avatar: '/images/user/user-06.jpg',
  },
  {
    id: 7,
    name: 'Đỗ Văn Giang',
    email: 'dovangiang@email.com',
    phone: '+84 978 901 234',
    totalOrders: 32,
    totalSpent: 8920.0,
    status: 'vip',
    joinDate: '2023-12-10',
    avatar: '/images/user/user-07.jpg',
  },
  {
    id: 8,
    name: 'Bùi Thị Hạnh',
    email: 'buithihanh@email.com',
    phone: '+84 989 012 345',
    totalOrders: 5,
    totalSpent: 780.0,
    status: 'active',
    joinDate: '2024-06-15',
    avatar: '/images/user/user-08.jpg',
  },
];

export default function CustomerTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredCustomers = customerData.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status: Customer['status']) => {
    switch (status) {
      case 'vip':
        return 'warning';
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusText = (status: Customer['status']) => {
    switch (status) {
      case 'vip':
        return 'VIP';
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
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
            Danh sách khách hàng
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            {filteredCustomers.length} khách hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/customers/new"
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
            Thêm khách hàng
          </Link>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
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

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-theme-sm focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="vip">VIP</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        {/* Export Button */}
        <button className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium whitespace-nowrap text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                Liên hệ
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Tổng đơn
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Tổng chi tiêu
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Ngày tham gia
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
            {filteredCustomers.length > 0
              ? filteredCustomers.map((customer) => (
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
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={customer.avatar}
                            className="h-10 w-10 object-cover"
                            alt={customer.name}
                          />
                        </div>
                        <div>
                          <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                            {customer.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div>
                        <p className="text-theme-sm text-gray-800 dark:text-white/90">
                          {customer.email}
                        </p>
                        <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                          {customer.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {customer.totalOrders}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 font-medium text-gray-800 dark:text-white/90">
                      ${customer.totalSpent.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge size="sm" color={getStatusBadgeColor(customer.status)}>
                        {getStatusText(customer.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
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
                        </button>
                        <Link
                          href={`/customers/${customer.id}/edit`}
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

        {filteredCustomers.length === 0 && (
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
      {filteredCustomers.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Hiển thị 1-{filteredCustomers.length} của {customerData.length} khách hàng
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
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
