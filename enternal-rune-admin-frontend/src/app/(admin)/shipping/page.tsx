import React from 'react';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';
import { ShippingMetrics, ShippingProviders, ShippingTracking } from '@/components/shipping';

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb */}
      <PageBreadCrumb pageTitle="Quản lý vận chuyển" />

      {/* Metrics */}
      <ShippingMetrics />

      {/* Shipping Tracking */}
      <ShippingTracking />

      {/* Shipping Providers Management */}
      <ShippingProviders />
    </div>
  );
}
