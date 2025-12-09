"use client";
import React, { useEffect, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { paymentService } from "@/services/paymentService";
import { PaymentMetrics as PaymentMetricsType } from "@/types/payment";

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

export default function PaymentMetrics() {
  const [metrics, setMetrics] = useState<PaymentMetricsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getPaymentMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching payment metrics:", err);
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
            <div className="mt-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">
          {error || "Không thể tải dữ liệu thống kê"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        title="Tổng giao dịch"
        value={metrics.totalTransactions.toLocaleString("vi-VN")}
        trend={metrics.transactionsTrend >= 0 ? "up" : "down"}
        trendValue={`${Math.abs(metrics.transactionsTrend)}%`}
      />
      
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
        title="Tổng thu"
        value={paymentService.formatCurrency(metrics.totalRevenue)}
        trend={metrics.revenueTrend >= 0 ? "up" : "down"}
        trendValue={`${Math.abs(metrics.revenueTrend)}%`}
      />

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
        title="Đã thanh toán"
        value={metrics.paidTransactions.toLocaleString("vi-VN")}
        trend={metrics.paidTrend >= 0 ? "up" : "down"}
        trendValue={`${Math.abs(metrics.paidTrend)}%`}
      />

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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
        title="Chờ xử lý"
        value={metrics.pendingTransactions.toLocaleString("vi-VN")}
        trend={metrics.pendingTrend >= 0 ? "up" : "down"}
        trendValue={`${Math.abs(metrics.pendingTrend)}%`}
      />
    </div>
  );
}
