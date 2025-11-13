import type { Metadata } from "next";
import React from "react";
import CustomerMetrics from "@/components/customers/CustomerMetrics";
import CustomerTable from "@/components/customers/CustomerTable";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Danh sách khách hàng | Admin Dashboard",
  description: "Quản lý danh sách khách hàng",
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageBreadCrumb pageTitle="Danh sách khách hàng" />

      {/* Metrics */}
      <CustomerMetrics />

      {/* Customer Table */}
      <CustomerTable />
    </div>
  );
}
