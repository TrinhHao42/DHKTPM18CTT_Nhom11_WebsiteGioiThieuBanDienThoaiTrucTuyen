"use client";
import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";

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

export default function UserAnalyticsMetrics() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={
          <svg
            className="h-7 w-7 text-brand-600 dark:text-brand-400"
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
        value="24,567"
        trend={{ value: "12.5%", isPositive: true }}
        bgColor="bg-gray-100 dark:bg-gray-800"
      />

      <MetricCard
        icon={
          <svg
            className="h-7 w-7 text-brand-600 dark:text-brand-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        }
        title="Người dùng mới"
        value="1,854"
        trend={{ value: "8.3%", isPositive: true }}
        bgColor="bg-gray-100 dark:bg-gray-800"
      />

      <MetricCard
        icon={
          <svg
            className="h-7 w-7 text-brand-600 dark:text-brand-400"
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
        value="18,234"
        trend={{ value: "15.2%", isPositive: true }}
        bgColor="bg-gray-100 dark:bg-gray-800"
      />

      <MetricCard
        icon={
          <svg
            className="h-7 w-7 text-brand-600 dark:text-brand-400"
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
        value="8m 42s"
        trend={{ value: "3.1%", isPositive: false }}
        bgColor="bg-gray-100 dark:bg-gray-800"
      />
    </div>
  );
}
