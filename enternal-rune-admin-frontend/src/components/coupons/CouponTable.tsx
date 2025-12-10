"use client";
import React, { useEffect, useState, useMemo } from "react";
import Badge from "@/components/ui/badge/Badge";
import discountService from "@/services/discountService";
import { DiscountResponse, DiscountPageResponse } from "@/types/discount";
import DiscountDetailModal from './DiscountDetailModal';
import { useRouter } from "next/navigation";

// Định nghĩa kiểu cho state phân trang (giả định)
interface PaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export default function CouponTable() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [coupons, setCoupons] = useState<DiscountResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<DiscountResponse | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 10, // Kích thước mặc định, thay vì 20 trong useEffect cũ
    totalElements: 0,
    totalPages: 1,
  });

  const loadData = async (
    page: number = pagination.page,
    size: number = pagination.size
  ) => {
    try {
      setLoading(true);
      // Sử dụng `statusFilter` và `searchTerm` để gọi API
      const res: DiscountPageResponse = await discountService.getDashboard(
        searchTerm,
        page,
        size
      );
      setCoupons(res.content);
      setPagination({
        page: res.number,
        size: res.size,
        totalElements: res.totalElements,
        totalPages: res.totalPages,
      });
    } catch (error) {
      console.error("Load discount error:", error);
      // Có thể hiển thị thông báo lỗi cho người dùng ở đây
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu khi searchTerm hoặc statusFilter thay đổi, và reset về trang 0
  useEffect(() => {
    // Khi searchTerm/statusFilter thay đổi, ta reset về trang đầu tiên (0)
    loadData(0, pagination.size);
  }, [searchTerm, statusFilter]);

  // Hàm thay đổi trang
  const onChangePage = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      loadData(newPage, pagination.size);
    }
  };
  const handleViewDetail = (coupon: DiscountResponse) => {
    setSelectedCoupon(coupon);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCoupon(null);
  };
  // Trong CouponTable.tsx, sau handleCloseDetailModal...

  // Hàm tính toán các nút số trang hiển thị
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, pagination.page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(pagination.totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [pagination.page, pagination.totalPages]);

  // Hàm xử lý việc xóa mã giảm giá
  const handleDelete = async (id: number, code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa mã giảm giá ${code} không?`)) {
      try {
        setLoading(true);
        await discountService.delete(id);
        // Tải lại dữ liệu sau khi xóa thành công
        loadData(pagination.page, pagination.size);
      } catch (error) {
        console.error("Delete discount error:", error);
        alert(`Lỗi khi xóa mã giảm giá: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Logic lọc client-side đã được di chuyển một phần sang API (loadData)
  // Tuy nhiên, logic lọc theo status vẫn cần được áp dụng nếu API không hỗ trợ lọc status
  const filteredCoupons = coupons.filter((coupon) => {
    // Giữ lại logic lọc theo status nếu API không làm điều đó
    const matchesStatus = (() => {
      if (statusFilter === "all") return true;

      const now = new Date();
      // Chú ý: Cần đảm bảo discountStartDate/EndDate là Date object
      // Nếu API trả về string, phải chuyển đổi
      const start = new Date(coupon.discountStartDate);
      const end = new Date(coupon.discountEndDate);

      if (statusFilter === "active")
        return coupon.discountActive && now >= start && now <= end;

      if (statusFilter === "scheduled")
        return coupon.discountActive && now < start;

      if (statusFilter === "expired")
        return now > end;

      return true;
    })();
    return matchesStatus; // Giữ lại chỉ lọc status ở đây, vì loadData đã lọc theo searchTerm
  });


  // ... (Các hàm utility không đổi: getStatusBadge, getTypeBadge, formatCurrency, formatDate, getUsagePercentage)
  const getStatusBadge = (item: DiscountResponse) => {
    if (!item.discountActive) return <Badge color="error">Tạm dừng</Badge>;

    const now = new Date();
    const start = new Date(item.discountStartDate);
    const end = new Date(item.discountEndDate);

    if (now < start) return <Badge color="warning">Đã lên lịch</Badge>;
    if (now > end) return <Badge color="error">Hết hạn</Badge>;

    return <Badge color="success">Đang hoạt động</Badge>;
  };

  const getTypeBadge = (type: string) => {
    return type === "PERCENT" ? (
      <span className="inline-flex items-center rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
        Phần trăm
      </span>
    ) : (
      <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Cố định
      </span>
    );
  };

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDate = (dateString: string | Date): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("vi-VN");
  };

  const getUsagePercentage = (used: number, limit: number): number => {
    return limit === 0 ? 0 : Math.round((used / limit) * 100);
  };
  // ... (Kết thúc các hàm utility)


  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Danh sách mã giảm giá
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Quản lý các mã giảm giá áp dụng cho đơn hàng
            </p>
          </div>
          <button onClick={() => router.push("/coupons/new")} className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tạo mã mới
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm mã giảm giá..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
          </div>

          <div className="flex gap-2">
            {[
              { value: "all", label: "Tất cả" },
              { value: "active", label: "Hoạt động" },
              { value: "scheduled", label: "Đã lên lịch" },
              { value: "expired", label: "Hết hạn" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${statusFilter === filter.value
                  ? "bg-brand-500 text-white dark:bg-brand-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          Đang tải dữ liệu...
        </div>
      )}

      {/* Table */}
      {!loading && filteredCoupons.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Mã & Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Loại & Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Áp dụng cho
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Sử dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredCoupons.map((coupon) => {
                const usagePercent = getUsagePercentage(
                  coupon.usedQuantity,
                  coupon.discountQuantityLimit
                );
                return (
                  <tr
                    key={coupon.discountId}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-brand-50 px-2 py-1 font-mono text-sm font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                            {coupon.discountCode}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                          {coupon.discountName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {getTypeBadge(coupon.discountValueType)}
                        <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                          {coupon.discountValueType === "PERCENT"
                            ? `${coupon.discountValue}%`
                            : formatCurrency(coupon.discountValue)}
                        </p>
                        {coupon.discountMaxAmount > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Tối đa: {formatCurrency(coupon.discountMaxAmount)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {coupon.discountTargetType === "ORDER" && (
                        <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Đơn hàng
                        </span>
                      )}

                      {coupon.discountTargetType === "PRODUCT" && (
                        <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          Sản phẩm
                        </span>
                      )}
                      {coupon.discountTargetType === "EVENT" && (
                        <span className="rounded-lg bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                          Sự kiện
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {coupon.usedQuantity}/
                            {coupon.discountQuantityLimit}
                          </span>
                          {/* <span className="font-semibold text-gray-900 dark:text-white">
                            {usagePercent}%
                          </span> */}
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full bg-brand-500 transition-all"
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                          Từ: {formatDate(coupon.discountStartDate)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Đến: {formatDate(coupon.discountEndDate)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(coupon)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleViewDetail(coupon)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400">
                          <svg
                            className="h-5 w-5"
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
                        <button onClick={() => router.push(`/coupons/${coupon.discountId}/edit`)} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400">
                          <svg
                            className="h-5 w-5"
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
                          onClick={() => handleDelete(coupon.discountId, coupon.discountCode)}
                          className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        >
                          <svg
                            className="h-5 w-5"
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State / Not found */}
      {!loading && filteredCoupons.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            Không tìm thấy mã giảm giá
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Thử thay đổi bộ lọc hoặc tạo mã giảm giá mới
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && coupons.length > 0 && pagination.totalPages >= 1 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50/30 px-6 py-4 sm:flex-row dark:border-gray-800 dark:bg-gray-800/20">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị trang {pagination.page + 1}/{pagination.totalPages}({pagination.totalElements} mã giảm giá)
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
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${pageNum === pagination.page
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
      {isDetailModalOpen && selectedCoupon && (
        <DiscountDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        coupon={selectedCoupon}
      />
      )}
    </div>
  );
}