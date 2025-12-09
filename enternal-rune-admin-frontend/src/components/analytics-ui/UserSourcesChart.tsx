"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useSourceStats } from "@/hooks/useAnalytics";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface UserSourcesChartProps {
  websiteId?: string;
}

export default function UserSourcesChart({ websiteId }: UserSourcesChartProps) {
  const { data: sourceStats, loading, error } = useSourceStats(websiteId);

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Nguồn truy cập
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Phân tích kênh mà người dùng đến từ đâu
          </p>
        </div>
        <div className="flex justify-center">
          <div className="h-[350px] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Lỗi tải dữ liệu nguồn truy cập: {error}</p>
      </div>
    );
  }

  // Use real data if available, otherwise show empty state
  const sources = sourceStats || [];

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "polarArea",
      height: 350,
    },
    colors: ["#465FFF", "#6B7FFF", "#9CB9FF", "#C7D7FE", "#E0E7FF"],
    labels: sources.map((s: { source: string }) => s.source),
    fill: {
      opacity: 0.85,
    },
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 1,
          strokeColor: "#e7e7e7",
        },
        spokes: {
          strokeWidth: 1,
          connectorColors: "#e7e7e7",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
    yaxis: {
      show: false,
    },
  };

  const series = sources.map((s: { percentage: number }) => s.percentage);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Nguồn truy cập
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Phân tích kênh mà người dùng đến từ đâu
        </p>
      </div>
      <div className="flex justify-center">
        <ReactApexChart
          options={options}
          series={series}
          type="polarArea"
          height={350}
        />
      </div>

      {/* Source Stats */}
      <div className="mt-6 space-y-3">
        {sources.map((sourceData: { source: string; count: number; percentage: number }) => {
          const icons: { [key: string]: string } = {
            'truy cập trực tiếp': '🌐',
            'tìm kiếm tự nhiên': '🔍',
            'tìm kiếm có trả phí': '💰',
            'mạng xã hội': '📱',
            'website khác': '🔗',
            'email marketing': '✉️',
            'email': '�',
            'google': '🔍',
            'facebook': '📘',
            'twitter': '🐦',
            'instagram': '📷',
            'linkedin': '�',
            'youtube': '📺',
            'default': '📊'
          };

          const icon = icons[sourceData.source.toLowerCase()] || icons['default'];

          return (
            <div
              key={sourceData.source}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {sourceData.source}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {sourceData.count.toLocaleString()} người dùng
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                  {sourceData.percentage}%
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}