import type { Metadata } from "next";
import React from "react";
import { CategoryMetrics, CategoryTable } from "@/components/categories";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm | Admin Dashboard",
  description: "Quản lý danh mục sản phẩm",
};

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageBreadCrumb pageTitle="Danh mục sản phẩm" />

      {/* Metrics */}
      <CategoryMetrics />

      {/* Table */}
      <CategoryTable />
    </div>
  );
}
