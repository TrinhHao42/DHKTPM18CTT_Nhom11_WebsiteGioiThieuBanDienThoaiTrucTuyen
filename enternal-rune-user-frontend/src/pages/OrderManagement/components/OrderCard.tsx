import React, { useState } from 'react'
import { Order } from '@/types/Order'
import { PaymentStatus } from '@/types/enums/PaymentStatus'
import { ShippingStatus } from '@/types/enums/ShippingStatus'
import { 
    Package, 
    MapPin, 
    Calendar, 
    CreditCard, 
    Truck,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    RotateCcw,
    ChevronDown,
    ChevronUp
} from 'lucide-react'

interface OrderCardProps {
    order: Order
}

const OrderCard = ({ order }: OrderCardProps) => {
    const [expanded, setExpanded] = useState(false)

    // Payment Status Badge
    const getPaymentStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PENDING:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3.5 h-3.5" />
                        Chờ thanh toán
                    </span>
                )
            case PaymentStatus.PAID:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Đã thanh toán
                    </span>
                )
            case PaymentStatus.FAILED:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3.5 h-3.5" />
                        Thanh toán thất bại
                    </span>
                )
            case PaymentStatus.REFUNDED:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Đã hoàn tiền
                    </span>
                )
            case PaymentStatus.EXPIRED:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Đã hết hạn
                    </span>
                )
            default:
                return null
        }
    }

    // Shipping Status Badge
    const getShippingStatusBadge = (status: ShippingStatus) => {
        const statusMap: Record<ShippingStatus, { label: string; color: string }> = {
            [ShippingStatus.PENDING]: { label: 'Chờ xử lý', color: 'bg-gray-100 text-gray-800' },
            [ShippingStatus.PROCESSING]: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
            [ShippingStatus.SHIPPED]: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800' },
            [ShippingStatus.IN_TRANSIT]: { label: 'Đang vận chuyển', color: 'bg-cyan-100 text-cyan-800' },
            [ShippingStatus.DELIVERED]: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
            [ShippingStatus.FAILED_DELIVERY]: { label: 'Giao thất bại', color: 'bg-red-100 text-red-800' },
            [ShippingStatus.CANCELLED]: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
            [ShippingStatus.RETURNED]: { label: 'Đã trả hàng', color: 'bg-orange-100 text-orange-800' },
        }

        const statusInfo = statusMap[status]
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                <Truck className="w-3.5 h-3.5" />
                {statusInfo.label}
            </span>
        )
    }

    // Action Button based on Payment Status
    const getActionButton = (paymentStatus: PaymentStatus) => {
        switch (paymentStatus) {
            case PaymentStatus.PENDING:
                return (
                    <button 
                        onClick={() => handlePayment()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 active:scale-95 transition-all duration-150"
                    >
                        Thanh toán ngay
                    </button>
                )
            case PaymentStatus.PAID:
                return (
                    <button 
                        onClick={() => handleReturn()}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium text-sm hover:bg-orange-700 active:scale-95 transition-all duration-150"
                    >
                        Yêu cầu trả hàng
                    </button>
                )
            case PaymentStatus.FAILED:
                return (
                    <button 
                        onClick={() => handleRetry()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 active:scale-95 transition-all duration-150"
                    >
                        Thử lại
                    </button>
                )
            case PaymentStatus.REFUNDED:
                return (
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-medium">Đã hoàn tiền</span>
                    </div>
                )
            case PaymentStatus.EXPIRED:
                return (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Đơn hàng đã hủy</span>
                    </div>
                )
            default:
                return null
        }
    }

    const handlePayment = () => {
        console.log('Navigate to payment page for order')
        // TODO: Navigate to payment page
        alert('Chuyển đến trang thanh toán')
    }

    const handleReturn = () => {
        console.log('Request return for order')
        // TODO: Open return request dialog
        alert('Gửi yêu cầu trả hàng')
    }

    const handleRetry = () => {
        console.log('Retry payment for order')
        // TODO: Navigate to payment retry page
        alert('Thử thanh toán lại')
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Mã đơn hàng</p>
                            <p className="font-semibold text-gray-900">#ORD{order.orderDate.getTime().toString().slice(-8)}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {getPaymentStatusBadge(order.orderPaymentStatus)}
                        {getShippingStatusBadge(order.orderShippingStatus)}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Order Date */}
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Ngày đặt hàng</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(order.orderDate)}</p>
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-start gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Tổng tiền</p>
                            <p className="text-sm font-bold text-blue-600">
                                {order.orderTotalPrice.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">Địa chỉ giao hàng</p>
                        <p className="text-sm text-gray-900">
                            {order.orderShippingAddress.streetName}, {order.orderShippingAddress.wardName}, {order.orderShippingAddress.cityName}, {order.orderShippingAddress.countryName}
                        </p>
                    </div>
                </div>

                {/* Expand Details */}
                {order.orderListDetails.length > 0 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
                    >
                        {expanded ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                Thu gọn chi tiết
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Xem chi tiết ({order.orderListDetails.length} sản phẩm)
                            </>
                        )}
                    </button>
                )}

                {/* Order Details (Expanded) */}
                {expanded && order.orderListDetails.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                        {order.orderListDetails.map((detail, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{detail.odProduct.prodName}</p>
                                    <p className="text-xs text-gray-500">Số lượng: {detail.odQuantity}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {detail.odTotalPrice.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                    <button
                        onClick={() => alert('Xem chi tiết đơn hàng')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 active:scale-95 transition-all duration-150"
                    >
                        Chi tiết đơn hàng
                    </button>
                    {getActionButton(order.orderPaymentStatus)}
                </div>
            </div>
        </div>
    )
}

export default OrderCard
