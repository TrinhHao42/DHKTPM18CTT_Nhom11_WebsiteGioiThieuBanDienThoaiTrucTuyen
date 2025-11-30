'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Order } from '@/types/Order'
import { PaymentStatus } from '@/types/enums/PaymentStatus'
import { ShippingStatus } from '@/types/enums/ShippingStatus'
import { cancelOrder, createRefundRequest, createReturnRequest, createCancelRequest, uploadImage } from '@/services/checkoutService'
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
    
    const [showRefundModal, setShowRefundModal] = useState(false)
    const [showReturnModal, setShowReturnModal] = useState(false)

    const getShippingStatusBadge = (status?: ShippingStatus) => {
        const statusMap: Record<ShippingStatus, { label: string; color: string }> = {
            [ShippingStatus.PROCESSING]: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
            [ShippingStatus.SHIPPED]: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800' },
            [ShippingStatus.DELIVERED]: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
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

    const getActionButtons = (paymentStatus?: PaymentStatus, shippingStatus?: ShippingStatus) => {
        const buttonClass =
            "w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 active:scale-95"

        const buttons = []

        // Nút thanh toán khi chưa thanh toán (độc lập)
        if (paymentStatus === PaymentStatus.PENDING) {
            buttons.push(
                <button
                    key="payment"
                    onClick={() => handlePayment()}
                    disabled={isProcessing}
                    className={`${buttonClass} bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isProcessing ? 'Đang xử lý...' : 'Thanh toán ngay'}
                </button>
            )
        }

        // Nút hủy đơn khi đang xử lý (độc lập)
        if (shippingStatus === ShippingStatus.PROCESSING) {
            buttons.push(
                <button
                    key="cancel"
                    onClick={() => setShowRefundModal(true)}
                    disabled={isProcessing}
                    className={`${buttonClass} bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isProcessing ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                </button>
            )
        }

        // Nút trả hàng khi đã giao (độc lập)
        if (shippingStatus === ShippingStatus.DELIVERED) {
            buttons.push(
                <button
                    key="return"
                    onClick={() => setShowReturnModal(true)}
                    disabled={isProcessing}
                    className={`${buttonClass} bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isProcessing ? 'Đang xử lý...' : 'Trả hàng'}
                </button>
            )
        }

        return buttons.length > 0 ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto justify-end">
                {buttons}
            </div>
        ) : null
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
            setShowRefundModal(true)
        } else if (order.currentPaymentStatus.statusCode === PaymentStatus.PAID) {
            setShowRefundModal(true)
        }
    }

    const handleRefundRequest = async (reason: string) => {
        if (!user?.userId) return

        try {
            setIsProcessing(true)
            
            // Kiểm tra xem đơn hàng đã thanh toán chưa
            const isPaid = order.currentPaymentStatus.statusCode === PaymentStatus.PAID

            if (isPaid) {
                // Nếu đã thanh toán, tạo cancel request
                await createCancelRequest(order.orderId, user.userId, reason)
                toast.success('Đã gửi yêu cầu hủy đơn hàng đến admin!')
            } else {
                // Nếu chưa thanh toán, hủy trực tiếp
                await cancelOrder(order.orderId, user.userId)
                toast.success('Đơn hàng chưa thanh toán đã được hủy!')
            }
            
            setTimeout(() => window.location.reload(), 1500)
        } catch (error: any) {
            toast.error(error.message || 'Không thể thực hiện yêu cầu')
        } finally {
            setIsProcessing(false)
            setShowRefundModal(false)
        }
    }

    const handleReturnRequest = async (reason: string, images: File[]) => {
        if (!user?.userId) return

        try {
            setIsProcessing(true)
            
            // Upload ảnh đầu tiên (nếu có nhiều ảnh, chỉ lấy ảnh đầu tiên)
            let imageUrl = ''
            if (images.length > 0) {
                try {
                    imageUrl = await uploadImage(images[0])
                } catch (uploadError) {
                    // Nếu upload thất bại, vẫn tiếp tục gửi request nhưng không có ảnh
                    console.warn('Upload ảnh thất bại, tiếp tục gửi request không có ảnh')
                }
            }
            
            await createReturnRequest(order.orderId, user.userId, reason, imageUrl)
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
                                {getActionButtons(order.currentPaymentStatus.statusCode as PaymentStatus, order.currentShippingStatus.statusCode as ShippingStatus)}
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
