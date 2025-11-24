"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useDeviceStats } from "@/hooks/useAnalytics";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface UserDeviceChartProps {
  websiteId?: string;
}

export default function UserDeviceChart({ websiteId }: UserDeviceChartProps) {
  const { data: deviceStats, loading, error } = useDeviceStats(websiteId);

  // Loading state
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Thiết bị truy cập
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Phân bố người dùng theo loại thiết bị
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
        <p className="text-red-600 dark:text-red-400">Lỗi tải dữ liệu thiết bị: {error}</p>
      </div>
    );
  }

  // No data state
  if (!deviceStats || deviceStats.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Thiết bị truy cập
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Phân bố người dùng theo loại thiết bị
          </p>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400">Không có dữ liệu thiết bị</p>
      </div>
    );
  }

  const totalDevices = deviceStats.reduce((sum, stat) => sum + stat.count, 0);
  const series = deviceStats.map(stat => stat.count);
  const labels = deviceStats.map(stat => stat.device || 'Unknown');

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
    },
    colors: ["#465FFF", "#6B7FFF", "#9CB9FF", "#C7D7FE"],
    labels,
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: 700,
              formatter: (val: string) => val,
            },
            total: {
              show: true,
              label: "Tổng thiết bị",
              fontSize: "14px",
              fontWeight: 600,
              formatter: () => totalDevices.toLocaleString(),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Thiết bị truy cập
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Phân bố người dùng theo loại thiết bị
        </p>
      </div>
      <div className="flex justify-center">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={350}
        />
      </div>
      
      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {deviceStats.slice(0, 4).map((stat, index) => {
          const deviceIcons: { [key: string]: React.ReactNode } = {
            'desktop': (
              <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ),
            'mobile': (
              <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            ),
            'tablet': (
              <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            ),
            'default': (
              <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            )
          };

          // Map device names to display names
          const deviceDisplayNames: { [key: string]: string } = {
            'desktop': 'Máy tính',
            'mobile': 'Điện thoại',
            'tablet': 'Máy tính bảng'
          };

          const deviceKey = stat.device?.toLowerCase() || 'default';
          const icon = deviceIcons[deviceKey] || deviceIcons['default'];
          const displayName = deviceDisplayNames[deviceKey] || stat.device;

          return (
            <div key={`${stat.device}-${index}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  {icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{displayName}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.percentage}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
