"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useUserBehavior } from "@/hooks/useAnalytics";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface UserBehaviorChartProps {
  websiteId?: string;
}

export default function UserBehaviorChart({ websiteId }: UserBehaviorChartProps) {
  const { data: behaviorData, loading, error } = useUserBehavior(websiteId);

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Hành vi người dùng
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Phân tích các hành động chính của người dùng trên hệ thống
          </p>
        </div>
        <div className="h-[350px] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Lỗi tải dữ liệu hành vi: {error}</p>
      </div>
    );
  }

  // Empty defaults when no real data available
  const defaultCategories: string[] = [];
  const defaultSeries: { name: string; data: number[] }[] = [];

  // Convert API data to chart format
  const categories = behaviorData && behaviorData.length > 0 
    ? behaviorData.map(b => b.action)
    : defaultCategories;
    
  const series = behaviorData && behaviorData.length > 0
    ? [
        {
          name: "Tháng này",
          data: behaviorData.map(b => b.currentMonth),
        },
        {
          name: "Tháng trước", 
          data: behaviorData.map(b => b.previousMonth),
        },
      ]
    : defaultSeries;

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#465FFF", "#9CB9FF"],
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.2,
    },
    markers: {
      size: 4,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      show: false,
    },
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
  };



  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hành vi người dùng
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Phân tích các hành động chính của người dùng trên hệ thống
        </p>
      </div>
      <div className="flex justify-center">
        <ReactApexChart
          options={options}
          series={series}
          type="radar"
          height={350}
        />
      </div>

      {/* Behavior Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(behaviorData && behaviorData.length > 0 
          ? behaviorData.slice(0, 6).map(b => ({
              label: b.action.replace(/\s+/g, ' ').slice(0, 10),
              value: `${b.currentMonth}%`,
              trend: b.change >= 0 ? `+${b.change}%` : `${b.change}%`
            }))
          : [
              { label: "Tìm kiếm", value: "92%", trend: "+7%" },
              { label: "Xem SP", value: "85%", trend: "+7%" },
              { label: "Giỏ hàng", value: "72%", trend: "+7%" },
              { label: "Thanh toán", value: "58%", trend: "+6%" },
              { label: "Đánh giá", value: "45%", trend: "+7%" },
              { label: "Chia sẻ", value: "38%", trend: "+6%" },
            ]
        ).map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
