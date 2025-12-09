import { StaffResponse, StaffStatisticsResponse, StaffRequest } from "@/types/staff";



const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/staff"; 


class StaffService {
    
    private getAuthHeaders(): HeadersInit {
        // Lấy token từ localStorage hoặc nơi lưu trữ khác
        const token = localStorage.getItem("admin_token");
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }

  
    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
       
            const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
            throw new Error(errorMessage);
        }
        
        if (response.status === 204) {
             return null as T; // Trả về null hoặc giá trị phù hợp cho T
        }
        return response.json();
    }

    // -----------------------------------------------------------------
    // 1. READ (GET) OPERATIONS
    // -----------------------------------------------------------------

    /**
     * Lấy dữ liệu thống kê: GET /api/staff/statistics
     */
    async getStatistics(): Promise<StaffStatisticsResponse> {
        const response = await fetch(`${API_BASE_URL}/statistics`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse<StaffStatisticsResponse>(response);
    }
    
    /**
     * Lấy danh sách nhân viên: GET /api/staff/list
     * Backend dùng tham số 'activated' (Boolean), frontend dùng 'status' (String)
     */
    async getDashboard(
        keyword?: string,
        page: number = 0,
        size: number = 10,
        status: string = "all"
    ): Promise<StaffResponse> {
        const queryParams = new URLSearchParams();
        
      
        let activatedParam: boolean | undefined;
        if (status === "activated") {
            activatedParam = true;
        } else if (status === "notActivated") {
            activatedParam = false;
        }
        
        if (activatedParam !== undefined) {
             queryParams.append("activated", activatedParam.toString());
        }

        queryParams.append("page", page.toString());
        queryParams.append("size", size.toString());

        if (keyword) {
            queryParams.append("keyword", keyword);
        }

        const response = await fetch(
            `${API_BASE_URL}/list?${queryParams.toString()}`, 
            {
                method: "GET",
                headers: this.getAuthHeaders(),
                cache: "no-store",
            }
        );
     
        return this.handleResponse<StaffResponse>(response);
    }
    
    /**
     * Lấy chi tiết nhân viên: GET /api/staff/{id}
     */
    async getStaffDetail(id: number | string): Promise<StaffResponse> {
         const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "GET",
            headers: this.getAuthHeaders(),
        });
        return this.handleResponse<StaffResponse>(response);
    }

    // -----------------------------------------------------------------
    // 2. CREATE (POST) OPERATION
    // -----------------------------------------------------------------

    /**
     * Thêm nhân viên mới: POST /api/staff
     */
    async createStaff(request: StaffRequest): Promise<StaffResponse> {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(request),
        });
        return this.handleResponse<StaffResponse>(response);
    }

    // -----------------------------------------------------------------
    // 3. UPDATE (PUT) OPERATION
    // -----------------------------------------------------------------

    /**
     * Cập nhật thông tin nhân viên: PUT /api/staff/{id}
     */
    async updateStaff(id: number | string, request: StaffRequest): Promise<StaffResponse> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: this.getAuthHeaders(),
            body: JSON.stringify(request),
        });
        return this.handleResponse<StaffResponse>(response);
    }

    // -----------------------------------------------------------------
    // 4. DELETE (DELETE) OPERATION
    // -----------------------------------------------------------------

    /**
     * Xóa nhân viên: DELETE /api/staff/{id}
     */
    async deleteStaff(id: number | string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
            headers: this.getAuthHeaders(),
        });
        // handleResponse sẽ trả về null (dùng void) do backend trả về 204 No Content
        await this.handleResponse<void>(response);
    }
}

export const staffService = new StaffService();
export default staffService;