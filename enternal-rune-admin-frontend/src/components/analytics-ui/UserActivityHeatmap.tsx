"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useHourlyActivity } from "@/hooks/useAnalytics";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface UserActivityHeatmapProps {
  websiteId?: string;
}

export default function UserActivityHeatmap({ websiteId }: UserActivityHeatmapProps) {
  const { data: activityData, loading, error } = useHourlyActivity(websiteId);

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Hoạt động theo giờ
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Mật độ người dùng truy cập theo ngày và giờ trong tuần
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
        <p className="text-red-600 dark:text-red-400">Lỗi tải dữ liệu hoạt động: {error}</p>
      </div>
    );
  }

  // Empty default series when no real data
  const defaultSeries: { name: string; data: number[] }[] = [];

  // Convert API data to chart format or use default
  const series = activityData && activityData.length > 0
    ? activityData.map(day => ({
      name: (day.name || day.hour)?.toString(),
      data: Object.keys(day).filter(k => k.includes('h')).map(k => day[k] as number)
    }))
    : defaultSeries;

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "heatmap",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 5,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 500,
              name: "Thấp",
              color: "#E0E7FF",
            },
            {
              from: 501,
              to: 1000,
              name: "Trung bình",
              color: "#A5B4FC",
            },
            {
              from: 1001,
              to: 1500,
              name: "Cao",
              color: "#6366F1",
            },
            {
              from: 1501,
              to: 2500,
              name: "Rất cao",
              color: "#465FFF",
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category",
      categories: [
        "00h",
        "02h",
        "04h",
        "06h",
        "08h",
        "10h",
        "12h",
        "14h",
        "16h",
        "18h",
        "20h",
        "22h",
      ],
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} người dùng`,
      },
    },
  };



  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hoạt động theo giờ
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Mật độ người dùng truy cập theo ngày và giờ trong tuần
        </p>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="heatmap"
        height={350}
      />

      {/* Peak Hours Info */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-brand-600 shadow-sm dark:bg-gray-900 dark:text-brand-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Giờ cao điểm</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">18h - 22h</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-brand-600 shadow-sm dark:bg-gray-900 dark:text-brand-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Trung bình/giờ</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">1,542</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-brand-600 shadow-sm dark:bg-gray-900 dark:text-brand-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Ngày đông nhất</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">Thứ 6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
