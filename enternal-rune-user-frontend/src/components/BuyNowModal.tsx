'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCheckout } from '@/context/CheckoutContext'
import { useToast } from '@/hooks/useToast'
import { CartService } from '@/services/cartService'

interface BuyNowModalProps {
    isOpen: boolean
    onClose: () => void
    product: {
        variantId: number
        variantName: string
        price: number
        imageUrl?: string
        stock: number
    }
    // Additional info needed for API call
    productId?: number
    availableColors?: string[]
    availableStorages?: string[]
    availableImages?: Array<{ imageId: string; imageName: string; imageData: string }>
    defaultColor?: string
    defaultStorage?: string
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({ 
    isOpen, 
    onClose, 
    product, 
    productId, 
    availableColors = [],
    availableStorages = ['64GB', '128GB', '256GB', '512GB', '1TB'],
    availableImages = [],
    defaultColor,
    defaultStorage
}) => {
    const router = useRouter()
    const { user } = useAuth()
    const { setCheckoutItems } = useCheckout()
    const toast = useToast()
    const [quantity, setQuantity] = useState(1)
    const [selectedColor, setSelectedColor] = useState(defaultColor || availableColors[0] || '')
    const [selectedStorage, setSelectedStorage] = useState(defaultStorage || availableStorages[0] || '256GB')
    const [isProcessing, setIsProcessing] = useState(false)

    if (!isOpen) return null

    // Find image that matches selected color
    const getImageForColor = (color: string) => {
        if (!color || availableImages.length === 0) return product.imageUrl || '/placeholder.png'
        
        // Try to find image with matching color in name
        const matchingImage = availableImages.find(img => 
            img.imageName.toLowerCase().includes(color.toLowerCase())
        )
        
        return matchingImage?.imageData || availableImages[0]?.imageData || product.imageUrl || '/placeholder.png'
    }

    // Find imageId that matches selected color
    const getImageIdForColor = (color: string): number | undefined => {
        if (!color || availableImages.length === 0) return undefined
        
        const matchingImage = availableImages.find(img => 
            img.imageName.toLowerCase().includes(color.toLowerCase())
        )
        
        return matchingImage ? Number(matchingImage.imageId) : Number(availableImages[0]?.imageId)
    }

    const currentImage = getImageForColor(selectedColor)
    const currentImageId = getImageIdForColor(selectedColor)

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) {
            setQuantity(1)
        } else if (newQuantity > product.stock) {
            setQuantity(product.stock)
            toast.warning(`Chỉ còn ${product.stock} sản phẩm trong kho!`)
        } else {
            setQuantity(newQuantity)
        }
    }

    const handleBuyNow = async () => {
        if (!user) {
            toast.warning('Vui lòng đăng nhập để mua hàng!')
            router.push('/LoginScreen')
            return
        }

        if (!productId) {
            toast.error('Không tìm thấy thông tin sản phẩm!')
            return
        }

        try {
            setIsProcessing(true)
            
            // Tính imageId dựa trên màu được chọn HIỆN TẠI
            const selectedImageId = getImageIdForColor(selectedColor)
            
            console.log('🛒 Buy Now - Selected options:', {
                color: selectedColor,
                storage: selectedStorage,
                imageId: selectedImageId,
                availableImages: availableImages.map(img => ({ id: img.imageId, name: img.imageName }))
            })
            
            // Add to cart first (backend will create cart item with proper variantId)
            const cartResponse = await CartService.addToCart(
                user.userId,
                productId,
                quantity,
                { 
                    color: selectedColor, 
                    storage: selectedStorage,
                    imageId: selectedImageId
                }
            )

            // Get the newly added item(s) from cart
            if (cartResponse.cartItems && cartResponse.cartItems.length > 0) {
                // Find items that match our product (could be last item or match by product)
                const matchingItems = cartResponse.cartItems.filter(item => 
                    item.productVariantResponse.productId === productId ||
                    item.productVariantResponse.color === selectedColor
                ).slice(-1) // Get the last matching item (most recently added)
                
                if (matchingItems.length > 0) {
                    // Set checkout items and redirect to payment
                    setCheckoutItems(matchingItems)
                    toast.success('Đang chuyển đến trang thanh toán...')
                    router.push('/PaymentScreen')
                    onClose()
                } else {
                    toast.error('Không tìm thấy sản phẩm vừa thêm')
                }
            } else {
                toast.error('Không thể thêm sản phẩm vào giỏ hàng')
            }
        } catch (error: any) {
            console.error('Error in handleBuyNow:', error)
            toast.error(error?.message || 'Không thể xử lý đơn hàng. Vui lòng thử lại.')
        } finally {
            setIsProcessing(false)
        }
    }

    const totalPrice = product.price * quantity

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Xác nhận mua hàng</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Product Info */}
                    <div className="flex gap-4 mb-6">
                        <img
                            src={currentImage}
                            alt={product.variantName}
                            className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {product.variantName}
                                {selectedColor && selectedStorage && (
                                    <span className="text-sm text-gray-500 font-normal block mt-1">
                                        {selectedColor} - {selectedStorage}
                                    </span>
                                )}
                            </h3>
                            <p className="text-lg font-bold text-blue-600">
                                {product.price.toLocaleString('vi-VN')}₫
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Còn lại: {product.stock} sản phẩm
                            </p>
                        </div>
                    </div>

                    {/* Color Selector */}
                    {availableColors.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Màu sắc
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {availableColors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                            selectedColor === color
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Storage Selector */}
                    {availableStorages.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Dung lượng
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {availableStorages.map((storage) => (
                                    <button
                                        key={storage}
                                        onClick={() => setSelectedStorage(storage)}
                                        className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                            selectedStorage === storage
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {storage}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số lượng
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min={1}
                                max={product.stock}
                            />
                            <button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= product.stock}
                                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tổng cộng:</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {totalPrice.toLocaleString('vi-VN')}₫
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={isProcessing}
                            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                'Mua ngay'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyNowModal
