'use client';
import React from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function UserGrowthChart() {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit, sans-serif',
    },
    colors: ['#465FFF', '#9CB9FF', '#C7D7FE'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      height: 350,
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: [3, 3, 3],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    markers: {
      size: 0,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      borderColor: '#e7e7e7',
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
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'category',
      categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
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
    },
    tooltip: {
      x: {
        show: true,
      },
    },
  };

  const series = [
    {
      name: 'Tổng người dùng',
      data: [1200, 1580, 1890, 2150, 2380, 2650, 2890, 3120, 3450, 3680, 3950, 4200],
    },
    {
      name: 'Người dùng mới',
      data: [180, 240, 190, 220, 280, 310, 270, 290, 350, 320, 380, 410],
    },
    {
      name: 'Người dùng rời đi',
      data: [45, 52, 38, 48, 55, 62, 51, 58, 64, 59, 71, 68],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Tăng trưởng người dùng
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Theo dõi sự thay đổi số lượng người dùng theo tháng
        </p>
      </div>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
}
