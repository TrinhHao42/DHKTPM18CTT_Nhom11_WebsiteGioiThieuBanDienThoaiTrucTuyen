import React from 'react'

interface OrderItem {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

interface OrderSummaryProps {
    items: OrderItem[];
}

const OrderSummary = ({ items }: OrderSummaryProps) => {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = 0;
    const total = subtotal;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-gray-700 mb-6">Tóm tắt đơn hàng</h2>

            {/* Balance amount */}
            <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-semibold text-gray-900">
                    {subtotal.toLocaleString("vi-VN")} ₫
                </span>
            </div>

            {/* Discount/Credit */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Giảm giá</span>
                <span className="font-semibold text-gray-900">
                    {discount.toLocaleString("vi-VN")} ₫
                </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-4 mb-4">
                <p className="text-base font-bold text-gray-900">Tổng cộng</p>
                <span className="text-2xl font-bold text-blue-600">
                    {total.toLocaleString("vi-VN")} ₫
                </span>
            </div>
        </div>
    )
}

export default OrderSummary
