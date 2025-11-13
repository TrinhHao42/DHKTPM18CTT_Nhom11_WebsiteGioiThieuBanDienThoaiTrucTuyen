import React from "react";
import { PromotionMetrics, PromotionTable } from "@/components/promotions";

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý chương trình khuyến mãi
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Quản lý các chương trình khuyến mãi cho sự kiện và ngày đặc biệt
        </p>
      </div>

      <PromotionMetrics />
      <PromotionTable />
    </div>
  );
}
