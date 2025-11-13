import type { Metadata } from "next";
import React from "react";
import StaffMetrics from "@/components/staff/StaffMetrics";
import StaffTable from "@/components/staff/StaffTable";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Danh sách nhân viên | Admin Dashboard",
  description: "Quản lý danh sách nhân viên",
};

export default function StaffPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageBreadCrumb pageTitle="Danh sách nhân viên" />

      {/* Metrics */}
      <StaffMetrics />

      {/* Staff Table */}
      <StaffTable />
    </div>
  );
}
