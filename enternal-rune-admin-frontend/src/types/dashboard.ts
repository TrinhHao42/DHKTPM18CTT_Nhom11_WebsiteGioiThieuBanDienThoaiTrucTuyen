export interface EcommerceDashboardData {
  metrics: MetricsData;
  monthlySales: MonthlySalesData[];
  monthlyTarget: MonthlyTargetData;
  statistics: StatisticsData[];
  demographics: DemographicData[];
  recentOrders: RecentOrderData[];
}

export interface MetricsData {
  totalCustomers: number;
  customerGrowthRate: number;
  totalOrders: number;
  orderGrowthRate: number;
}

export interface MonthlySalesData {
  month: string;
  amount: number;
  orderCount: number;
}

export interface MonthlyTargetData {
  target: number;
  achieved: number;
  percentage: number;
}

export interface StatisticsData {
  month: string;
  revenue: number;
  profit: number;
}

export interface DemographicData {
  country: string;
  countryCode: string;
  customerCount: number;
  percentage: number;
}

export interface RecentOrderData {
  orderId: number;
  productName: string;
  productImage: string;
  category: string;
  price: number;
  status: string;
  customerName: string;
  orderDate: string;
}
