import axiosInstance from "@/lib/axiosInstance";
import { EcommerceDashboardData } from "@/types/dashboard";

class DashboardService {
  /**
   * Lấy dữ liệu dashboard tổng quan
   */
  async getEcommerceDashboard(year?: number): Promise<EcommerceDashboardData> {
    const currentYear = year || new Date().getFullYear();
    const response = await axiosInstance.get<EcommerceDashboardData>(
      `/api/dashboard/overview`,
      {
        params: { year: currentYear },
      }
    );
    return response.data;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
