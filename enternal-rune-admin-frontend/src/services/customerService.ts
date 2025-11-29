import {
  UserStatisticsResponse,
  UserPageResponse,
  UserDetailResponse,
} from '@/types/customer';

const API_BASE_URL = 'http://localhost:8080/api/dashboard-user';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('admin_access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const customerService = {
  getStatistics: async (): Promise<UserStatisticsResponse> => {
    const response = await fetch(`${API_BASE_URL}/statistics`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user statistics');
    }
    return response.json();
  },

  getDashboard: async (
    keyword?: string,
    activated?: boolean | null,
    page: number = 0,
    size: number = 10
  ): Promise<UserPageResponse> => {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (activated !== null && activated !== undefined) {
      params.append('activated', String(activated));
    }
    params.append('page', String(page));
    params.append('size', String(size));

    const response = await fetch(`${API_BASE_URL}/list?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users dashboard');
    }
    return response.json();
  },

  getDetail: async (id: number): Promise<UserDetailResponse> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user detail');
    }
    return response.json();
  },

  deleteCustomer: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
  },
};
