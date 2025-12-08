import { DiscountPageResponse, DiscountRequest, DiscountResponse, DiscountStatisticResponse } from '@/types/discount'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/discounts";

class DiscountService {
    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem("admin_token");
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }
        return response.json();
    }
    async getStatistics(): Promise<DiscountStatisticResponse> {
        const response = await fetch(`${API_BASE_URL}/statistics`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse<DiscountStatisticResponse>(response);
    }
    async create(discount: DiscountRequest): Promise<void> {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
                ...discount,
                discountStartDate: discount.discountStartDate,
                discountEndDate: discount.discountEndDate,
            }),
        });

        return this.handleResponse<void>(response);
    }
    async delete(id: number): Promise<void> {
        const response = await fetch(
            `${API_BASE_URL}/${id}`,
            {
                method: "DELETE",
                headers: this.getAuthHeaders(),
            }
        );
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`
            );
        }
    }
    async update(id: number, discount: DiscountRequest): Promise<void> {
        const response = await fetch(
            `${API_BASE_URL}/${id}`,
            {
                method: "PUT",
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    ...discount,
                    discountStartDate: discount.discountStartDate,
                    discountEndDate: discount.discountEndDate,
                }),
            }
        );
        return this.handleResponse(response);
    }
    // Trong DiscountService.ts (Sửa lại getById)
    async getById(id: number): Promise<DiscountResponse> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });

        // 1. Lấy toàn bộ phản hồi
        const result = await this.handleResponse<any>(response);

        // 2. Trả về đối tượng coupon (phần data)
        // Nếu API trả về { status: 'success', data: {...coupon data...} }
        if (result && result.data) {
            return result.data as DiscountResponse; // Trả về phần dữ liệu
        }

        // Nếu API trả về trực tiếp đối tượng coupon
        return result as DiscountResponse;
    }

    async getDashboard(
        keyword?: string,
        page: number = 0,
        size: number = 10,
        status: string = "all" // Thêm tham số status
    ): Promise<DiscountPageResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append("status", status); // Truyền status vào query params
        queryParams.append("page", page.toString());
        queryParams.append("size", size.toString());
        if (keyword) {
            queryParams.append("keyword", keyword);
        }

        const response = await fetch(
            `${API_BASE_URL}?${queryParams.toString()}`,
            {
                method: "GET",
                headers: this.getAuthHeaders(),
                cache: "no-store",
            }
        );
        return this.handleResponse<DiscountPageResponse>(response);
    }
}
export const discountService = new DiscountService();
export default discountService;