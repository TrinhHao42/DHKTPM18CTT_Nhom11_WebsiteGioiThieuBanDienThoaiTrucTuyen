'use client'
import React, { useState } from 'react'
import { Star, ShoppingCart, Shield, Truck, Clock, Plus, Minus } from 'lucide-react'
import { Product } from '@/types/Product'
import { formatPrice } from '@/lib/format'
import { colors } from '@/lib/color'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/hooks/useToast'
import { CommentsPageResponse } from '@/types/Comment'
import { Image } from '@/types/Image'
import { number } from 'yup'

// Type definition for umami analytics
declare global {
    interface Window {
        umami?: {
            track: (eventName: string, eventData: Record<string, unknown>) => void;
        }
    }
}

interface ProductInfoPanelProps {
    product: Product
    selectedColor?: string
    selectedImage?: Image
    onColorChange?: (color: string) => void
    commentData?: CommentsPageResponse
}

export default function ProductInfoPanel({ product, selectedColor, selectedImage, onColorChange, commentData }: ProductInfoPanelProps) {
    const { addCartItem } = useCart()
    const toast = useToast()
    const [quantity, setQuantity] = useState(1)
    const [isAdding, setIsAdding] = useState(false)
    const storageOptions = ['256GB', '512GB', '1TB']
    const [selectedStorage, setSelectedStorage] = useState(storageOptions[1])
    const protectionPlans = [
        { duration: '2 years', price: 129000 },
        { duration: '3 years', price: 199000 }
    ]
    const [selectedPlan, setSelectedPlan] = useState<string>('')
    const basePrice = product.productPrices?.[0]?.ppPrice || 0
    const storagePrice = selectedStorage === '256GB' ? -100 : selectedStorage === '1TB' ? 200 : 0
    const currentPrice = basePrice + storagePrice
    const currentPlanPrice = protectionPlans.find(p => p.duration === selectedPlan)?.price || 0
    // price per single unit (base + storage + selected plan)
    const unitPrice = currentPrice + currentPlanPrice
    // total price depends on quantity
    const totalPrice = unitPrice * quantity
    const originalPrice = basePrice * 1.15

    const handleQuantityChange = (change: number) => {
        setQuantity(prev => Math.max(1, Math.min(10, prev + change)))
    }

    const handleAddToCart = async () => {
        setIsAdding(true)
        try {
            await addCartItem(
                product,
                quantity,
                {
                    color: selectedColor,
                    storage: selectedStorage,
                    version: undefined,
                    imageId: Number(selectedImage?.imageId)
                }
            )
            
            // Track add to cart event
            if (typeof window !== 'undefined' && window.umami) {
                window.umami.track('add_to_cart', {
                    product_id: product.prodId,
                    product_name: product.prodName,
                    product_brand: product.prodBrand || 'Unknown',
                    product_price: unitPrice,
                    quantity: quantity,
                    selected_color: selectedColor,
                    selected_storage: selectedStorage,
                    selected_protection_plan: selectedPlan,
                    total_price: totalPrice,
                    currency: 'VND'
                })
            }
            
            toast.success(`✅ Đã thêm "${product.prodName}" vào giỏ hàng!`)
        } catch (error) {
            console.error('Failed to add to cart:', error)
            toast.error('❌ Không thể thêm vào giỏ hàng. Vui lòng thử lại.')
        } finally {
            setIsAdding(false)
        }
    }

    const features = [
        'Free Shipping',
        '30-day returns',
        'Arrives by Fri, Feb 20'
    ]

    // Helper function to get color hex from color name
    const getColorHex = (colorName: string): string => {
        const normalizedName = colorName.replace(/\s+/g, '_').toUpperCase()
        const colorEntry = Object.entries(colors).find(([key, value]) =>
            key === normalizedName || value.name === colorName
        )
        if (colorEntry) {
            return colorEntry[1].hex
        }
        const lowerColorName = colorName.toLowerCase()
        return lowerColorName;
    }

    const renderRating = () => {
        const averageRating = commentData?.averageRating || product.prodRating
        const totalRatings = commentData?.totalRatings || 0

        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 ${i <= Math.floor(averageRating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200 fill-gray-200'
                                }`}
                        />
                    ))}
                </div>
                <span className="text-md font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500">
                    ({totalRatings > 0 ? `${totalRatings.toLocaleString()} đánh giá` : 'Chưa có đánh giá'})
                </span>
            </div>
        )
    }
    const renderPrice = () => {
        return (
            <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {formatPrice(totalPrice)}
                </span>
                {originalPrice > unitPrice && (
                    <span className="text-xl text-gray-400 line-through">
                        {formatPrice(originalPrice * quantity)}
                    </span>
                )}
                {originalPrice > unitPrice && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Tiết kiệm {formatPrice((originalPrice - unitPrice) * quantity)}
                    </span>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-3">
                    {product.prodName}
                </h1>
                {renderRating()}
            </div>
            {renderPrice()}
            <div>
                <h3 className="text-md font-semibold text-gray-900 mb-3">Bộ nhớ</h3>
                <div className="flex gap-3">
                    {storageOptions.map((storage) => {
                        const storagePrice = storage === '256GB' ? basePrice - 100 : storage === '1TB' ? basePrice + 200 : basePrice
                        return (
                            <button
                                key={storage}
                                onClick={() => setSelectedStorage(storage)}
                                className={`px-6 py-4 rounded-xl border-2 transition-all duration-300 hover:scale-102 ${selectedStorage === storage
                                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                            >
                                <div className="text-center">
                                    <div className="font-semibold text-gray-900">{storage}</div>
                                    <div className="text-sm text-gray-600">{formatPrice(storagePrice)}</div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
            {/* Color Options */}
            <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Màu sắc</h3>
                <div className="flex gap-3 flex-wrap">
                    {product.prodColor.map((color) => {
                        const colorHex = getColorHex(color)
                        return (
                            <button
                                key={color}
                                onClick={() => { 
                                    onColorChange?.(color) 
                                }}
                                className={`relative w-16 h-16 rounded-2xl border-4 transition-all duration-300 hover:scale-105 ${selectedColor === color
                                    ? 'border-blue-500 shadow-lg scale-110'
                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                    }`}
                                style={{ backgroundColor: colorHex }}
                                title={color}
                            >
                                {selectedColor === color && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    Đã chọn: {selectedColor || product.prodColor[0]}
                </p>
            </div>
            {/* Quantity */}
            <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Số lượng</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-xl">
                        <button
                            onClick={() => handleQuantityChange(-1)}
                            className="p-3 hover:bg-gray-100 transition-colors rounded-l-xl disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-6 py-3 font-semibold">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(1)}
                            className="p-3 hover:bg-gray-100 transition-colors rounded-r-xl disabled:opacity-50"
                            disabled={quantity >= 10}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Stock Status */}
                    <div className="bg-green-50 border border-green-200 rounded-xl px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-800 font-semibold text-sm">
                                {product.productStatus === 'ACTIVE' ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protection Plans */}
            <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Thêm gói bảo hành</h3>
                <div className="flex gap-4 flex-wrap">
                    <label className="text-sm flex items-center gap-3 px-2 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="radio"
                            name="protection"
                            value=""
                            checked={selectedPlan === ''}
                            onChange={() => setSelectedPlan('')}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span>Không mua bảo hành</span>
                    </label>
                    {protectionPlans.map((plan) => (
                        <label
                            key={plan.duration}
                            className="text-sm flex flex-wrap items-center gap-3 px-2 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="protection"
                                    value={plan.duration}
                                    checked={selectedPlan === plan.duration}
                                    onChange={() => setSelectedPlan(plan.duration)}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span>{plan.duration}</span>
                            </div>
                            <span className="font-semibold">{formatPrice(plan.price)}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className='flex gap-4'>
                <button
                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold text-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-102"
                    onClick={() => {
                        // Track buy now event
                        if (typeof window !== 'undefined' && window.umami) {
                            window.umami.track('buy_now', {
                                product_id: product.prodId,
                                product_name: product.prodName,
                                product_brand: product.prodBrand || 'Unknown',
                                product_price: unitPrice,
                                quantity: quantity,
                                selected_color: selectedColor,
                                selected_storage: selectedStorage,
                                selected_protection_plan: selectedPlan,
                                total_price: totalPrice,
                                currency: 'VND'
                            })
                        }
                    }}
                >
                    Mua ngay - {formatPrice(totalPrice)}
                </button>
                <button
                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold text-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 group hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                >
                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>{isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}</span>
                </button>
            </div>
            {/* Features */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                        {feature.includes('Free Shipping') && <Truck className="w-5 h-5 text-green-600" />}
                        {feature.includes('returns') && <Shield className="w-5 h-5 text-blue-600" />}
                        {feature.includes('Arrives') && <Clock className="w-5 h-5 text-orange-600" />}
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}