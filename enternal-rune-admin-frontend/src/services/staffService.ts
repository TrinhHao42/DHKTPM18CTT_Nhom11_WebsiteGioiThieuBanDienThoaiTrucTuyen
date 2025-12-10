// 
import {
    StaffResponse,
    StaffStatisticsResponse,
    StaffRequest
} from "@/types/staff";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/staff";

class StaffService {
    private getAuthHeaders(): HeadersInit {
        const token = typeof window !== "undefined"
            ? localStorage.getItem("admin_token")
            : null;

        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage =
                errorData.message ||
                errorData.error ||
                `HTTP Error: ${response.status}`;
            throw new Error(errorMessage);
        }

        if (response.status === 204) return null as T;

        return response.json();
    }

    // ============================================================
    // 1. GET
    // ============================================================

    async getStatistics(): Promise<StaffStatisticsResponse> {
        const response = await fetch(`${API_BASE_URL}/statistics`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    async getDashboard(
        keyword?: string,
        page: number = 0,
        size: number = 10,
        status: string = "all"
    ): Promise<StaffResponse> {
        const query = new URLSearchParams();

        if (status === "activated") query.append("activated", "true");
        else if (status === "notActivated") query.append("activated", "false");

        query.append("page", page.toString());
        query.append("size", size.toString());

        if (keyword) query.append("keyword", keyword);

        const response = await fetch(
            `${API_BASE_URL}/list?${query.toString()}`,
            {
                method: "GET",
                headers: this.getAuthHeaders(),
                cache: "no-store",
            }
        );

        return this.handleResponse(response);
    }

    async getStaffById(id: number) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error("Không tải được thông tin nhân viên");
        }
        return response.json();
    }

    // ============================================================
    // 2. CREATE
    // ============================================================

    // Trong staffService.ts

    async createStaff(request: StaffRequest): Promise<StaffResponse> {
        // LƯU Ý: Khi tạo mới, API thường mong đợi các trường dữ liệu đầy đủ, 
        // KHÔNG chỉ ID, trừ khi Role/Address đã tồn tại và bạn chỉ cần tham chiếu.
        // Dựa trên code của bạn, ta cần gửi roleName và chi tiết Address.

        const payload = {
            name: request.name,
            email: request.email,
            password: request.password, // Mật khẩu có thể là undefined/null, API sẽ xử lý
            status: request.status ?? true,

            // Gửi Role Name lên (Giả định Backend nhận Role Name để tự tìm ID)
            role: {
                roleName: request.role.roleName
            },

            // Gửi chi tiết Address lên (Giả định Backend tạo Address mới)
            address: {
                streetName: request.address.streetName,
                wardName: request.address.wardName,
                cityName: request.address.cityName,
                countryName: request.address.countryName,
                // addressId: null (Không cần thiết khi tạo mới)
            },
        };

        console.log("Payload CREATE ĐÃ SỬA:", payload);

        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        return this.handleResponse(response);
    }

    // ============================================================
    // 3. UPDATE
    // ============================================================

    async updateStaff(id: number, request: StaffRequest): Promise<StaffResponse> {
        const payload: Partial<StaffRequest> & {
            role: { id: number | null, roleName?: string }; // Đảm bảo role có ID
            address: { addressId: number | null, streetName?: string, wardName?: string, cityName?: string, countryName?: string }; // Đảm bảo address có ID
        } = {
            name: request.name,
            email: request.email,
            status: request.status,
            role: request.role,
            address: request.address,
        };

        // Chỉ gửi password nếu có giá trị (vì nó là optional)
        if (request.password) {
            payload.password = request.password;
        }

        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(payload),
        });

        return this.handleResponse(response);
    }

    // ============================================================
    // 4. DELETE
    // ============================================================

    async deleteStaff(id: number | string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
            headers: this.getAuthHeaders(),
        });

        await this.handleResponse(response);
    }
}

export const staffService = new StaffService();
export default staffService;
