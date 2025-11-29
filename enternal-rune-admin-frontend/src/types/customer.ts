// Auth Provider enum matching backend
export type AuthProvider = 'LOCAL' | 'GOOGLE' | 'FACEBOOK';

// Response from GET /api/dashboard-user/list
export interface UserDashboardResponse {
  id: number; // Backend cần thêm field này để hỗ trợ xem chi tiết và xóa
  name: string;
  email: string;
  authProvider: AuthProvider;
  activate: boolean;
  totalOrder: number;
  totalPrice: number;
}

// Response from GET /api/dashboard-user/statistics
export interface UserStatisticsResponse {
  totalUser: number;
  totalUserActivated: number;
  totalUserNotActivated: number;
  providerStatistics: ProviderStatistics;
}

export interface ProviderStatistics {
  local: number;
  google: number;
}

// Response from GET /api/dashboard-user/{id}
export interface UserDetailResponse {
  name: string;
  email: string;
  activate: boolean;
  addresses: AddressResponse[];
  totalOrder: number;
  totalPrice: number;
}

export interface AddressResponse {
  id?: number;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  isDefault?: boolean;
}

// Page response wrapper
export interface UserPageResponse {
  content: UserDashboardResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
