"use client";
import React, { useEffect, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { discountService } from "@/services/discountService";
import { DiscountStatisticResponse } from "@/types/discount";

const MetricCard = ({
  icon,
  title,
  value,
  trend,
  trendValue,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: "up" | "down";
  trendValue?: string;
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value}
          </h4>
        </div>
        {trend && trendValue && (
          <Badge color={trend === "up" ? "success" : "error"}>
            {trend === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {trendValue}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default function PromotionMetrics() {
  const [stats, setStats] = useState<DiscountStatisticResponse | null>(null);

  useEffect(() => {
    discountService.getStatistics().then(setStats);
  }, []);

  if (!stats) return <p>Đang tải...</p>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Tổng chương trình */}
      <MetricCard
        icon={
          <svg
            className="w-6 h-6 text-brand dark:text-white/90"
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
        }
        title="Tổng chương trình"
        value={stats.totalDiscounts}
        trend="up"
        trendValue="+0%" // nếu chưa có logic trend
      />

      {/* Đang hoạt động */}
      <MetricCard
        icon={
          <svg
            className="w-6 h-6 text-brand dark:text-white/90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        title="Đang hoạt động"
        value={stats.activeDiscounts}
        trend="up"
        trendValue="+0%"
      />

      {/* Số đơn hàng áp dụng (usedCount) */}
      <MetricCard
        icon={
          <svg
            className="w-6 h-6 text-brand dark:text-white/90"
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
        }
        title="Đơn hàng áp dụng"
        value={stats.usedCount.toLocaleString()}
        trend="up"
        trendValue="+0%"
      />

      {/* Tổng tiền giảm giá đã sử dụng */}
      <MetricCard
        icon={
          <svg
            className="w-6 h-6 text-brand dark:text-white/90"
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
        }
        title="Doanh thu (giảm giá)"
        value={"₫" + stats.totalDiscountAmount.toLocaleString()}
        trend="up"
        trendValue="+0%"
      />
    </div>
  );
}
