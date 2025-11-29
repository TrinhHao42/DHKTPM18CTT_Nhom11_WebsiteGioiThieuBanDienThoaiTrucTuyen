// API Service cho authentication và các API calls khác
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  roles: string[];
  user: {
    userId: number;
    userEmail: string;
    userName: string;
    userAddress: Array<{
      addressId: number;
      streetName: string;
      wardName: string;
      cityName: string;
      countryName: string;
      phoneNumber: string;
    }>;
  };
}

class AuthService {
  /**
   * Đăng nhập
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    }

    return response.json();
  }

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser(token: string): Promise<{
    username: string;
    roles: string[];
  }> {
    const response = await fetch(`${API_BASE_URL}/account/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    return response.json();
  }

  /**
   * Helper function để tạo headers với token
   */
  getAuthHeaders(token: string): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Helper function để gọi API với authentication
   */
  async authenticatedFetch(
    endpoint: string,
    token: string,
    options: RequestInit = {}
  ): Promise<Response> {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getAuthHeaders(token),
        ...options.headers,
      },
    });
  }
}

export const authService = new AuthService();
export default authService;
