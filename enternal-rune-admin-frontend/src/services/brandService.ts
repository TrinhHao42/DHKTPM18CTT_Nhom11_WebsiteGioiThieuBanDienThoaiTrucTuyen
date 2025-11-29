import {
  BrandResponse,
  BrandDashboardListResponse,
  BrandRequest,
  BrandPageResponse,
} from "@/types/brand";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class BrandService {
  /**
   * Lấy authorization headers
   */
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("admin_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Xử lý response và error
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  /**
   * Lấy danh sách tên thương hiệu (cho dropdown)
   * GET /brands/names
   */
  async getNames(): Promise<BrandResponse[]> {
    const response = await fetch(`${API_BASE_URL}/brands/names`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<BrandResponse[]>(response);
  }

  /**
   * Lấy danh sách thương hiệu với phân trang (dashboard)
   * GET /brands/dashboard
   */
  async getDashboard(
    keyword?: string,
    page: number = 0,
    size: number = 8
  ): Promise<BrandPageResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    if (keyword) {
      queryParams.append("keyword", keyword);
    }

    const response = await fetch(
      `${API_BASE_URL}/brands/dashboard?${queryParams.toString()}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<BrandPageResponse>(response);
  }

  /**
   * Thêm thương hiệu mới
   * POST /brands/dashboard/add
   */
  async add(brand: BrandRequest): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/brands/dashboard/add`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(brand),
    });
    return this.handleResponse<string>(response);
  }

  /**
   * Cập nhật thương hiệu
   * PUT /brands/dashboard/update/{id}
   */
  async update(id: number, brand: BrandRequest): Promise<string> {
    const response = await fetch(
      `${API_BASE_URL}/brands/dashboard/update/${id}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(brand),
      }
    );
    return this.handleResponse<string>(response);
  }

  /**
   * Xóa thương hiệu
   * DELETE /brands/dashboard/delete/{id}
   */
  async delete(id: number): Promise<string> {
    const response = await fetch(
      `${API_BASE_URL}/brands/dashboard/delete/${id}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<string>(response);
  }
}

// Export singleton instance
export const brandService = new BrandService();
export default brandService;
