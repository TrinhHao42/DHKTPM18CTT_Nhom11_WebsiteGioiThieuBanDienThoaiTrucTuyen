'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import Link from 'next/link';

interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'active' | 'on-leave' | 'inactive';
  joinDate: string;
  avatar: string;
}

const staffData: Staff[] = [
  {
    id: 1,
    name: 'Nguyễn Văn Quản',
    email: 'quannv@company.com',
    phone: '+84 901 234 567',
    position: 'Quản lý',
    department: 'Quản lý',
    status: 'active',
    joinDate: '2022-01-15',
    avatar: '/images/user/user-09.jpg',
  },
  {
    id: 2,
    name: 'Trần Thị Hoa',
    email: 'hoatt@company.com',
    phone: '+84 902 345 678',
    position: 'Nhân viên bán hàng',
    department: 'Bán hàng',
    status: 'active',
    joinDate: '2022-03-20',
    avatar: '/images/user/user-10.jpg',
  },
  {
    id: 3,
    name: 'Lê Văn Tài',
    email: 'tailv@company.com',
    phone: '+84 903 456 789',
    position: 'Kế toán',
    department: 'Tài chính',
    status: 'active',
    joinDate: '2022-05-10',
    avatar: '/images/user/user-11.jpg',
  },
  {
    id: 4,
    name: 'Phạm Thị Mai',
    email: 'maipt@company.com',
    phone: '+84 904 567 890',
    position: 'Nhân viên kho',
    department: 'Kho vận',
    status: 'on-leave',
    joinDate: '2023-02-01',
    avatar: '/images/user/user-12.jpg',
  },
  {
    id: 5,
    name: 'Hoàng Văn Nam',
    email: 'namhv@company.com',
    phone: '+84 905 678 901',
    position: 'IT Support',
    department: 'Công nghệ',
    status: 'active',
    joinDate: '2023-06-15',
    avatar: '/images/user/user-13.jpg',
  },
  {
    id: 6,
    name: 'Võ Thị Lan',
    email: 'lanvt@company.com',
    phone: '+84 906 789 012',
    position: 'Marketing',
    department: 'Marketing',
    status: 'active',
    joinDate: '2023-08-20',
    avatar: '/images/user/user-14.jpg',
  },
  {
    id: 7,
    name: 'Đỗ Văn Hùng',
    email: 'hungdv@company.com',
    phone: '+84 907 890 123',
    position: 'Nhân viên bán hàng',
    department: 'Bán hàng',
    status: 'inactive',
    joinDate: '2022-11-05',
    avatar: '/images/user/user-15.jpg',
  },
  {
    id: 8,
    name: 'Bùi Thị Thảo',
    email: 'thaobt@company.com',
    phone: '+84 908 901 234',
    position: 'HR',
    department: 'Nhân sự',
    status: 'active',
    joinDate: '2023-01-10',
    avatar: '/images/user/user-16.jpg',
  },
];

export default function StaffTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Get unique departments
  const departments = Array.from(new Set(staffData.map((staff) => staff.department)));

  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadgeColor = (status: Staff['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'on-leave':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusText = (status: Staff['status']) => {
    switch (status) {
      case 'active':
        return 'Đang làm việc';
      case 'on-leave':
        return 'Nghỉ phép';
      case 'inactive':
        return 'Đã nghỉ việc';
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
            Danh sách nhân viên
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            {filteredStaff.length} nhân viên
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/staff/new"
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
            Thêm nhân viên
          </Link>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Bộ lọc và tìm kiếm */}
        <div className="flex flex-col gap-3 sm:w-full sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
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

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="text-theme-sm focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 focus:ring-1 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="all">Tất cả phòng ban</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
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
            <option value="active">Đang làm việc</option>
            <option value="on-leave">Nghỉ phép</option>
            <option value="inactive">Đã nghỉ việc</option>
          </select>
        </div>

        {/* Export Button */}
        <button className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium whitespace-nowrap text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
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
                Nhân viên
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
                Chức vụ
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Phòng ban
              </TableCell>
              <TableCell
                isHeader
                className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
              >
                Ngày vào làm
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
            {filteredStaff.length > 0
              ? filteredStaff.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
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
                            src={staff.avatar}
                            className="h-10 w-10 object-cover"
                            alt={staff.name}
                          />
                        </div>
                        <div>
                          <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                            {staff.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div>
                        <p className="text-theme-sm text-gray-800 dark:text-white/90">
                          {staff.email}
                        </p>
                        <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                          {staff.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {staff.position}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {staff.department}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {new Date(staff.joinDate).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge size="sm" color={getStatusBadgeColor(staff.status)}>
                        {getStatusText(staff.status)}
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
                          href={`/staff/${staff.id}/edit`}
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

        {filteredStaff.length === 0 && (
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy nhân viên nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredStaff.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Hiển thị 1-{filteredStaff.length} của {staffData.length} nhân viên
          </p>
          <div className="flex items-center gap-2">
            <button className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
              Trước
            </button>
            <button className="text-theme-sm bg-brand-600 border-brand-600 hover:bg-brand-700 rounded-lg border px-3 py-2 font-medium text-white">
              1
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
