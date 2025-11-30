"use client";

import React, { useEffect } from "react";
import { ProductMetrics } from "@/components/products/index";
import { ProductTable } from "@/components/products/index";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const {
    products,
    statistics,
    pagination,
    loading,
    error,
    fetchProducts,
    fetchStatistics,
    deleteProduct,
    changePage,
    search,
    filterByBrand,
    filterByStatus,
  } = useProducts({ page: 0, size: 8 });

  // Load data khi component mount
  useEffect(() => {
    fetchProducts();
    fetchStatistics();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      // Thông báo thành công có thể thêm toast notification ở đây
    } catch (err) {
      console.error("Error deleting product:", err);
      // Thông báo lỗi có thể thêm toast notification ở đây
    }
  };

  const handleFilterByStatus = (status: "ACTIVE" | "OUT_OF_STOCK" | "REMOVED" | "all") => {
    if (status === "all") {
      fetchProducts({ page: 0, status: undefined });
    } else {
      filterByStatus(status);
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadCrumb pageTitle="Danh sách sản phẩm" />

      {/* Metrics */}
      <ProductMetrics statistics={statistics} loading={loading} />

      {/* Product Table */}
      <ProductTable
        products={products}
        loading={loading}
        pagination={pagination}
        onSearch={search}
        onFilterByStatus={handleFilterByStatus}
        onFilterByBrand={filterByBrand}
        onChangePage={changePage}
        onDelete={handleDelete}
      />
    </div>
  );
}
