"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { MetricsData } from "@/types/dashboard";

interface EcommerceMetricsProps {
  metrics?: MetricsData;
  loading?: boolean;
}

export const EcommerceMetrics: React.FC<EcommerceMetricsProps> = ({ 
  metrics, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700" />
            <div className="flex items-end justify-between mt-5">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20 mb-2" />
                <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-24" />
              </div>
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const customerGrowth = metrics?.customerGrowthRate || 0;
  const orderGrowth = metrics?.orderGrowthRate || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Khách hàng
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics?.totalCustomers.toLocaleString() || "0"}
            </h4>
          </div>
          <Badge color={customerGrowth >= 0 ? "success" : "error"}>
            {customerGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(customerGrowth).toFixed(2)}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Đơn hàng
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics?.totalOrders.toLocaleString() || "0"}
            </h4>
          </div>

          <Badge color={orderGrowth >= 0 ? "success" : "error"}>
            {orderGrowth >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(orderGrowth).toFixed(2)}%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
