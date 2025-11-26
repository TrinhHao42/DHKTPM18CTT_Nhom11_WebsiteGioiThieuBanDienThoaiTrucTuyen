'use client'
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
import { createSepayCheckout } from '@/configs/SepayClient'

interface OrderCardProps {
    order: Order
    router: any
}

const OrderCard = ({ order, router }: OrderCardProps) => {
    const [expanded, setExpanded] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const { user } = useAuth()
    const toast = useToast()
    
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showRefundModal, setShowRefundModal] = useState(false)
    const [showReturnModal, setShowReturnModal] = useState(false)

    const getPaymentStatusBadge = (status?: PaymentStatus) => {
        if (!status) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Không xác định
                </span>
            )
        }

        const statusMap: Record<PaymentStatus, { label: string; color: string; icon: React.ReactNode }> = {
            [PaymentStatus.PENDING]: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3.5 h-3.5" /> },
            [PaymentStatus.PAID]: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3.5 h-3.5" /> },
            [PaymentStatus.FAILED]: { label: 'Thanh toán thất bại', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3.5 h-3.5" /> },
            [PaymentStatus.REFUNDED]: { label: 'Đã hoàn tiền', color: 'bg-purple-100 text-purple-800', icon: <RotateCcw className="w-3.5 h-3.5" /> },
            [PaymentStatus.EXPIRED]: { label: 'Đã hết hạn', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="w-3.5 h-3.5" /> }
        }

        const statusInfo = statusMap[status]
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.icon}
                {statusInfo.label}
            </span>
        )
    }

    const getShippingStatusBadge = (status?: ShippingStatus) => {
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

        const statusInfo = status ? statusMap[status] : { label: 'Không xác định', color: 'bg-gray-200 text-gray-800' }

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                <Truck className="w-3.5 h-3.5" />
                {statusInfo.label}
            </span>
        )
    }

    const getActionButton = (paymentStatus?: PaymentStatus) => {
        const buttonClass =
            "w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 active:scale-95"

        if (!paymentStatus) return null

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

    const handlePayment = async () => {
        try {
            setIsProcessing(true)
            
            // Transform order to CreateOrderResponse format
            const orderResponse = {
                success: true,
                message: 'Order retrieved successfully',
                orderId: order.orderId,
                orderDate: order.orderDate,
                totalAmount: order.orderTotalAmount,
                paymentStatus: order.currentPaymentStatus.statusCode,
                shippingStatus: order.currentShippingStatus.statusCode
            }

            // Call SePay API through server-side route
            const { checkoutFormfields, checkoutURL } = await createSepayCheckout(orderResponse)

            // Create and submit form to SePay in new tab
            const form = document.createElement("form")
            form.method = "POST"
            form.action = checkoutURL
            form.target = "_blank"

            Object.entries(checkoutFormfields).forEach(([key, value]) => {
                const input = document.createElement("input")
                input.type = "hidden"
                input.name = key
                input.value = value as string
                form.appendChild(input)
            })

            document.body.appendChild(form)
            form.submit()
            document.body.removeChild(form)

            // Redirect to Payment page (step 2) with order data
            const orderData = {
                orderId: order.orderId,
                orderDate: order.orderDate,
                totalAmount: order.orderTotalAmount,
                paymentStatus: order.currentPaymentStatus.statusCode,
                shippingStatus: order.currentShippingStatus.statusCode
            }
            const encodedOrder = encodeURIComponent(JSON.stringify(orderData))
            router.push(`/PaymentScreen?orderId=${order.orderId}&fromOrder=true&orderData=${encodedOrder}`)

        } catch (error: any) {
            console.error('❌ Lỗi khi tạo SePay checkout:', error)
            toast.error('Không thể tạo liên kết thanh toán. Vui lòng thử lại!')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReturn = async () => {
        if (!user?.userId) {
            toast.error('Vui lòng đăng nhập để thực hiện thao tác này')
            return
        }

        if (order.currentPaymentStatus.statusCode === PaymentStatus.PENDING) {
            setShowCancelModal(true)
        } else if (order.currentPaymentStatus.statusCode === PaymentStatus.PAID) {
            setShowRefundModal(true)
        }
    }

    const handleCancelOrder = async () => {
        if (!user?.userId) return

        try {
            setIsProcessing(true)
            await cancelOrder(order.orderId, user.userId)
            toast.success('Đã gửi yêu cầu hủy đơn hàng!')
            setTimeout(() => window.location.reload(), 1500)
        } catch (error: any) {
            toast.error(error.message || 'Không thể hủy đơn hàng')
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
            setTimeout(() => window.location.reload(), 1500)
        } catch (error: any) {
            toast.error(error.message || 'Không thể tạo yêu cầu hoàn tiền')
        } finally {
            setIsProcessing(false)
            setShowRefundModal(false)
        }
    }

    const handleReturnRequest = async (reason: string, images: File[]) => {
        if (!user?.userId) return

        try {
            setIsProcessing(true)
            await createRefundRequest(order.orderId, user.userId, reason, 'RETURN')
            toast.success('Đã gửi yêu cầu trả hàng!')
            setTimeout(() => window.location.reload(), 1500)
        } catch (error: any) {
            toast.error(error.message || 'Không thể tạo yêu cầu trả hàng')
        } finally {
            setIsProcessing(false)
            setShowReturnModal(false)
        }
    }

    const handleRetry = () => {
        handlePayment()
    }

    const formatDate = (date: Date | string) => {
        const d = new Date(date)
        return d.toLocaleDateString('vi-VN', {
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
                                {getPaymentStatusBadge(order.currentPaymentStatus.statusCode as PaymentStatus)}
                                {getShippingStatusBadge(order.currentShippingStatus.statusCode as ShippingStatus)}
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
                                        {order.orderTotalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end">
                                {getActionButton(order.currentPaymentStatus.statusCode as PaymentStatus)}
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
                                        {detail.productVariantResponse?.imageUrl && (
                                            <img
                                                src={detail.productVariantResponse.imageUrl}
                                                alt={detail.productVariantResponse.variantName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{detail.productVariantResponse?.variantName || detail.productVariantResponse?.variantName}</p>
                                            <p className="text-xs text-gray-500">
                                                {detail.productVariantResponse?.color && `Màu: ${detail.productVariantResponse.color}`}
                                            </p>
                                            <p className="text-xs text-gray-500">Số lượng: {detail.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {detail.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {detail.productVariantResponse?.price?.toLocaleString('vi-VN')} x {detail.quantity}
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
