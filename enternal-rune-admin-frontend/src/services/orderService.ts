import axiosInstance from '@/lib/axiosInstance';

export interface OrderListItem {
  orderId: number;
  totalAmount: number;
  userName: string;
  userEmail: string;
  orderDate: string;
  currentPaymentStatus: {
    statusCode: string;
    statusName: string;
  };
  currentShippingStatus: {
    statusCode: string;
    statusName: string;
  };
  orderUser: {
    userId: number;
    name: string;
    email: string;
  };
  itemCount?: number;
}

export interface OrderDetail {
  orderId: number;
  orderDate: string;
  orderTotalAmount: number;
  currentPaymentStatus: {
    statusCode: string;
    statusName: string;
  };
  currentShippingStatus: {
    statusCode: string;
    statusName: string;
  };
  orderUser: {
    userId: number;
    name: string;
    email: string;
  };
  orderShippingAddress: {
    streetName: string;
    wardName: string;
    cityName: string;
    countryName: string;
  };
  orderDetails: Array<{
    quantity: number;
    totalPrice: number;
    productVariantResponse: {
      variantName: string;
      price: number;
      imageUrl: string;
      color?: string;
    };
  }>;
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

// Lấy danh sách orders với phân trang và filter
export const getAllOrders = async (
  page: number = 0,
  size: number = 10,
  keyword?: string,
  paymentStatus?: string,
  shippingStatus?: string
): Promise<PaginatedResponse<OrderListItem>> => {
  try {
    const params: any = { page, size };
    if (keyword) params.keyword = keyword;
    if (paymentStatus && paymentStatus !== 'all') params.paymentStatus = paymentStatus;
    if (shippingStatus && shippingStatus !== 'all') params.shippingStatus = shippingStatus;

    const response = await axiosInstance.get('/orders/admin/all', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Lấy chi tiết order
export const getOrderDetail = async (orderId: number): Promise<OrderDetail> => {
  try {
    const response = await axiosInstance.get(`/orders/admin/${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching order detail:', error);
    throw error;
  }
};
