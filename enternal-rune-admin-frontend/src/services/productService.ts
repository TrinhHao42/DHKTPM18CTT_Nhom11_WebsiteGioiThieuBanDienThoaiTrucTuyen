import {
  ProductResponse,
  ProductDashboardResponse,
  ProductDashboardListResponse,
  PageResponse,
  ProductFilterParams,
} from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Interface cho form data
export interface  ProductFormData {
  productId?: number;
  productName: string;
  model: string;
  category: string;
  price: number;
  status: string;
  imageUrl?: string;
}

class ProductService {
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

  // ==================== DASHBOARD APIs ====================

  /**
   * Lấy thống kê dashboard
   * GET /products/dashboard/statistics
   */
  async getStatistics(): Promise<ProductDashboardResponse> {
    const response = await fetch(
      `${API_BASE_URL}/products/dashboard/statistics`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<ProductDashboardResponse>(response);
  }

  /**
   * Lấy danh sách sản phẩm với phân trang và filter
   * GET /products/dashboard/list
   */
  async getAll(
    params: ProductFilterParams = {}
  ): Promise<PageResponse<ProductDashboardListResponse>> {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());
    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.brand) queryParams.append("brand", params.brand);
    if (params.status) queryParams.append("status", params.status);

    const response = await fetch(
      `${API_BASE_URL}/products/dashboard/list?${queryParams.toString()}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<PageResponse<ProductDashboardListResponse>>(
      response
    );
  }

  /**
   * Thêm sản phẩm mới
   * POST /products/dashboard/add
   */
  async add(product: ProductFormData): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/products/dashboard/add`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(product),
    });
    return this.handleResponse<string>(response);
  }

  /**
   * Cập nhật sản phẩm
   * PUT /products/dashboard/update/{id}
   */
  async update(id: number, product: ProductFormData): Promise<ProductResponse> {
    console.log("Updating product:", id, product);
    const response = await fetch(
      `${API_BASE_URL}/products/dashboard/update/${id}`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(product),
      }
    );
    return this.handleResponse<ProductResponse>(response);
  }

  /**
   * Xóa sản phẩm
   * DELETE /products/dashboard/delete/{id}
   */
  async delete(id: number): Promise<string> {
    const response = await fetch(
      `${API_BASE_URL}/products/dashboard/delete/${id}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<string>(response);
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   * GET /products/{id}/active-price (tạm thời dùng endpoint này)
   */
  async getById(id: number): Promise<ProductResponse | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${id}/active-price`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      return this.handleResponse<ProductResponse>(response);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  /**
   * Format giá tiền VND
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  /**
   * Lấy label cho trạng thái
   */
  getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
      ACTIVE: "Đang bán",
      INACTIVE: "Ngừng bán",
      OUT_OF_STOCK: "Hết hàng",
    };
    return statusMap[status] || status;
  }

  /**
   * Lấy màu cho trạng thái (dùng cho badge)
   */
  getStatusColor(
    status: string
  ): "success" | "warning" | "danger" | "default" {
    const colorMap: Record<
      string,
      "success" | "warning" | "danger" | "default"
    > = {
      ACTIVE: "success",
      INACTIVE: "warning",
      OUT_OF_STOCK: "danger",
    };
    return colorMap[status] || "default";
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;
