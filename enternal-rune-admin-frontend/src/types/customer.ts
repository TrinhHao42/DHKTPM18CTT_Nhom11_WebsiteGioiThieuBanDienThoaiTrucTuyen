export interface UserDashboardResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  activated: boolean;
  avatarUrl: string | null;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

export interface UserDetailResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  activated: boolean;
  avatarUrl: string | null;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  shippingAddresses: ShippingAddress[];
  recentOrders: RecentOrder[];
}

export interface ShippingAddress {
  id: number;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault: boolean;
}

export interface RecentOrder {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  itemCount: number;
}

export interface UserStatisticsResponse {
  totalUsers: number;
  activatedUsers: number;
  inactivatedUsers: number;
}

export interface UserPageResponse {
  content: UserDashboardResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
