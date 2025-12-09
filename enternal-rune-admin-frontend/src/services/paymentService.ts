import {
  PaymentMetrics,
  Transaction,
  TransactionListResponse,
  TransactionFilters,
} from '@/types/payment';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

class PaymentService {
  private getAuthToken(): string {
    return localStorage.getItem('admin_token') || '';
  }

  private async makeRequest<T>(url: string): Promise<T> {
    const token = this.getAuthToken();

    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Lấy metrics tổng quan về payment
   */
  async getPaymentMetrics(): Promise<PaymentMetrics> {
    return this.makeRequest<PaymentMetrics>('/api/admin/payments/metrics');
  }

  /**
   * Lấy danh sách giao dịch với phân trang và lọc
   */
  async getTransactions(filters: TransactionFilters = {}): Promise<TransactionListResponse> {
    const params = new URLSearchParams();

    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.size !== undefined) params.append('size', filters.size.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.method) params.append('method', filters.method);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);

    const queryString = params.toString();
    const url = `/api/admin/payments/transactions${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<TransactionListResponse>(url);
  }

  /**
   * Lấy chi tiết giao dịch theo ID
   */
  async getTransactionDetail(id: number): Promise<Transaction> {
    return this.makeRequest<Transaction>(`/api/admin/payments/transactions/${id}`);
  }

  /**
   * Format currency cho hiển thị
   */
  formatCurrency(amount: number): string {
    let value = '';

    if (amount >= 1_000_000_000) {
      value = (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (amount >= 1_000_000) {
      value = (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (amount >= 1_000) {
      value = (amount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      value = amount.toString();
    }

    return value;
  }

  /**
   * Format date time cho hiển thị
   */
  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get status badge color
   */
  getStatusBadgeColor(status: string): 'success' | 'warning' | 'error' | 'info' {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'info';
    }
  }

  /**
   * Get status label in Vietnamese
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed':
        return 'Thành công';
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  }
}

export const paymentService = new PaymentService();
