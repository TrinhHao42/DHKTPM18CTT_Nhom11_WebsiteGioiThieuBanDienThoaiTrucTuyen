"use client";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";

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

export default function CategoryMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Tổng danh mục"
        value="48"
        trend="up"
        trendValue="8.2%"
        icon={
          <svg
            className="text-brand"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7L12 2L21 7V17L12 22L3 17V7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 2V22M21 7L12 12L3 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />

      <MetricCard
        title="Danh mục cha"
        value="12"
        icon={
          <svg
            className="text-brand"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V9C4 9.53043 4.21071 10.0391 4.58579 10.4142C4.96086 10.7893 5.46957 11 6 11H9C9.53043 11 10.0391 10.7893 10.4142 10.4142C10.7893 10.0391 11 9.53043 11 9V4C11 3.46957 10.7893 2.96086 10.4142 2.58579C10.0391 2.21071 9.53043 2 9 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18 13H15C14.4696 13 13.9609 13.2107 13.5858 13.5858C13.2107 13.9609 13 14.4696 13 15V20C13 20.5304 13.2107 21.0391 13.5858 21.4142C13.9609 21.7893 14.4696 22 15 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V15C20 14.4696 19.7893 13.9609 19.4142 13.5858C19.0391 13.2107 18.5304 13 18 13Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />

      <MetricCard
        title="Danh mục con"
        value="36"
        icon={
          <svg
            className="text-brand"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              rx="1"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              rx="1"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        }
      />

      <MetricCard
        title="SP đang hoạt động"
        value="1,847"
        trend="up"
        trendValue="12.5%"
        icon={
          <svg
            className="text-brand"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 22V12H15V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </div>
  );
}
