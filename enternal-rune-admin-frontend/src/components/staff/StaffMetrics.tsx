"use client";
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import staffService from "@/services/staffService";
import { StaffStatisticsResponse } from "@/types/staff"
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";
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

export default function StaffMetrics() {
  const [stats, setStats] = useState<StaffStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Gọi hàm API để lấy dữ liệu thống kê
        const data = await staffService.getStatistics();
        setStats(data);
      } catch (err) {
        console.error("Error fetching staff statistics:", err);
        // Hiển thị thông báo lỗi chi tiết hơn nếu có
        setError((err as Error).message || "Không thể tải dữ liệu thống kê.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {/* Skeleton Loading */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl border bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md dark:bg-red-900 dark:border-red-700 dark:text-red-300">
        Lỗi tải dữ liệu: **{error}**
      </div>
    );
  }

  // Format Tỷ lệ hiện diện (Presence Rate) thành chuỗi phần trăm
  const presenceRateValue = stats?.presenceRate !== undefined
    ? `${stats.presenceRate.toFixed(1)}%` // Làm tròn 1 chữ số thập phân
    : "0%";

  // Giá trị này được lấy từ StaffStatisticsResponse.totalStaffActivated
  const activatedStaffValue = stats?.totalStaffActivated || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">


      <MetricCard
        icon={
          <svg /* Icon cũ cho Tổng nhân viên */ className="text-gray-800 size-6 dark:text-white/90" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        }
        title="Tổng nhân viên"
        value={stats?.totalStaff || 0}
      
      />

      {/* 2. Ngừng hoạt động (totalStaffNotActivated) - Thay thế cho "Các phòng ban" */}
      <MetricCard
        icon={
          // Icon để tượng trưng cho trạng thái tạm dừng/không hoạt động
          <svg className="text-gray-800 size-6 dark:text-white/90" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 10.29L13.71 13.71M13.71 10.29L10.29 13.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        }
        title="Ngừng hoạt động"
        value={stats?.totalStaffNotActivated || 0}
        
      />

      {/* 3. Đang hoạt động (totalStaffActivated) - Thay đổi tiêu đề từ "Đang làm việc" */}
      <MetricCard
        icon={
          <svg /* Icon cũ cho Đang làm việc */ className="text-gray-800 size-6 dark:text-white/90" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.05 11C3.291 9.537 3.934 8.171 4.908 7.057C5.882 5.943 7.149 5.126 8.566 4.702C9.983 4.278 11.491 4.265 12.915 4.663C14.339 5.061 15.62 5.855 16.615 6.953" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20.95 13C20.709 14.463 20.066 15.829 19.092 16.943C18.118 18.057 16.851 18.874 15.434 19.298C14.017 19.722 12.509 19.735 11.085 19.337C9.661 18.939 8.38 18.145 7.385 17.047" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 10H17V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 18L3 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        }
        title="Đang hoạt động"
        value={activatedStaffValue}
        
      />

      {/* 4. Tỷ lệ hiện diện (presenceRate) */}
      <MetricCard
        icon={
          <svg /* Icon cũ cho Tỷ lệ hiện diện */ className="text-gray-800 size-6 dark:text-white/90" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        }
        title="Tỷ lệ hiện diện"
        value={presenceRateValue}
        
      />
    </div>
  );
}