import React from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { OrderMetrics, OrderTable } from "@/components/orders";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb */}
      <PageBreadCrumb pageTitle="Danh sách đơn hàng" />

      {/* Metrics */}
      <OrderMetrics />

      {/* Orders Table */}
      <OrderTable />
    </div>
  );
}
