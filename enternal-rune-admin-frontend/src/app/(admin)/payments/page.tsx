import React from "react";
import {
  PaymentMetrics,
  PaymentMethodsManagement,
  TransactionMonitoring,
} from "@/components/payments";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* <div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý thanh toán
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Theo dõi giao dịch, quản lý phương thức thanh toán và đối soát
        </p>
      </div> */}
      <PageBreadCrumb pageTitle="Quản lý thanh toán" />

      <PaymentMetrics />

      <TransactionMonitoring />

      <PaymentMethodsManagement />


    </div>
  );
}
