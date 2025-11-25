import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Order } from '@/types/Order'
import { PaymentStatus } from '@/types/enums/PaymentStatus'
import { ShippingStatus } from '@/types/enums/ShippingStatus'
import { cancelOrder, createRefundRequest } from '@/services/checkoutService'
import { useAuth } from '@/context/AuthContext'
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
import { useToast } from '@/hooks/useToast'
import CancelOrderModal from './CancelOrderModal'
import RefundRequestModal from './RefundRequestModal'
import ReturnRequestModal from './ReturnRequestModal'

interface OrderCardProps {
    order: Order
    router: any
}

const OrderCard = ({ order, router }: OrderCardProps) => {
    const [expanded, setExpanded] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const { user } = useAuth()
    const toast = useToast()
    
    // Modal states
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showRefundModal, setShowRefundModal] = useState(false)
    const [showReturnModal, setShowReturnModal] = useState(false)

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

    // Action Buttons
    const getActionButton = (paymentStatus: PaymentStatus) => {
        const buttonClass =
            "w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 active:scale-95"

        switch (paymentStatus) {
            case PaymentStatus.PENDING:
                return (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-end">
                        <button
                            onClick={() => handlePayment()}
                            disabled={isProcessing}
                            className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Thanh toán ngay
                        </button>
                        <button
                            onClick={() => handleReturn()}
                            disabled={isProcessing}
                            className={`${buttonClass} bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isProcessing ? 'Đang xử lý...' : 'Yêu cầu hủy đơn'}
                        </button>
                    </div>
                )
            case PaymentStatus.PAID:
                return (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-end">
                        <button
                            onClick={() => setShowRefundModal(true)}
                            disabled={isProcessing}
                            className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isProcessing ? 'Đang xử lý...' : 'Yêu cầu hoàn tiền'}
                        </button>
                        <button
                            onClick={() => setShowReturnModal(true)}
                            disabled={isProcessing}
                            className={`${buttonClass} bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isProcessing ? 'Đang xử lý...' : 'Yêu cầu trả hàng'}
                        </button>
                    </div>
                )
            case PaymentStatus.FAILED:
                return (
                    <button
                        onClick={() => handleRetry()}
                        className={`${buttonClass} bg-red-600 text-white hover:bg-red-700`}
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
        const orderData = {
            orderId: order.orderId,
            orderDate: order.orderDate,
            totalAmount: order.orderTotalAmount,
            paymentStatus: order.orderPaymentStatus,
            shippingStatus: order.orderShippingStatus
        }
        const encodedOrder = encodeURIComponent(JSON.stringify(orderData))
        router.push(`/PaymentScreen?orderId=${order.orderId}&fromOrder=true&orderData=${encodedOrder}`)
    }

    const handleReturn = async () => {
        if (!user?.userId) {
            toast.error('Vui lòng đăng nhập để thực hiện thao tác này')
            return
        }

        // Xác định loại action dựa vào payment status
        if (order.orderPaymentStatus === PaymentStatus.PENDING) {
            // Hủy đơn chưa thanh toán - mở cancel modal
            setShowCancelModal(true)
        } else if (order.orderPaymentStatus === PaymentStatus.PAID) {
            // Đơn đã thanh toán - hiển thị tuỳ chọn hoàn tiền hay trả hàng
            // Tạm thời mở refund modal, có thể thêm logic chọn sau
            setShowRefundModal(true)
        }
    }

    const handleCancelOrder = async () => {
        if (!user?.userId) return

        try {
            setIsProcessing(true)
            await cancelOrder(order.orderId, user.userId)
            toast.success('Đã gửi yêu cầu hủy đơn hàng!')
            
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (error: any) {
            toast.error(error.message || 'Không thể hủy đơn hàng')
            console.error('Error:', error)
        } finally {
            setIsProcessing(false)
            setShowCancelModal(false)
        }
    }

    const handleRefundRequest = async (reason: string) => {
        if (!user?.userId) return

        try {
            setIsProcessing(true)
            await createRefundRequest(order.orderId, user.userId, reason, 'CANCEL')
            toast.success('Đã gửi yêu cầu hoàn tiền!')
            
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (error: any) {
            toast.error(error.message || 'Không thể tạo yêu cầu hoàn tiền')
            console.error('Error:', error)
        } finally {
            setIsProcessing(false)
            setShowRefundModal(false)
        }
    }

    const handleReturnRequest = async (reason: string, images: File[]) => {
        if (!user?.userId) return

        try {
            setIsProcessing(true)
            
            // TODO: Implement upload images first, then create return request
            // For now, just create return request with reason
            await createRefundRequest(order.orderId, user.userId, reason, 'RETURN')
            toast.success('Đã gửi yêu cầu trả hàng!')
            
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (error: any) {
            toast.error(error.message || 'Không thể tạo yêu cầu trả hàng')
            console.error('Error:', error)
        } finally {
            setIsProcessing(false)
            setShowReturnModal(false)
        }
    }

    const handleRetry = () => {
        handlePayment()
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
        <>
            {order && (
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
                                    <p className="font-semibold text-gray-900">#ORD{order.orderId}</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                                        {order.orderTotalAmount?.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end">
                                {getActionButton(order.orderPaymentStatus)}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="flex items-start gap-3 mb-4">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-0.5">Địa chỉ giao hàng</p>
                                <p className="text-sm text-gray-900">
                                    {order.orderShippingAddress?.streetName}, {order.orderShippingAddress?.wardName}, {order.orderShippingAddress?.cityName}, {order.orderShippingAddress?.countryName}
                                </p>
                            </div>
                        </div>

                        {/* Expand Details */}
                        {order.orderDetails && order.orderDetails.length > 0 && (
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
                                        Xem chi tiết ({order.orderDetails.length} sản phẩm)
                                    </>
                                )}
                            </button>
                        )}

                        {/* Order Details (Expanded) */}
                        {expanded && order.orderDetails && order.orderDetails.length > 0 && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                                {order.orderDetails.map((detail, index) => (
                                    <div key={index} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                                        {detail.productVariant?.imageUrl && (
                                            <img
                                                src={detail.productVariant.imageUrl}
                                                alt={detail.productVariant.variantName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{detail.productVariant?.variantName || detail.productVariant?.productName}</p>
                                            <p className="text-xs text-gray-500">
                                                {detail.productVariant?.variantColor && `Màu: ${detail.productVariant.variantColor}`}
                                                {detail.productVariant?.variantModel && ` | ${detail.productVariant.variantModel}`}
                                            </p>
                                            <p className="text-xs text-gray-500">Số lượng: {detail.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {detail.totalPrice?.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {detail.price?.toLocaleString('vi-VN')} x {detail.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            <CancelOrderModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
                order={order}
                isProcessing={isProcessing}
            />

            <RefundRequestModal
                isOpen={showRefundModal}
                onClose={() => setShowRefundModal(false)}
                onConfirm={handleRefundRequest}
                order={order}
                isProcessing={isProcessing}
            />

            <ReturnRequestModal
                isOpen={showReturnModal}
                onClose={() => setShowReturnModal(false)}
                onConfirm={handleReturnRequest}
                order={order}
                isProcessing={isProcessing}
            />
        </>
    )
}

export default OrderCard
