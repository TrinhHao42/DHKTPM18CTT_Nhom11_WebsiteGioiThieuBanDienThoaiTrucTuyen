"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEngagementData } from "@/hooks/useAnalytics";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface UserEngagementChartProps {
  websiteId?: string;
}

export default function UserEngagementChart({ websiteId }: UserEngagementChartProps) {
  const { data: engagementData, loading, error } = useEngagementData(websiteId);
  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#465FFF", "#9CB9FF", "#C7D7FE"],
    stroke: {
      width: [3, 3, 3],
      curve: "smooth",
    },
    markers: {
      size: 0,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      categories: [
        "00:00",
        "02:00",
        "04:00",
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "14:00",
        "16:00",
        "18:00",
        "20:00",
        "22:00",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      min: 0,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit, sans-serif",
    },
    grid: {
      borderColor: "#e7e7e7",
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => `${val} phút`,
      },
    },
  };

  // Transform API data to chart series
  const series: { name: string; data: number[] }[] = engagementData ? [
    {
      name: 'Thời gian trung bình (phút)',
      data: engagementData.map(item => Math.round(item.avgTime / 60)),
    },
    {
      name: 'Trang/phiên', 
      data: engagementData.map(item => item.pagesPerSession),
    },
    {
      name: 'Tương tác',
      data: engagementData.map(item => item.interactions),
    },
  ] : [];

  const categories = engagementData?.map(item => item.hour) || [
    "00:00", "02:00", "04:00", "06:00", "08:00", "10:00", 
    "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"
  ];

  const updatedOptions: ApexOptions = {
    ...options,
    xaxis: {
      ...options.xaxis,
      categories,
    },
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Mức độ tương tác theo giờ
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Thời gian sử dụng và số lượng trang xem theo từng khung giờ
          </p>
        </div>
        <div className="flex h-[350px] items-center justify-center">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Mức độ tương tác theo giờ
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Thời gian sử dụng và số lượng trang xem theo từng khung giờ
          </p>
        </div>
        <div className="flex h-[350px] items-center justify-center">
          <div className="text-red-500">Lỗi: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Mức độ tương tác theo giờ
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Thời gian sử dụng và số lượng trang xem theo từng khung giờ
        </p>
      </div>
      {/* <div className="max-w-full overflow-x-auto">
        <div className="min-w-[600px]">
          
        </div>
      </div> */}
      <ReactApexChart
            options={updatedOptions}
            series={series}
            type="line"
            height={350}
          />
    </div>
  );
}
