import AxiosInstance from "@/configs/AxiosInstance";
import { PaymentStatus } from "@/types/enums/PaymentStatus";

export interface CreateOrderRequest {
    userId: number;
    addressId: number;
    orderItems: {
        productVariantId: number;
        quantity: number;
    }[];
    discountId?: number | null;
}

export interface CreateOrderResponse {
    success: boolean;
    message: string;
    orderId: number;
    orderDate: string;
    totalAmount: number;
    paymentStatus: string;
    shippingStatus: string;
}

export const createOrder = async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
    try {
        const response = await AxiosInstance.post('/orders', request);
        return response.data;
    } catch (error: any) {
        console.error('❌ Lỗi tạo đơn hàng:', error);
        console.error('❌ Error response:', error.response?.data);
        console.error('❌ Error status:', error.response?.status);
        console.error('❌ Error message:', error.message);

        // Throw lại với message rõ ràng hơn
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.message === 'Network Error') {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Server mất quá nhiều thời gian để xử lý.');
        } else {
            throw error;
        }
    }
};

export const getOrderPaymentStatus = async (orderId: number): Promise<PaymentStatus> => {
    const response = await AxiosInstance.get(`/orders/status/${orderId}`);
    return response.data;
}

export const getUserOrders = async (userId: number, page: number = 0, size: number = 5): Promise<any> => {
    try {
        const response = await AxiosInstance.get(`/orders/user/${userId}`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
}

export const getOrderById = async (orderId: number): Promise<any> => {
    try {
        const response = await AxiosInstance.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
}

export const cancelOrder = async (orderId: number, userId: number): Promise<any> => {
    try {
        console.log('🚫 Hủy đơn hàng:', { orderId, userId });
        const response = await AxiosInstance.put(`/orders/${orderId}/cancel`, null, {
            params: { userId }
        });
        console.log('✅ Hủy đơn hàng thành công:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Lỗi hủy đơn hàng:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

export const createRefundRequest = async (
    orderId: number,
    userId: number,
    reason: string,
    refundType: 'CANCEL' | 'RETURN'
): Promise<any> => {
    try {
        console.log('💰 Tạo yêu cầu hoàn tiền:', { orderId, userId, reason, refundType });
        const response = await AxiosInstance.post(`/orders/${orderId}/refund`, null, {
            params: { userId, reason, refundType }
        });
        console.log('✅ Tạo yêu cầu hoàn tiền thành công:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Lỗi tạo yêu cầu hoàn tiền:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

// Tạo yêu cầu trả hàng
export const createReturnRequest = async (
    orderId: number,
    userId: number,
    reason: string,
    imageUrl?: string
): Promise<any> => {
    try {
        console.log('📦 Tạo yêu cầu trả hàng:', { orderId, userId, reason, imageUrl });
        const response = await AxiosInstance.post('/return-requests',
            {
                orderId,
                reason,
                imageUrl
            },
            {
                params: { userId }
            }
        );
        console.log('✅ Tạo yêu cầu trả hàng thành công:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Lỗi tạo yêu cầu trả hàng:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

// Tạo yêu cầu hủy đơn
export const createCancelRequest = async (
    orderId: number,
    userId: number,
    reason: string
): Promise<any> => {
    try {
        console.log('🚫 Tạo yêu cầu hủy đơn:', { orderId, userId, reason });
        const response = await AxiosInstance.post('/cancel-requests',
            {
                orderId,
                reason
            },
            {
                params: { userId }
            }
        );
        console.log('✅ Tạo yêu cầu hủy đơn thành công:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Lỗi tạo yêu cầu hủy đơn:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

// Upload ảnh
export const uploadImage = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        // Sử dụng API upload có sẵn hoặc tạo mới
        const response = await AxiosInstance.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.imageUrl || response.data.url;
    } catch (error: any) {
        console.error('❌ Lỗi upload ảnh:', error);
        throw new Error('Không thể tải ảnh lên. Vui lòng thử lại.');
    }
}

// Xác nhận đã nhận hàng
export const confirmReceivedOrder = async (orderId: number, userId: number): Promise<any> => {
    try {
        console.log('✅ Xác nhận nhận hàng:', { orderId, userId });
        const response = await AxiosInstance.put(`/orders/${orderId}/confirm-received`, null, {
            params: { userId }
        });
        console.log('✅ Xác nhận nhận hàng thành công:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('❌ Lỗi xác nhận nhận hàng:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
}

// Kiểm tra đơn hàng có pending request không
export const checkPendingRequest = async (orderId: number): Promise<{
    hasPendingCancelRequest: boolean;
    hasPendingReturnRequest: boolean;
}> => {
    try {
        const response = await AxiosInstance.get(`/orders/${orderId}/pending-requests`);
        return response.data;
    } catch (error: any) {
        console.error('❌ Lỗi kiểm tra pending request:', error);
        return { hasPendingCancelRequest: false, hasPendingReturnRequest: false };
    }
}

