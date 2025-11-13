"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function UserSourcesChart() {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "polarArea",
      height: 350,
    },
    colors: ["#465FFF", "#6B7FFF", "#9CB9FF", "#C7D7FE", "#E0E7FF"],
    labels: ["Organic Search", "Direct", "Social Media", "Referral", "Email"],
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

  const series = [42.5, 28.3, 15.7, 9.2, 4.3];

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
        {[
          { name: "Organic Search", value: "42.5%", count: "10,451", icon: "🔍" },
          { name: "Direct", value: "28.3%", count: "6,952", icon: "🌐" },
          { name: "Social Media", value: "15.7%", count: "3,857", icon: "📱" },
          { name: "Referral", value: "9.2%", count: "2,260", icon: "🔗" },
          { name: "Email", value: "4.3%", count: "1,047", icon: "✉️" },
        ].map((source, index) => (
          <div
            key={source.name}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{source.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {source.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {source.count} người dùng
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-brand-600 dark:text-brand-400">
                {source.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
