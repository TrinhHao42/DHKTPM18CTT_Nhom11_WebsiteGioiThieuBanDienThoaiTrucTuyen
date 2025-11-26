import React, { useState, useRef } from 'react'
import { Order } from '@/types/Order'
import { X, PackageX, Package, Calendar, CreditCard, AlertCircle, Upload, Image as ImageIcon, Trash2 } from 'lucide-react'

interface ReturnRequestModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string, images: File[]) => void
    order: Order
    isProcessing: boolean
}

const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    order,
    isProcessing
}) => {
    const [reason, setReason] = useState('')
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        
        if (files.length + images.length > 5) {
            setError('Bạn chỉ có thể tải lên tối đa 5 ảnh')
            return
        }

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isImage = file.type.startsWith('image/')
            const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
            
            if (!isImage) {
                setError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, etc.)')
                return false
            }
            if (!isValidSize) {
                setError('Kích thước ảnh không được vượt quá 5MB')
                return false
            }
            return true
        })

        if (validFiles.length === 0) return

        setError('')
        setImages(prev => [...prev, ...validFiles])

        // Create preview URLs
        validFiles.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError('Vui lòng nhập lý do trả hàng')
            return
        }
        if (reason.trim().length < 10) {
            setError('Lý do trả hàng phải có ít nhất 10 ký tự')
            return
        }
        if (images.length === 0) {
            setError('Vui lòng tải lên ít nhất 1 ảnh minh chứng')
            return
        }
        setError('')
        onConfirm(reason.trim(), images)
    }

    const handleClose = () => {
        setReason('')
        setImages([])
        setImagePreviews([])
        setError('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <PackageX className="w-6 h-6 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Yêu cầu trả hàng
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
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-orange-800">
                                <p className="font-medium mb-1">Điều kiện trả hàng</p>
                                <ul className="text-xs space-y-1 list-disc list-inside">
                                    <li>Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng</li>
                                    <li>Còn đầy đủ hộp, phụ kiện, hóa đơn</li>
                                    <li>Trong thời gian 7 ngày kể từ khi nhận hàng</li>
                                    <li>Cần cung cấp hình ảnh minh chứng rõ ràng</li>
                                </ul>
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

                    {/* Reason Input */}
                    <div className="space-y-2">
                        <label htmlFor="return-reason" className="block text-sm font-semibold text-gray-900">
                            Lý do trả hàng <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="return-reason"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value)
                                setError('')
                            }}
                            placeholder="Vui lòng mô tả chi tiết lý do bạn muốn trả hàng (ít nhất 10 ký tự)..."
                            rows={4}
                            className={`w-full px-4 py-3 border ${error && !images.length ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none text-sm`}
                            disabled={isProcessing}
                        />
                        <p className="text-xs text-gray-500">
                            {reason.length}/500 ký tự
                        </p>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                            Hình ảnh minh chứng <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Tải lên tối đa 5 ảnh, mỗi ảnh không quá 5MB
                        </p>

                        {/* Upload Button */}
                        <div className="flex items-center gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={isProcessing || images.length >= 5}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isProcessing || images.length >= 5}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                <Upload className="w-4 h-4" />
                                Chọn ảnh
                            </button>
                            <span className="text-xs text-gray-500">
                                {images.length}/5 ảnh
                            </span>
                        </div>

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            disabled={isProcessing}
                                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                                            {(images[index].size / 1024).toFixed(0)} KB
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {imagePreviews.length === 0 && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Chưa có ảnh nào được chọn</p>
                            </div>
                        )}

                        {error && (
                            <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </p>
                        )}
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
                        disabled={isProcessing || !reason.trim() || images.length === 0}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-medium hover:from-orange-700 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/30"
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReturnRequestModal
