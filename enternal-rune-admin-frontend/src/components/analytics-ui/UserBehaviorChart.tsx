"use client";
import React, { useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useUserBehavior } from "@/hooks/useAnalytics";
import { EVENT_DISPLAY_NAMES } from "@/utils/eventNames";
import UserBehaviorModal from "./UserBehaviorModal";

// TypeScript declaration for window.umami helper (if available)
declare global {
  interface Window {
    umami?: {
      getEventDisplayName?: (eventName: string) => string;
    };
  }
}

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface UserBehaviorChartProps {
  websiteId?: string;
}

export default function UserBehaviorChart({ websiteId }: UserBehaviorChartProps) {
  const { data: behaviorData, loading, error } = useUserBehavior(websiteId);
  const [showModal, setShowModal] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'yesterday' | '7days' | '30days'>('today');

  // Debug log to check data structure
  console.log('UserBehaviorChart - behaviorData:', behaviorData);
  
  // Debug individual items
  if (behaviorData && behaviorData.length > 0) {
    behaviorData.slice(0, 3).forEach((item, index) => {
      console.log(`Item ${index}:`, {
        action: item.action,
        currentMonth: item.currentMonth,
        previousMonth: item.previousMonth,
        change: item.change
      });
    });
  }


  // Local helper to convert raw event names to friendly labels
  function getFriendlyEventName(name?: string) {
    const raw = name || '';
    if (typeof window !== 'undefined' && window.umami?.getEventDisplayName) {
      try {
        return window.umami.getEventDisplayName(raw);
      } catch {
        // ignore
      }
    }

    return EVENT_DISPLAY_NAMES[raw] || raw;
  }

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

  // Helper function to truncate long category names for chart display
  const truncateCategory = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  };

  // Convert API data to chart format - prioritize urlPath over action
  const categories = behaviorData && behaviorData.length > 0 
    ? behaviorData.map(b => {
        let label = '';
        
        // Use urlPath if available, otherwise process action
        if (b.urlPath) {
          label = b.urlPath;
        } else if (b.action.startsWith('/')) {
          // If action contains URL path format (starts with /), use it directly
          label = b.action;
        } else if (b.action.includes(':') && b.action.startsWith('/')) {
          // If action contains a URL path with colon (like "/path:click"), extract the path
          label = b.action.split(':')[0];
        } else {
          // For engagement-like actions, show action + path if available
          const friendly = getFriendlyEventName(b.action || '');
          if (b.action === 'page_engagement' && b.urlPath) {
            label = `${friendly}: ${b.urlPath}`;
          } else {
            label = friendly;
          }
        }
        
        // Truncate long labels for better chart readability
        return truncateCategory(label);
      })
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
        formatter: (val: number) => val.toLocaleString(),
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
          ? behaviorData.slice(0, 6).map(b => {
              // Prioritize urlPath for stats cards display
              let label = '';
              
              if (b.urlPath) {
                // Always use urlPath if available
                label = b.urlPath;
                
                // Clean up urlPath format
                if (label.includes(':')) {
                  label = label.split(':')[0];
                }
                
                // Shorten long paths for stats card display
                if (label.length > 15) {
                  const parts = label.split('/').filter(p => p.length > 0);
                  if (parts.length > 2) {
                    label = `/${parts[0]}/.../${parts[parts.length - 1]}`;
                  } else if (parts.length > 1) {
                    label = `/${parts[0]}/.../`;
                  } else {
                    label = label.slice(0, 12) + '...';
                  }
                }
              } else if (b.action.startsWith('/')) {
                // Use action if it's a path format
                label = b.action;
                if (label.includes(':')) {
                  label = label.split(':')[0];
                }
                
                // Shorten long action paths
                if (label.length > 15) {
                  const parts = label.split('/').filter(p => p.length > 0);
                  if (parts.length > 2) {
                    label = `/${parts[0]}/.../${parts[parts.length - 1]}`;
                  } else {
                    label = label.slice(0, 12) + '...';
                  }
                }
              } else {
                // For non-path actions, show friendly name
                label = getFriendlyEventName(b.action || '');
                // Truncate friendly names too if needed
                if (label.length > 15) {
                  label = label.slice(0, 12) + '...';
                }
              }
              
              // Handle trend display logic
              const formatTrend = (change: number, previousMonth: number) => {
                if (previousMonth === 0) {
                  return change > 0 ? '0%' : '0%';
                }
                return change >= 0 ? `+${Math.abs(change)}%` : `-${Math.abs(change)}%`;
              };
              
              return {
                label,
                value: b.currentMonth.toLocaleString(), // Format as number, not percentage
                trend: formatTrend(b.change, b.previousMonth),
                trendIsPositive: b.change >= 0
              };
            })
          : [
              { label: "Tìm kiếm", value: "1,250", trend: "+7%", trendIsPositive: true },
              { label: "Xem SP", value: "980", trend: "+7%", trendIsPositive: true },
              { label: "Giỏ hàng", value: "750", trend: "+7%", trendIsPositive: true },
              { label: "Thanh toán", value: "580", trend: "+6%", trendIsPositive: true },
              { label: "Đánh giá", value: "450", trend: "+7%", trendIsPositive: true },
              { label: "Chia sẻ", value: "320", trend: "+6%", trendIsPositive: true },
            ]
        ).map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50"
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 h-7">{stat.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <span className={`text-xs font-medium ${
                stat.trendIsPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Xem thêm tất cả hành vi
        </button>
      </div>

      {/* Modal Component */}
      <UserBehaviorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        websiteId={websiteId}
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={setSelectedTimeRange}
      />
    </div>
  );
}
