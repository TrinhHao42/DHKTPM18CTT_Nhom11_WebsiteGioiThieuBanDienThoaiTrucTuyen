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
    pagination,
    fetchBrands,
    deleteBrand,
    search,
    changePage,
  } = useBrands();

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand(id);
      alert('Xóa thương hiệu thành công!');
    } catch (err: any) {
      alert(err.message || 'Không thể xóa thương hiệu');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageBreadCrumb pageTitle="Thương hiệu" />

      {/* Metrics */}
      <BrandMetrics 
        totalBrands={pagination.totalElements}
        loading={loading}
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
