"use client";
import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import { useAnalyticsMetrics } from "@/hooks/useAnalytics";

type MetricCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: {
    value: string;
    isPositive: boolean;
  };
  bgColor: string;
};

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  trend,
  bgColor,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl ${bgColor}`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </h3>
          </div>
        </div>
        <div>
          <Badge color={trend.isPositive ? "success" : "error"}>
            <span className="flex items-center gap-1">
              {trend.isPositive ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : (
                <ArrowDownIcon className="h-3 w-3" />
              )}
              {trend.value}
            </span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

type UserAnalyticsMetricsProps = {
  websiteId?: string;
};

export default function UserAnalyticsMetrics({ websiteId }: UserAnalyticsMetricsProps) {
  const { data: metrics, loading, error } = useAnalyticsMetrics(websiteId);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="animate-pulse">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                  <div>
                    <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="mt-2 h-6 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                </div>
                <div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Lỗi tải dữ liệu: {error}</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu</p>
      </div>
    );
  }

  // Safe format helpers
  const formatNumber = (n?: number | null) => Number(n ?? 0).toLocaleString();
  const formatAvgSessionTime = (t?: string | number | null) => {
    if (t === undefined || t === null || t === '') return '0s';
    
    const seconds = typeof t === 'number' ? t : parseFloat(String(t)) || 0;
    
    // Convert to minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes > 0) {
      return `${minutes}p ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const safeTrend = (t?: { value?: string; isPositive?: boolean }) => ({
    value: String(t?.value ?? "0%"),
    isPositive: !!t?.isPositive,
  });

  // Default trend data when trends are not available
  const defaultTrend = { value: "0%", isPositive: true };

  console.log('Analytics metrics data:', metrics); // Debug log
  console.log('Trend data:', {
    totalUsersTrend: metrics?.totalUsersTrend,
    newUsersTrend: metrics?.newUsersTrend,
    sessionTimeTrend: metrics?.sessionTimeTrend,
  }); // Debug trend data

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
  <MetricCard
        icon={
          <svg
            className="h-7 w-7 text-dark-600 dark:text-dark-400"
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
        }
        title="Tổng người dùng"
        value={formatNumber(metrics?.totalUsers)}
        trend={safeTrend(metrics?.totalUsersTrend) || defaultTrend}
        bgColor="bg-gray-100 dark:bg-gray-800"
      />

      <MetricCard
        icon={
          <svg
            className="h-7 w-7 text-dark-600 dark:text-dark-400"
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
        }
        title="Lượt xem trang"
        value={formatNumber(metrics?.totalPageViews)}
        trend={safeTrend(metrics?.totalUsersTrend) || defaultTrend}
        bgColor="bg-gray-100 dark:bg-gray-800"
      />

      <MetricCard
        icon={
          <svg
            className="h-7 w-7 text-dark-600 dark:text-dark-400"
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
        title="Khách truy cập"
        value={formatNumber(metrics?.uniqueVisitors)}
        trend={safeTrend(metrics?.newUsersTrend) || defaultTrend}
        bgColor="bg-gray-100 dark:bg-gray-800"
      />

      <MetricCard
        icon={
          <svg
            className="h-7 w-7 text-dark-600 dark:text-dark-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        title="Thời gian TB/phiên"
        value={formatAvgSessionTime(metrics?.averageSessionDuration)}
        trend={safeTrend(metrics?.sessionTimeTrend) || defaultTrend}
        bgColor="bg-gray-100 dark:bg-gray-800"
      />
    </div>
  );
}
