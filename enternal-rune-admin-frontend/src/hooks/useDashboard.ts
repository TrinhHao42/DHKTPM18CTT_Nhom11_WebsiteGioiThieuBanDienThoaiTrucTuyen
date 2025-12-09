"use client";

import { useState, useEffect } from "react";
import { EcommerceDashboardData } from "@/types/dashboard";
import dashboardService from "@/services/dashboardService";

export const useDashboard = (year?: number) => {
  const [dashboardData, setDashboardData] = useState<EcommerceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getEcommerceDashboard(year);
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [year]);

  return {
    dashboardData,
    loading,
    error,
    refetch: fetchDashboard,
  };
};
