"use client";
import React, { useEffect } from "react";
import CustomerMetrics from "@/components/customers/CustomerMetrics";
import CustomerTable from "@/components/customers/CustomerTable";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { useCustomers } from "@/hooks/useCustomers";

export default function CustomersPage() {
  const {
    customers,
    statistics,
    loading,
    totalPages,
    totalElements,
    currentPage,
    fetchCustomers,
    fetchStatistics,
    deleteCustomer,
    search,
    changePage,
  } = useCustomers();

  useEffect(() => {
    fetchStatistics();
    fetchCustomers();
  }, [fetchStatistics, fetchCustomers]);

  const handleDelete = async (id: number) => {
    await deleteCustomer(id);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageBreadCrumb pageTitle="Danh sách khách hàng" />

      {/* Metrics */}
      <CustomerMetrics statistics={statistics} loading={loading} />

      {/* Customer Table */}
      <CustomerTable
        customers={customers}
        loading={loading}
        totalPages={totalPages}
        currentPage={currentPage}
        totalElements={totalElements}
        onSearch={search}
        onPageChange={changePage}
        onDelete={handleDelete}
      />
    </div>
  );
}
