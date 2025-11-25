import React, { useState } from 'react'
import { Order } from '@/types/Order'
import { X, RotateCcw, Package, Calendar, CreditCard, AlertCircle } from 'lucide-react'

interface RefundRequestModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
    order: Order
    isProcessing: boolean
}

const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    order,
    isProcessing
}) => {
    const [reason, setReason] = useState('')
    const [error, setError] = useState('')

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

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError('Vui lòng nhập lý do hoàn tiền')
            return
        }
        if (reason.trim().length < 10) {
            setError('Lý do hoàn tiền phải có ít nhất 10 ký tự')
            return
        }
        setError('')
        onConfirm(reason.trim())
    }

    const handleClose = () => {
        setReason('')
        setError('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <RotateCcw className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Yêu cầu hoàn tiền
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isProcessing}
                        className="p-1 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Info Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Quy trình hoàn tiền</p>
                                <p className="text-xs">
                                    Yêu cầu của bạn sẽ được xử lý trong vòng 1-3 ngày làm việc. 
                                    Tiền sẽ được hoàn lại vào tài khoản thanh toán ban đầu.
                                </p>
                            </div>
                        </div>
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
                                    <p className="text-sm font-medium text-gray-900">{formatDate(order.orderDate)}</p>
                                </div>
                            </div>

                            {/* Total Amount */}
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500">Số tiền hoàn</p>
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

                    {/* Reason Input */}
                    <div className="space-y-2">
                        <label htmlFor="refund-reason" className="block text-sm font-semibold text-gray-900">
                            Lý do hoàn tiền <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="refund-reason"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value)
                                setError('')
                            }}
                            placeholder="Vui lòng mô tả chi tiết lý do bạn muốn hoàn tiền (ít nhất 10 ký tự)..."
                            rows={4}
                            className={`w-full px-4 py-3 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm`}
                            disabled={isProcessing}
                        />
                        {error && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            {reason.length}/500 ký tự
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing || !reason.trim()}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RefundRequestModal
