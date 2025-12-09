"use client";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useDashboard } from "@/hooks/useDashboard";

export default function Ecommerce() {
  const { dashboardData, loading, error } = useDashboard();

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">
          Error loading dashboard: {error}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics 
            metrics={dashboardData?.metrics} 
            loading={loading} 
          />
          <MonthlySalesChart 
            data={dashboardData?.monthlySales} 
            loading={loading} 
          />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget 
            data={dashboardData?.monthlyTarget} 
            loading={loading} 
          />
        </div>

        <div className="col-span-12">
          <StatisticsChart 
            data={dashboardData?.statistics} 
            loading={loading} 
          />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard 
            data={dashboardData?.demographics} 
            loading={loading} 
          />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders 
            data={dashboardData?.recentOrders} 
            loading={loading} 
          />
        </div>
      </div>
    </>
  );
}
