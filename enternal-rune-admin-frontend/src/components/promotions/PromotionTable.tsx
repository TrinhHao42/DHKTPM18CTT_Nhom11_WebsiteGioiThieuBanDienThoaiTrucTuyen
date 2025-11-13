"use client";
import React, { useState } from "react";
import Badge from "@/components/ui/badge/Badge";

type Promotion = {
  id: string;
  name: string;
  description: string;
  type: "flash_sale" | "special_event" | "seasonal" | "bundle" | "bogo";
  discountType: "percentage" | "fixed" | "bundle_price";
  discountValue: number;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "ended" | "cancelled";
  targetProducts: string[];
  targetCategories: string[];
  minQuantity?: number;
  orderCount: number;
  revenue: number;
  banner?: string;
};

const promotions: Promotion[] = [
  {
    id: "1",
    name: "Flash Sale Cuối Tuần",
    description: "Giảm giá sốc 50% cho tất cả sản phẩm điện tử",
    type: "flash_sale",
    discountType: "percentage",
    discountValue: 50,
    startDate: "2024-01-20T00:00:00",
    endDate: "2024-01-21T23:59:59",
    status: "active",
    targetProducts: ["Laptop Gaming ROG", "iPhone 15 Pro Max", "Samsung S24 Ultra"],
    targetCategories: ["Điện tử", "Công nghệ"],
    orderCount: 1247,
    revenue: 450000000,
  },
  {
    id: "2",
    name: "Ngày Phụ Nữ Việt Nam",
    description: "Ưu đãi đặc biệt dành cho nữ giới nhân ngày 20/10",
    type: "special_event",
    discountType: "percentage",
    discountValue: 30,
    startDate: "2024-10-18T00:00:00",
    endDate: "2024-10-20T23:59:59",
    status: "ended",
    targetProducts: [],
    targetCategories: ["Thời trang nữ", "Làm đẹp", "Phụ kiện"],
    orderCount: 892,
    revenue: 280000000,
  },
  {
    id: "3",
    name: "Black Friday 2024",
    description: "Siêu sale Black Friday - Giảm đến 70%",
    type: "seasonal",
    discountType: "percentage",
    discountValue: 70,
    startDate: "2024-11-29T00:00:00",
    endDate: "2024-11-30T23:59:59",
    status: "scheduled",
    targetProducts: [],
    targetCategories: ["Tất cả danh mục"],
    orderCount: 0,
    revenue: 0,
  },
  {
    id: "4",
    name: "Mua 2 Tặng 1",
    description: "Mua 2 sản phẩm tặng 1 sản phẩm cùng loại",
    type: "bogo",
    discountType: "percentage",
    discountValue: 33,
    startDate: "2024-01-15T00:00:00",
    endDate: "2024-02-15T23:59:59",
    status: "active",
    targetProducts: [],
    targetCategories: ["Thời trang", "Giày dép"],
    minQuantity: 2,
    orderCount: 654,
    revenue: 195000000,
  },
  {
    id: "5",
    name: "Combo Laptop + Chuột + Bàn phím",
    description: "Mua combo tiết kiệm đến 1.5 triệu",
    type: "bundle",
    discountType: "fixed",
    discountValue: 1500000,
    startDate: "2024-01-10T00:00:00",
    endDate: "2024-03-31T23:59:59",
    status: "active",
    targetProducts: ["Laptop Dell XPS", "Chuột Logitech MX", "Bàn phím Keychron"],
    targetCategories: [],
    orderCount: 423,
    revenue: 320000000,
  },
  {
    id: "6",
    name: "Tết Nguyên Đán 2024",
    description: "Khuyến mãi lớn mừng Xuân Giáp Thìn",
    type: "seasonal",
    discountType: "percentage",
    discountValue: 40,
    startDate: "2024-02-05T00:00:00",
    endDate: "2024-02-14T23:59:59",
    status: "ended",
    targetProducts: [],
    targetCategories: ["Thực phẩm", "Đồ uống", "Quà tặng"],
    orderCount: 631,
    revenue: 175000000,
  },
];

export default function PromotionTable() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || promo.status === statusFilter;
    const matchesType = typeFilter === "all" || promo.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "light" | "solid"; color: "primary" | "success" | "error" | "warning" | "info" | "light" | "dark" }> = {
      active: { label: "Đang diễn ra", variant: "light", color: "success" },
      scheduled: { label: "Đã lên lịch", variant: "light", color: "info" },
      ended: { label: "Đã kết thúc", variant: "light", color: "light" },
      cancelled: { label: "Đã hủy", variant: "light", color: "error" },
    };

    const config = statusConfig[status] || { label: status, variant: "light" as const, color: "light" as const };
    return <Badge variant={config.variant} color={config.color}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig: Record<string, { label: string; color: string }> = {
      flash_sale: { label: "Flash Sale", color: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" },
      special_event: { label: "Sự kiện đặc biệt", color: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" },
      seasonal: { label: "Theo mùa", color: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" },
      bundle: { label: "Combo", color: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" },
      bogo: { label: "Mua 1 Tặng 1", color: "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400" },
    };

    const config = typeConfig[type] || { label: type, color: "bg-gray-100 text-gray-700" };
    return (
      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Danh sách chương trình khuyến mãi
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Quản lý các chương trình khuyến mãi cho sự kiện và ngày đặc biệt
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
            Tạo chương trình mới
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm chương trình..."
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

          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "Tất cả" },
              { value: "active", label: "Đang diễn ra" },
              { value: "scheduled", label: "Đã lên lịch" },
              { value: "ended", label: "Đã kết thúc" },
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

          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "Tất cả loại" },
              { value: "flash_sale", label: "Flash Sale" },
              { value: "special_event", label: "Sự kiện" },
              { value: "bundle", label: "Combo" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  typeFilter === filter.value
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
                Tên chương trình
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Loại & Giá trị
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Áp dụng
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Thời gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Hiệu suất
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
            {filteredPromotions.map((promo) => (
              <tr
                key={promo.id}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {promo.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {promo.description}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    {getTypeBadge(promo.type)}
                    <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                      {promo.discountType === "percentage"
                        ? `${promo.discountValue}%`
                        : formatCurrency(promo.discountValue)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {promo.targetCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {promo.targetCategories.map((cat, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                    {promo.targetProducts.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {promo.targetProducts.slice(0, 2).map((prod, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                          >
                            {prod}
                          </span>
                        ))}
                        {promo.targetProducts.length > 2 && (
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            +{promo.targetProducts.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    {promo.targetCategories.length === 0 &&
                      promo.targetProducts.length === 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Tất cả sản phẩm
                        </span>
                      )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      Từ: {formatDate(promo.startDate)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Đến: {formatDate(promo.endDate)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
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
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {promo.orderCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                        {formatCurrency(promo.revenue)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(promo.status)}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredPromotions.length === 0 && (
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
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
            />
          </svg>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            Không tìm thấy chương trình khuyến mãi
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Thử thay đổi bộ lọc hoặc tạo chương trình mới
          </p>
        </div>
      )}
    </div>
  );
}
