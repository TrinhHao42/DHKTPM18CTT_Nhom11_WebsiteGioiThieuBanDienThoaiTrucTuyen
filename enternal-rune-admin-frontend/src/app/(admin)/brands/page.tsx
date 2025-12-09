'use client';

import React, { useEffect } from 'react';
import { useBrands } from '@/hooks/useBrands';
import BrandMetrics from '@/components/brands/BrandMetrics';
import BrandTable from '@/components/brands/BrandTable';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';

export default function BrandsPage() {
  const {
    brands,
    loading,
    error,
    statistics,
    statisticsLoading,
    pagination,
    fetchBrands,
    fetchStatistics,
    deleteBrand,
    search,
    changePage,
  } = useBrands();

  useEffect(() => {
    fetchBrands();
    fetchStatistics();
  }, [fetchBrands, fetchStatistics]);

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand(id);
      // deleteBrand đã tự động gọi fetchBrands() bên trong
      // Chỉ cần refresh statistics
      await fetchStatistics();
    } catch (err: any) {
      console.error('Lỗi khi xóa thương hiệu:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageBreadCrumb pageTitle="Thương hiệu" />

      {/* Metrics */}
      <BrandMetrics 
        statistics={statistics}
        loading={statisticsLoading}
      />

      {/* Table */}
      <BrandTable
        brands={brands}
        loading={loading}
        pagination={pagination}
        onSearch={search}
        onChangePage={changePage}
        onDelete={handleDelete}
      />
    </div>
  );
}
