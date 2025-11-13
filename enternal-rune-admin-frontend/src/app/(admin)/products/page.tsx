import type { Metadata } from "next";
import React from "react";
import { ProductMetrics } from "@/components/products/index";
import { ProductTable } from "@/components/products/index";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm | Admin Dashboard",
  description: "Quản lý danh sách sản phẩm",
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
            Danh sách sản phẩm
          </h1>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Quản lý và theo dõi tất cả sản phẩm trong hệ thống
          </p>
        </div>
      </div> */}
    <PageBreadCrumb pageTitle="Danh sách sản phẩm" />

      {/* Metrics */}
      <ProductMetrics />

      {/* Product Table */}
      <ProductTable />
    </div>
  );
}
