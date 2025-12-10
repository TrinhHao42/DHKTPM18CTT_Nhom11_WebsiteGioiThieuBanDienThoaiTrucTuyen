'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import Image from 'next/image';
import Link from 'next/link';
// Đảm bảo import toast nếu bạn đang sử dụng nó (ví dụ: react-hot-toast)
import { staffService } from '@/services/staffService';
import { StaffResponse } from '@/types/staff';
import toast from 'react-hot-toast';
// Khai báo lại interface cho dữ liệu trang (Page) từ StaffResponse
interface StaffPageResponse {
  content: StaffResponse[];
  totalElements: number;
  totalPages: number;
  number: number; // current page number (zero-based)
  size: number; // page size
}

const initialPageData: StaffPageResponse = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: 10,
};

export default function StaffTable() {
  const [pageData, setPageData] = useState<StaffPageResponse>(initialPageData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Hàm gọi API lấy dữ liệu nhân viên (Dùng useCallback để tối ưu)
  const fetchStaffs = useCallback(async (page: number, size: number, keyword: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const data: any = await staffService.getDashboard(keyword, page, size, status);

      setPageData({
        content: data.content || [],
        totalElements: data.totalElements || 0,
        totalPages: data.totalPages || 0,
        number: data.number || 0,
        size: data.size || size,
      });

    } catch (err: any) {
      console.error("Error fetching staff data:", err);
      setError(err.message || 'Lỗi khi tải danh sách nhân viên.');
      setPageData(initialPageData);
    } finally {
      setLoading(false);
    }
  }, []); // Không có dependency vì các state (searchTerm, filterStatus, currentPage) sẽ được truyền trực tiếp khi gọi

  const handleDeleteStaff = async (staffId: number, staffName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhân viên ${staffName} (ID: ${staffId}) không? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      // Gọi API xóa nhân viên
      await staffService.deleteStaff(staffId);
      toast.success(`Đã xóa nhân viên ${staffName} thành công.`);
      // Sau khi xóa, làm mới danh sách:
      // 1. Kiểm tra nếu trang hiện tại không còn nhân viên nào (ví dụ: xóa item cuối cùng của trang)
      const isLastItemOnPage = pageData.content.length === 1 && currentPage > 0;

      // 2. Nếu là item cuối cùng, quay lại trang trước
      if (isLastItemOnPage) {
        setCurrentPage(currentPage - 1);
      } else {
        // 3. Nếu không, tải lại trang hiện tại để cập nhật danh sách
        fetchStaffs(currentPage, pageSize, searchTerm, filterStatus);
      }

    } catch (err: any) {
      console.error("Error deleting staff:", err);
      toast.error(`Lỗi khi xóa nhân viên ${staffName}: ${err.message || 'Lỗi API'}`);
    }
  };
  // **********************************************

  // useEffect để xử lý Debounce và Reset trang khi Search/Filter thay đổi
  useEffect(() => {
    const handler = setTimeout(() => {
      if (currentPage !== 0) {
        setCurrentPage(0);
      } else {
        fetchStaffs(currentPage, pageSize, searchTerm, filterStatus);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, filterStatus, currentPage, pageSize, fetchStaffs]); // 

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageData.totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Helper function để hiển thị Badge
  const getStatusBadgeColor = (status: boolean | undefined) => {
    if (status === true) return 'success';
    if (status === false) return 'error';
    return 'primary';
  };

  // Helper function để hiển thị text trạng thái
  const getStatusText = (status: boolean | undefined) => {
    if (status === true) return 'Đang hoạt động';
    if (status === false) return 'Ngừng hoạt động';
    return 'Không xác định';
  };

  // Render component
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header Section */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách nhân viên
          </h3>
          <p className="text-theme-sm mt-1 text-gray-500 dark:text-gray-400">
            {loading ? 'Đang tải...' : `${pageData.totalElements} nhân viên`}
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
        <div className="flex flex-col gap-3 sm:w-full sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
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
            <option value="activated">Đang hoạt động</option>
            <option value="notActivated">Ngừng hoạt động</option>
          </select>
        </div>

        
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-brand-500 border-t-transparent" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-error-600 dark:text-error-400">🚨 {error}</p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Vui lòng thử lại sau.</p>
          </div>
        ) : (
          <Table>
            {/* Table Header */}
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                  <input type="checkbox" className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800" />
                </TableCell>
                <TableCell isHeader className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                  Nhân viên
                </TableCell>
                <TableCell isHeader className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                  Liên hệ
                </TableCell>
                <TableCell isHeader className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                  Vai trò
                </TableCell>
                <TableCell isHeader className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                  Địa chỉ
                </TableCell>
                <TableCell isHeader className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                  Trạng thái
                </TableCell>
                <TableCell isHeader className="text-theme-xs py-3 text-center font-medium text-gray-500 dark:text-gray-400">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {pageData.content.length > 0 ? (
                pageData.content.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <TableCell className="py-3">
                      <input type="checkbox" className="text-brand-600 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800" />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                            {staff.name ? staff.name[0] : 'N'}
                          </span>
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
                      </div>
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {staff.role?.roleName || 'N/A'}
                    </TableCell>
                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {`${staff.address.streetName || 'N/A'}, ${staff.address.wardName || 'N/A'}, ${staff.address.cityName || 'N/A'}`}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge size="sm" color={getStatusBadgeColor(staff.status)}>
                        {getStatusText(staff.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center justify-center gap-2">
                      
                        <button
                          
                          onClick={() => staff.id && staff.name && handleDeleteStaff(staff.id, staff.name)}
                          className="hover:text-error-600 dark:hover:text-error-400 p-2 text-gray-500 dark:text-gray-400"
                          title="Xóa"
                        >
                          {/* Delete Icon */}
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-12">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="mt-4 text-gray-500 dark:text-gray-400">Không tìm thấy nhân viên nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {pageData.totalElements > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Hiển thị {pageData.number * pageData.size + 1}-{(pageData.number + 1) * pageData.size > pageData.totalElements ? pageData.totalElements : (pageData.number + 1) * pageData.size} của {pageData.totalElements} nhân viên
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Trước
            </button>

            {/* Hiện thị số trang đơn giản */}
            {Array.from({ length: pageData.totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`text-theme-sm rounded-lg border px-3 py-2 font-medium ${index === currentPage
                    ? 'bg-brand-600 border-brand-600 hover:bg-brand-700 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]'
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pageData.totalPages - 1 || loading}
              className="text-theme-sm rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}