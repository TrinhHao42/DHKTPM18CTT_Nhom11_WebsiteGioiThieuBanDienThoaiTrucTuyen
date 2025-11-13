import type { Metadata } from "next";
import React from "react";
import { ReviewMetrics, ReviewTable } from "@/components/reviews";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Đánh giá & Phản hồi | Admin Dashboard",
  description: "Quản lý đánh giá và phản hồi khách hàng",
};

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageBreadCrumb pageTitle="Đánh giá & Phản hồi" />

      {/* Metrics */}
      <ReviewMetrics />

      {/* Reviews */}
      <ReviewTable />
    </div>
  );
}
