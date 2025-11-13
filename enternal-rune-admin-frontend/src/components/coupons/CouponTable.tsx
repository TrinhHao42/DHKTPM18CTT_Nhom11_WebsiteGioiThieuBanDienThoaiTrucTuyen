"use client";
import React, { useState } from "react";
import Badge from "@/components/ui/badge/Badge";

type Coupon = {
  id: string;
  code: string;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive" | "expired" | "scheduled";
  description: string;
};

const coupons: Coupon[] = [
  {
    id: "1",
    code: "SUMMER2024",
    name: "Giảm giá mùa hè",
    type: "percentage",
    value: 20,
    minOrder: 500000,
    maxDiscount: 100000,
    usageLimit: 1000,
    usedCount: 456,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    status: "active",
    description: "Giảm 20% cho đơn hàng từ 500k",
  },
  {
    id: "2",
    code: "NEWUSER50",
    name: "Ưu đãi khách hàng mới",
    type: "fixed",
    value: 50000,
    minOrder: 200000,
    usageLimit: 500,
    usedCount: 342,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    description: "Giảm 50k cho khách hàng đăng ký mới",
  },
  {
    id: "3",
    code: "FLASH100",
    name: "Flash Sale",
    type: "fixed",
    value: 100000,
    minOrder: 1000000,
    usageLimit: 100,
    usedCount: 98,
    startDate: "2024-10-20",
    endDate: "2024-10-22",
    status: "active",
    description: "Flash sale giảm 100k cho đơn từ 1 triệu",
  },
  {
    id: "4",
    code: "WINTER15",
    name: "Khuyến mãi mùa đông",
    type: "percentage",
    value: 15,
    minOrder: 300000,
    maxDiscount: 75000,
    usageLimit: 2000,
    usedCount: 0,
    startDate: "2024-12-01",
    endDate: "2024-12-31",
    status: "scheduled",
    description: "Giảm 15% cho mùa đông",
  },
  {
    id: "5",
    code: "OLDUSER30",
    name: "Tri ân khách hàng cũ",
    type: "fixed",
    value: 30000,
    minOrder: 100000,
    usageLimit: 500,
    usedCount: 500,
    startDate: "2024-05-01",
    endDate: "2024-05-31",
    status: "expired",
    description: "Ưu đãi dành cho khách hàng thân thiết",
  },
];

export default function CouponTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || coupon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge color="success">Đang hoạt động</Badge>;
      case "inactive":
        return <Badge color="error">Tạm dừng</Badge>;
      case "expired":
        return <Badge color="error">Hết hạn</Badge>;
      case "scheduled":
        return <Badge color="warning">Đã lên lịch</Badge>;
      default:
        return <Badge color="info">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "percentage" ? (
      <span className="inline-flex items-center rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
        Phần trăm
      </span>
    ) : (
      <span className="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        Cố định
      </span>
    );
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getUsagePercentage = (used: number, limit: number): number => {
    return Math.round((used / limit) * 100);
  };

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
          <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700">
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
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  statusFilter === filter.value
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

      {/* Table */}
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
                Điều kiện
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
                coupon.usedCount,
                coupon.usageLimit
              );
              return (
                <tr
                  key={coupon.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-brand-50 px-2 py-1 font-mono text-sm font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                          {coupon.code}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                        {coupon.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {coupon.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {getTypeBadge(coupon.type)}
                      <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                        {coupon.type === "percentage"
                          ? `${coupon.value}%`
                          : formatCurrency(coupon.value)}
                      </p>
                      {coupon.maxDiscount && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Tối đa: {formatCurrency(coupon.maxDiscount)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-600 dark:text-gray-400">
                        Đơn tối thiểu:
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(coupon.minOrder)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {coupon.usedCount}/{coupon.usageLimit}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {usagePercent}%
                        </span>
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
                        Từ: {formatDate(coupon.startDate)}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Đến: {formatDate(coupon.endDate)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(coupon.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400">
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
                      <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-brand-400">
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
                      <button className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400">
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

      {/* Empty State */}
      {filteredCoupons.length === 0 && (
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
    </div>
  );
}
