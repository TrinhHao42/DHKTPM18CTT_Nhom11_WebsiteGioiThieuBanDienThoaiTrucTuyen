"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function UserBehaviorChart() {
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
      categories: [
        "Xem sản phẩm",
        "Thêm giỏ hàng",
        "Thanh toán",
        "Đánh giá",
        "Chia sẻ",
        "Tìm kiếm",
      ],
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

  const series = [
    {
      name: "Tháng này",
      data: [85, 72, 58, 45, 38, 92],
    },
    {
      name: "Tháng trước",
      data: [78, 65, 52, 38, 32, 85],
    },
  ];

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
        {[
          { label: "Tìm kiếm", value: "92%", trend: "+7%" },
          { label: "Xem SP", value: "85%", trend: "+7%" },
          { label: "Giỏ hàng", value: "72%", trend: "+7%" },
          { label: "Thanh toán", value: "58%", trend: "+6%" },
          { label: "Đánh giá", value: "45%", trend: "+7%" },
          { label: "Chia sẻ", value: "38%", trend: "+6%" },
        ].map((stat) => (
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
