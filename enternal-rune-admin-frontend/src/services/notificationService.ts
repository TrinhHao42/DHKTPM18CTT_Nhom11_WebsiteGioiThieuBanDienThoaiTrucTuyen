import { BackendNotification } from "@/types/Notification";

// Try direct backend call first, then fallback to proxy
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_BASE_URL = "/api";

class NotificationService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("admin_token");
    console.log('🔑 Token exists:', !!token);
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Lấy tất cả notifications
   */
  async getAllNotifications(): Promise<BackendNotification[]> {
    // Try direct backend call first
    const directUrl = `${BACKEND_URL}/api/notifications`;
    console.log('🌐 Trying direct backend URL:', directUrl);
    
    try {
      const response = await fetch(directUrl, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      console.log('📡 Direct response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Direct response error:', errorText);
        throw new Error("Không thể lấy danh sách thông báo");
      }

      const data = await response.json();
      console.log('✅ Notifications data:', data);
      return data;
    } catch (error) {
      console.error('❌ Fetch error:', error);
      throw error;
    }
  }

  /**
   * Lấy notifications với phân trang
   */
  async getNotificationsPaginated(page: number = 0, size: number = 10): Promise<{
    content: BackendNotification[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    const response = await fetch(
      `${API_BASE_URL}/notifications/paginated?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách thông báo");
    }

    return response.json();
  }

  /**
   * Lấy số thông báo chưa đọc
   */
  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Không thể lấy số thông báo chưa đọc");
    }

    const data = await response.json();
    return data.unreadCount;
  }

  /**
   * Đánh dấu một thông báo đã đọc
   */
  async markAsRead(notificationId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Không thể đánh dấu thông báo đã đọc");
    }
  }

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Không thể đánh dấu tất cả thông báo đã đọc");
    }
  }
}

export const notificationService = new NotificationService();
