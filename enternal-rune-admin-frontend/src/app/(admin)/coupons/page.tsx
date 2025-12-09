'use-client'
import React from "react";
import { CouponMetrics, CouponTable } from "@/components/coupons";

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý mã giảm giá
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Tạo và quản lý các mã giảm giá áp dụng cho đơn hàng
        </p>
      </div>

      <CouponMetrics />

      <CouponTable />
    </div>
  );
}
