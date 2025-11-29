import React from 'react'
import { Order } from '@/types/Order'
import { X, AlertTriangle, Package, Calendar, CreditCard } from 'lucide-react'

interface CancelOrderModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    order: Order
    isProcessing: boolean
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    order,
    isProcessing
}) => {
    if (!isOpen) return null

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (amount: number) => {
        return amount?.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Xác nhận hủy đơn hàng
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="p-1 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Warning Message */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p className="text-sm text-orange-800">
                            <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Đơn hàng của bạn sẽ bị hủy hoàn toàn.
                        </p>
                    </div>

                    {/* Order Information */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-sm">Thông tin đơn hàng</h4>
                        
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            {/* Order ID */}
                            <div className="flex items-start gap-3">
                                <Package className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">Mã đơn hàng</p>
                                    <p className="text-sm font-semibold text-gray-900">#ORD{order.orderId}</p>
                                </div>
                            </div>

                            {/* Order Date */}
                            <div className="flex items-start gap-3">
                                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">Ngày đặt hàng</p>
                                    <p className="text-sm font-medium text-gray-900">{order.orderDate}</p>
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">Tổng tiền</p>
                                    <p className="text-sm font-bold text-blue-600">{formatCurrency(order.orderTotalAmount)}</p>
                                </div>
                            </div>

                            {/* Product Count */}
                            <div className="flex items-start gap-3">
                                <Package className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">Số sản phẩm</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {order.orderDetails?.length || 0} sản phẩm
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Question */}
                    <div className="pt-2">
                        <p className="text-sm text-gray-700 text-center">
                            Bạn có chắc chắn muốn hủy đơn hàng này không?
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30"
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Xác nhận hủy'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CancelOrderModal
