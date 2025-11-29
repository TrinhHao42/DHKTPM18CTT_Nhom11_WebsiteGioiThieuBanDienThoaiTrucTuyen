import axiosInstance from '@/lib/axiosInstance';

export interface ReturnRequestItem {
  returnRequestId: number;
  orderId: number;
  userId: number;
  userName: string;
  userEmail: string;
  reason: string;
  imageUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
  processedBy?: number;
}

export interface ReturnRequestDetail extends ReturnRequestItem {
  orderSummary: {
    orderId: number;
    orderDate: string;
    totalAmount: number;
    paymentStatus: string;
    shippingStatus: string;
    items: Array<{
      productName: string;
      variantName: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface CancelRequestItem {
  cancelRequestId: number;
  orderId: number;
  userId: number;
  userName: string;
  userEmail: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
  processedBy?: number;
}

export interface CancelRequestDetail extends CancelRequestItem {
  orderSummary: {
    orderId: number;
    orderDate: string;
    totalAmount: number;
    paymentStatus: string;
    shippingStatus: string;
    items: Array<{
      productName: string;
      variantName: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============ RETURN REQUESTS ============

// Lấy danh sách return requests
export const getAllReturnRequests = async (
  page: number = 0,
  size: number = 10,
  status?: string
): Promise<PaginatedResponse<ReturnRequestItem>> => {
  try {
    const params: any = { page, size };
    if (status && status !== 'all') params.status = status;

    const response = await axiosInstance.get('/return-requests', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching return requests:', error);
    throw error;
  }
};

// Lấy chi tiết return request
export const getReturnRequestDetail = async (id: number): Promise<ReturnRequestDetail> => {
  try {
    const response = await axiosInstance.get(`/return-requests/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching return request detail:', error);
    throw error;
  }
};

// Xử lý return request (approve/reject)
export const processReturnRequest = async (
  id: number,
  action: 'APPROVE' | 'REJECT',
  adminNote?: string,
  adminId?: number
): Promise<any> => {
  try {
    const response = await axiosInstance.put(
      `/return-requests/${id}/process`,
      { action, adminNote },
      { params: { adminId: adminId || 1 } }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error processing return request:', error);
    throw error;
  }
};

// ============ CANCEL REQUESTS ============

// Lấy danh sách cancel requests
export const getAllCancelRequests = async (
  page: number = 0,
  size: number = 10,
  status?: string
): Promise<PaginatedResponse<CancelRequestItem>> => {
  try {
    const params: any = { page, size };
    if (status && status !== 'all') params.status = status;

    const response = await axiosInstance.get('/cancel-requests', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching cancel requests:', error);
    throw error;
  }
};

// Lấy chi tiết cancel request
export const getCancelRequestDetail = async (id: number): Promise<CancelRequestDetail> => {
  try {
    const response = await axiosInstance.get(`/cancel-requests/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching cancel request detail:', error);
    throw error;
  }
};

// Xử lý cancel request (approve/reject)
export const processCancelRequest = async (
  id: number,
  action: 'APPROVE' | 'REJECT',
  adminNote?: string,
  adminId?: number
): Promise<any> => {
  try {
    const response = await axiosInstance.put(
      `/cancel-requests/${id}/process`,
      { action, adminNote },
      { params: { adminId: adminId || 1 } }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error processing cancel request:', error);
    throw error;
  }
};
