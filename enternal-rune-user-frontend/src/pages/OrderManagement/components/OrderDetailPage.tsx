'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/Order';
import { getOrderById } from '@/services/checkoutService';
import { PaymentStatus } from '@/types/enums/PaymentStatus';
import { ShippingStatus } from '@/types/enums/ShippingStatus';
import {
    Package,
    MapPin,
    Calendar,
    CreditCard,
    Truck,
    User,
    ArrowLeft,
    Loader2,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';

interface OrderDetailPageProps {
    orderId: number;
}

const OrderDetailPage = ({ orderId }: OrderDetailPageProps) => {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (err: any) {
            console.error('Error fetching order detail:', err);
            setError(err?.response?.data?.message || 'Không thể tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPaymentStatusBadge = (statusCode: string) => {
        const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
            'PAID': { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
            'PENDING': { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
            'FAILED': { label: 'Thất bại', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
            'CANCELLED': { label: 'Đã hủy', color: 'bg-gray-100 text-gray-800', icon: <XCircle className="w-4 h-4" /> },
            'REFUNDED': { label: 'Đã hoàn tiền', color: 'bg-purple-100 text-purple-800', icon: <CheckCircle className="w-4 h-4" /> },
        };
        const status = statusMap[statusCode] || { label: statusCode, color: 'bg-gray-100 text-gray-800', icon: null };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.icon}
                {status.label}
            </span>
        );
    };

    const getShippingStatusBadge = (statusCode: string) => {
        const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
            'PROCESSING': { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" /> },
            'SHIPPED': { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800', icon: <Truck className="w-4 h-4" /> },
            'DELIVERED': { label: 'Đã giao', color: 'bg-yellow-100 text-yellow-800', icon: <Truck className="w-4 h-4" /> },
            'RECEIVED': { label: 'Đã nhận hàng', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
            'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
            'RETURNED': { label: 'Đã trả hàng', color: 'bg-orange-100 text-orange-800', icon: <Package className="w-4 h-4" /> },
        };
        const status = statusMap[statusCode] || { label: statusCode, color: 'bg-gray-100 text-gray-800', icon: null };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.icon}
                {status.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
                    <p className="text-gray-600 mb-6">{error || 'Đơn hàng không tồn tại hoặc đã bị xóa'}</p>
                    <button
                        onClick={() => router.push('/OrderManagementScreen')}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/OrderManagementScreen')}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại danh sách đơn hàng
                </button>

                {/* Order Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Đơn hàng #ORD{order.orderId}</h1>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(order.orderDate)}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {getPaymentStatusBadge(order.currentPaymentStatus.statusCode)}
                            {getShippingStatusBadge(order.currentShippingStatus.statusCode)}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Order Items & Address */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                    <Package className="w-5 h-5 text-blue-600" />
                                    Sản phẩm ({order.orderDetails.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.orderDetails.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-6">
                                        <img
                                            src={item.productVariantResponse.imageUrl || '/images/placeholder.png'}
                                            alt={item.productVariantResponse.variantName}
                                            className="w-20 h-20 rounded-lg border border-gray-200 object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">
                                                {item.productVariantResponse.variantName}
                                            </h4>
                                            {item.productVariantResponse.color && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Màu sắc: {item.productVariantResponse.color}
                                                </p>
                                            )}
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Số lượng: {item.quantity}</span>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        {formatCurrency(item.totalPrice)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment Summary */}
                    <div className="space-y-6">
                        {/* Payment Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Thông tin thanh toán
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tạm tính</span>
                                    <span className="font-medium text-gray-900">
                                        {formatCurrency(order.orderTotalAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Phí vận chuyển</span>
                                    <span className="font-medium text-green-600">Miễn phí</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
                                        <span className="text-xl font-bold text-blue-600">
                                            {formatCurrency(order.orderTotalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Địa chỉ giao hàng
                    </h3>
                    {order.orderShippingAddress ? (
                        <div className="text-sm text-gray-600">
                            <p>{order.orderShippingAddress.streetName}</p>
                            <p>{order.orderShippingAddress.wardName}, {order.orderShippingAddress.cityName}</p>
                            <p>{order.orderShippingAddress.countryName}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Chưa có địa chỉ giao hàng</p>
                    )}
                </div>

                {/* History Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Payment Status History */}
                    {order.paymentStatusHistory && order.paymentStatusHistory.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Lịch sử thanh toán
                            </h3>
                            <div className="space-y-3">
                                {order.paymentStatusHistory.map((status, index) => (
                                    <div
                                        key={`payment-${status.statusId}-${index}`}
                                        className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                                    >
                                        <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-white ${status.statusCode === 'PAID' ? 'bg-green-500' :
                                                status.statusCode === 'PENDING' ? 'bg-yellow-500' :
                                                    status.statusCode === 'FAILED' ? 'bg-red-500' : 'bg-blue-500'
                                            }`} />
                                        <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{status.statusName}</p>
                                                <p className="text-xs text-gray-500 mt-1">{status.note}</p>
                                                {status.description && (
                                                    <p className="text-xs text-gray-400 mt-1">{status.description}</p>
                                                )}
                                            </div>
                                            {getPaymentStatusBadge(status.statusCode)}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatDate(status.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Shipping Status History */}
                    {order.shippingStatusHistory && order.shippingStatusHistory.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <Truck className="w-5 h-5 text-blue-600" />
                                Lịch sử giao hàng
                            </h3>
                            <div className="space-y-3">
                                {order.shippingStatusHistory.map((status, index) => (
                                    <div
                                        key={`shipping-${status.statusId}-${index}`}
                                        className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                                    >
                                        <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-white ${status.statusCode === 'DELIVERED' ? 'bg-green-500' :
                                                status.statusCode === 'SHIPPED' ? 'bg-blue-500' :
                                                    status.statusCode === 'PROCESSING' ? 'bg-yellow-500' :
                                                        status.statusCode === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-500'
                                            }`} />
                                        <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{status.statusName}</p>
                                                <p className="text-xs text-gray-500 mt-1">{status.note}</p>
                                                {status.description && (
                                                    <p className="text-xs text-gray-400 mt-1">{status.description}</p>
                                                )}
                                            </div>
                                            {getShippingStatusBadge(status.statusCode)}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatDate(status.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
