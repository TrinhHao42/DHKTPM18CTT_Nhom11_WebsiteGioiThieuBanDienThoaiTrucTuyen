import {
  ProductResponse,
  ProductDashboardResponse,
  ProductDashboardListResponse,
  PageResponse,
  ProductFilterParams,
  ProductRequest,
  ProductFormData,
} from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

class ProductService {
  /**
   * Lấy authorization headers (không có Content-Type cho multipart)
   */
  private getAuthToken(): string | null {
    return localStorage.getItem("admin_token");
  }

  /**
   * Lấy authorization headers cho JSON requests
   */
  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
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
   * POST /products/dashboard/add (multipart/form-data)
   */
  async add(formData: ProductFormData, imageFiles: File[]): Promise<string> {
    const token = this.getAuthToken();
    
    // Tạo ProductRequest từ FormData (images sẽ được gửi qua multipart)
    const productRequest: ProductRequest = {
      productName: formData.productName,
      productModel: formData.productModel,
      productStatus: formData.productStatus,
      productVersion: formData.productVersion,
      productColor: formData.productColor,
      productDescription: formData.productDescription,
      brandId: formData.brandId,
      images: [], // Ảnh được gửi qua multipart form-data
      productPrices: [{ ppPrice: formData.price }],
    };

    // Tạo FormData cho multipart request
    const multipartFormData = new FormData();
    multipartFormData.append('product', JSON.stringify(productRequest));
    
    // Thêm các file ảnh
    imageFiles.forEach((file) => {
      multipartFormData.append('images', file);
    });

    const response = await fetch(`${API_BASE_URL}/products/dashboard/add`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: multipartFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.text();
  }

  /**
   * Cập nhật sản phẩm
   * PUT /products/dashboard/update/{id} (multipart/form-data)
   * @param id - ID sản phẩm
   * @param formData - Dữ liệu form
   * @param existingImages - Ảnh hiện tại (gửi trong data)
   * @param newImageFiles - File ảnh mới (optional)
   */
  async update(
    id: number,
    formData: ProductFormData,
    existingImages: Array<{ imageName: string; imageData: string }>,
    newImageFiles: File[] = []
  ): Promise<ProductResponse> {
    const token = this.getAuthToken();

    // Tạo ProductRequest từ FormData
    const productRequest: ProductRequest = {
      productName: formData.productName,
      productModel: formData.productModel,
      productStatus: formData.productStatus,
      productVersion: formData.productVersion,
      productColor: formData.productColor,
      productDescription: formData.productDescription,
      brandId: formData.brandId,
      images: existingImages.map((img) => ({
        imageName: img.imageName,
        imageData: img.imageData,
      })),
      productPrices: [{ ppPrice: formData.price }],
    };

    // Tạo FormData cho multipart request
    const multipartFormData = new FormData();
    multipartFormData.append('data', new Blob([JSON.stringify(productRequest)], { type: 'application/json' }));
    
    // Thêm các file ảnh mới (nếu có)
    newImageFiles.forEach((file) => {
      multipartFormData.append('files', file);
    });

    console.log("Updating product with data:", JSON.stringify(productRequest));
    
    const response = await fetch(
      `${API_BASE_URL}/products/dashboard/update/${id}`,
      {
        method: "PUT",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: multipartFormData,
      }
    );
    return this.handleResponse<ProductResponse>(response);
  }

  /**
   * Xóa sản phẩm
   * DELETE /products/dashboard/delete/{id}
   */
  async delete(id: number): Promise<void> {
    await fetch(
      `${API_BASE_URL}/products/dashboard/delete/${id}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   * GET /products/dashboard/{id}
   */
  async getById(id: number): Promise<ProductResponse | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/dashboard/${id}`,
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
      OUT_OF_STOCK: "Hết hàng",
      REMOVED: "Đã xóa",
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
      OUT_OF_STOCK: "warning",
      REMOVED: "danger",
    };
    return colorMap[status] || "default";
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;
