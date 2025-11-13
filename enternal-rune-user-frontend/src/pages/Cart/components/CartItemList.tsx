import React, { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, Trash2, Loader2 } from 'lucide-react'
import { CartItem } from '@/types/CartItem'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/hooks/useToast'

interface CartItemListProps {
    item: CartItem;
    isSelected: boolean;
    onToggle: (item: CartItem) => void;
}

const CartItemList = ({ item, isSelected, onToggle }: CartItemListProps) => {
    const { removeCartItem, updateCartItemQuantity } = useCart();
    const toast = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleIncrease = async () => {
        setIsUpdating(true);
        try {
            await updateCartItemQuantity(item.cartItemId, item.quantity + 1);
        } catch (error) {
            toast.error('Không thể cập nhật số lượng');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDecrease = async () => {
        if (item.quantity > 1) {
            setIsUpdating(true);
            try {
                await updateCartItemQuantity(item.cartItemId, item.quantity - 1);
            } catch (error) {
                toast.error('Không thể cập nhật số lượng');
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        try {
            await removeCartItem(item.cartItemId);
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
            toast.error('Không thể xóa sản phẩm');
            setIsRemoving(false);
        }
    };

    return (
        <div
            className={`relative flex items-start gap-4 p-4 border-b last:border-b-0 transition-all duration-150 ${
                isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
            } ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {/* Blue left border when selected */}
            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
            )}

            {/* Image */}
            <Image
                alt={item.productVariant.variantName}
                src={item.productVariant.imageUrl || '/placeholder.png'}
                width={100}
                height={100}
                className="rounded-md object-cover border border-gray-200 w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0"
            />

            {/* Top Section - Title and Checkbox */}
            <div className="flex-1 items-start mb-3">

                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 line-clamp-2">
                    {item.productVariant.variantName}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 mb-2">
                    Còn hàng
                </p>

                {/* Features */}
                <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
                        <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                        </svg>
                        Đổi trả miễn phí 30 ngày
                    </span>
                    <br />
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
                        <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                        </svg>
                        Miễn phí vận chuyển
                    </span>
                </div>
            </div>

            {/* Bottom Section - Quantity, Price, Actions */}
            <div className="flex flex-col items-end gap-3 mt-2">
                {/* Checkbox */}
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(item)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer flex-shrink-0"
                />

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-2.5 py-1.5 self-end">
                    <button 
                        className="p-0.5 hover:text-blue-500 rounded transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDecrease}
                        disabled={isUpdating || item.quantity <= 1}
                    >
                        {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Minus className="w-3.5 h-3.5 text-gray-600" />}
                    </button>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 min-w-[20px] text-center">
                        {item.quantity}
                    </span>
                    <button
                        className="p-0.5 hover:text-blue-500 rounded transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleIncrease}
                        disabled={isUpdating}
                    >
                        <Plus className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center gap-3 self-end">
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                        {item.productVariant.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}
                    </p>
                    <button
                        className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-150 active:scale-95 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleRemove}
                        disabled={isRemoving}
                    >
                        {isRemoving ? (
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CartItemList
