import { CartItem } from '@/types/CartItem'
import React, { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCheckout } from '@/context/CheckoutContext'

const CartSummary = React.memo(({ choosedItems }: { choosedItems: CartItem[] }) => {
    const router = useRouter();
    const { setCheckoutItems } = useCheckout();

    const handleCheckout = useCallback(() => {
        if (choosedItems.length > 0) {
            setCheckoutItems(choosedItems);
            router.push('/PaymentScreen');
        }
    }, [choosedItems, setCheckoutItems, router]);

    const totalPrice = useMemo(() => 
        choosedItems.reduce((total, item) =>
            total + (item.productVariantResponse.price * item.quantity), 0
        ), [choosedItems]
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:sticky lg:top-6">
            
            {/* Coupon Code */}
            <div className="mb-4">
                <label className="block text-xs text-gray-600 mb-1.5">
                    Nhập mã giảm giá
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 active:scale-95 transition-all duration-150 whitespace-nowrap">
                        Áp dụng
                    </button>
                </div>
            </div>

            {/* View Available Offer */}
            <button className="w-full flex items-center justify-between px-3 py-2 mb-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <span className="text-xs font-medium text-blue-600">Xem ưu đãi có sẵn</span>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Items Count */}
            <div className="flex items-center justify-between py-2 text-xs">
                <span className="text-gray-600">Sản phẩm ({choosedItems.length})</span>
                <span className="font-semibold text-gray-900">
                    {totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                </span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between py-2 text-xs">
                <span className="text-gray-600">Vận chuyển cho ?</span>
                <span className="font-semibold text-green-600">
                    {(0).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                </span>
            </div>

            {/* Sub Total */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-base font-bold text-gray-900">Tổng cộng :</span>
                <span className="text-lg font-bold text-gray-900">
                    {totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                </span>
            </div>

            {/* Checkout Buttons */}
            <button
                disabled={choosedItems.length === 0}
                className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 mb-3"
                onClick={handleCheckout}
            >
                Thanh toán
            </button>
        </div>
    )
});

CartSummary.displayName = 'CartSummary';

export default CartSummary
