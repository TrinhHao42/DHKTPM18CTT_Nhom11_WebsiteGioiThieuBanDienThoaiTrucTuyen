import React, { useState } from 'react';
import { cancelOrder, createRefundRequest } from '@/services/checkoutService';

interface OrderActionDialogProps {
    orderId: number;
    userId: number;
    orderStatus: string;
    paymentStatus: string;
    onSuccess: () => void;
    onClose: () => void;
}

export default function OrderActionDialog({
    orderId,
    userId,
    orderStatus,
    paymentStatus,
    onSuccess,
    onClose
}: OrderActionDialogProps) {
    const [actionType, setActionType] = useState<'cancel' | 'refund' | null>(null);
    const [refundType, setRefundType] = useState<'CANCEL' | 'RETURN'>('RETURN');
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const canCancel = orderStatus === 'PROCESSING' && paymentStatus !== 'PAID';
    const canRefund = paymentStatus === 'PAID';

    const handleCancel = async () => {
        if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
            return;
        }

        try {
            setIsLoading(true);
            await cancelOrder(orderId, userId);
            alert('Hủy đơn hàng thành công!');
            onSuccess();
        } catch (error: any) {
            alert(error.message || 'Không thể hủy đơn hàng');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefundRequest = async () => {
        if (!reason.trim()) {
            alert('Vui lòng nhập lý do!');
            return;
        }

        try {
            setIsLoading(true);
            await createRefundRequest(orderId, userId, reason, refundType);
            alert('Tạo yêu cầu hoàn tiền thành công!');
            onSuccess();
        } catch (error: any) {
            alert(error.message || 'Không thể tạo yêu cầu hoàn tiền');
        } finally {
            setIsLoading(false);
        }
    };

    if (!actionType) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Chọn hành động</h3>
                    
                    <div className="space-y-3">
                        {canCancel && (
                            <button
                                onClick={() => setActionType('cancel')}
                                className="w-full px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition font-medium"
                            >
                                🚫 Hủy đơn hàng
                            </button>
                        )}
                        
                        {canRefund && (
                            <button
                                onClick={() => setActionType('refund')}
                                className="w-full px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
                            >
                                💰 Yêu cầu hoàn tiền / Trả hàng
                            </button>
                        )}

                        {!canCancel && !canRefund && (
                            <p className="text-gray-500 text-center py-4">
                                Không có hành động khả dụng cho đơn hàng này
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        );
    }

    if (actionType === 'cancel') {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận hủy đơn hàng</h3>
                    
                    <p className="text-gray-600 mb-6">
                        Bạn có chắc chắn muốn hủy đơn hàng #{orderId}? Hành động này không thể hoàn tác.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setActionType(null)}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận hủy'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Refund request form
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Yêu cầu hoàn tiền / Trả hàng</h3>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại yêu cầu
                        </label>
                        <select
                            value={refundType}
                            onChange={(e) => setRefundType(e.target.value as 'CANCEL' | 'RETURN')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="CANCEL">Hủy đơn (đã thanh toán)</option>
                            <option value="RETURN">Trả hàng</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lý do <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Nhập lý do muốn hoàn tiền / trả hàng..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setActionType(null)}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={handleRefundRequest}
                        disabled={isLoading || !reason.trim()}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                    </button>
                </div>
            </div>
        </div>
    );
}
