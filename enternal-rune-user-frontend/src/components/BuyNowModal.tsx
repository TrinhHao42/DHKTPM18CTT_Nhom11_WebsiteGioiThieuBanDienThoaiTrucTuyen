'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCheckout } from '@/context/CheckoutContext'
import { useToast } from '@/hooks/useToast'
import { CartService } from '@/services/cartService'
import { X, Minus, Plus, ShoppingBag, Sparkles, Package, Truck } from 'lucide-react'

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
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [isOpen])

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
                
                console.log('✅ Found matching items for checkout:', matchingItems)
                
                if (matchingItems.length > 0) {
                    // Set checkout items and redirect to payment
                    setCheckoutItems(matchingItems)
                    console.log('🔄 Checkout items set, redirecting to payment...')
                    toast.success('Đang chuyển đến trang thanh toán...')
                    
                    // Wait a bit for state to update before navigating
                    await new Promise(resolve => setTimeout(resolve, 100))
                    
                    router.push('/PaymentScreen')
                    onClose()
                } else {
                    console.error('❌ No matching items found')
                    toast.error('Không tìm thấy sản phẩm vừa thêm')
                }
            } else {
                console.error('❌ Cart response has no items')
                toast.error('Không thể thêm sản phẩm vào giỏ hàng')
            }
        } catch (error: any) {
            console.error('Error in handleBuyNow:', error)
            toast.error(error?.message || 'Không thể xử lý đơn hàng. Vui lòng thử lại.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(onClose, 200)
    }

    const totalPrice = product.price * quantity

    // Color mapping for visual display
    const getColorStyle = (color: string) => {
        const colorMap: Record<string, string> = {
            'Đen': '#1a1a1a',
            'Trắng': '#f5f5f5',
            'Xanh': '#0066cc',
            'Xanh Dương': '#0066cc',
            'Xanh Lá': '#00aa55',
            'Đỏ': '#cc0033',
            'Vàng': '#ffcc00',
            'Hồng': '#ff69b4',
            'Tím': '#9933ff',
            'Bạc': '#c0c0c0',
            'Xám': '#808080',
            'Cam': '#ff6600',
            'Natural Titanium': '#8B8378',
            'Blue Titanium': '#394E67',
            'White Titanium': '#E8E6E3',
            'Black Titanium': '#3C3C3C',
        }
        return colorMap[color] || '#6b7280'
    }

    return (
        <div 
            className={`fixed top-0 left-0 right-0 bottom-0 w-full h-full z-50 flex items-center justify-center p-4 transition-all duration-300 ${
                isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent'
            }`}
            style={{ minHeight: '100vh', minWidth: '100vw' }}
            onClick={handleClose}
        >
            <div 
                className={`bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 ${
                    isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Mua ngay</h2>
                            <p className="text-blue-100 text-xs">Xác nhận đơn hàng của bạn</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Main Content - 2 Columns */}
                <div className="flex flex-col md:flex-row">
                    {/* Left Column - Product Image & Name */}
                    <div className="md:w-2/5 p-6 flex flex-col items-center border-r border-gray-200">
                        <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden bg-white shadow-lg mb-4">
                            <img
                                src={currentImage}
                                alt={product.variantName}
                                className="w-full h-full object-contain p-4 transition-all duration-500"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-center leading-tight mb-2">
                            {product.variantName}
                        </h3>
                    </div>

                    {/* Right Column - Options */}
                    <div className="md:w-3/5 flex flex-col">
                        <div className="p-6 overflow-y-auto flex-1 max-h-[50vh] md:max-h-[60vh]">
                            {/* Color Selector */}
                            {availableColors.length > 0 && (
                                <div className="mb-5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                                        <Sparkles className="w-4 h-4 text-blue-500" />
                                        Chọn màu sắc
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`group relative flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                                                    selectedColor === color
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                <span 
                                                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                                                        selectedColor === color ? 'border-white/50' : 'border-gray-300'
                                                    }`}
                                                    style={{ backgroundColor: getColorStyle(color) }}
                                                />
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Storage Selector */}
                            {availableStorages.length > 0 && (
                                <div className="mb-5">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                                        <Package className="w-4 h-4 text-blue-500" />
                                        Chọn dung lượng
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableStorages.map((storage) => (
                                            <button
                                                key={storage}
                                                onClick={() => setSelectedStorage(storage)}
                                                className={`py-2 px-5 rounded-full text-sm font-semibold transition-all duration-200 ${
                                                    selectedStorage === storage
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {storage}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-gray-800 mb-3">
                                    Số lượng
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                        className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                                    >
                                        <Minus className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                        className="w-20 h-11 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        min={1}
                                        max={product.stock}
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= product.stock}
                                        className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                                    >
                                        <Plus className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <span className="ml-2 text-sm text-gray-500">
                                        Còn <span className="font-semibold text-gray-700">{product.stock}</span> sản phẩm
                                    </span>
                                </div>
                            </div>

                            {/* Shipping Info */}
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Truck className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-800">Miễn phí vận chuyển</p>
                                    <p className="text-xs text-green-600">Giao hàng trong 2-3 ngày</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer with Total & Actions */}
                        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                            {/* Total Price */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <span className="text-sm text-gray-500">Tổng thanh toán</span>
                                    <p className="text-xs text-gray-400">{quantity} sản phẩm</p>
                                </div>
                                <span className="text-2xl font-bold text-blue-600">
                                    {totalPrice.toLocaleString('vi-VN')}đ
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClose}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={isProcessing}
                                    className="flex-[2] py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5" />
                                            <span>Thanh toán ngay</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyNowModal
