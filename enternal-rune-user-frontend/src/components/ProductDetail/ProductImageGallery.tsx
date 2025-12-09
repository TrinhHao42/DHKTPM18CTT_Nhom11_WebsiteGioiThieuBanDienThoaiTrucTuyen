'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '@/types/Product'

interface ProductImageGalleryProps {
    images: string[]
    product: Product
    selectedColorIndex?: number
    onImageSelect?: (index: number) => void
}

export default function ProductImageGallery({ images = [], product, selectedColorIndex = 0, onImageSelect }: ProductImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(selectedColorIndex)
    const [isZoomed, setIsZoomed] = useState(false)

    // Sync selectedImageIndex with selectedColorIndex
    useEffect(() => {
        setSelectedImageIndex(selectedColorIndex)
    }, [selectedColorIndex])

    // Safety check for images array
    const safeImages = images.length > 0 ? images : ['/images/iphone.png']

    return (
        <div className="space-y-4">
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                <div className="aspect-square relative">
                    <Image
                        src={safeImages[selectedImageIndex] || safeImages[0] || '/images/iphone.png'}
                        alt={`${product.prodName} - Image ${selectedImageIndex + 1}`}
                        fill
                        className={`object-contain p-8 transition-transform duration-300 cursor-zoom-in ${isZoomed ? 'scale-150' : 'scale-100'
                            }`}
                        onClick={() => setIsZoomed(!isZoomed)}
                        priority
                    />
                </div>

                {/* Zoom Indicator */}
                {!isZoomed && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        Nhấn để phóng to
                    </div>
                )}

                {/* Image Navigation Arrows */}
                {safeImages.length > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : safeImages.length - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-xl"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSelectedImageIndex(prev => prev < safeImages.length - 1 ? prev + 1 : 0)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-xl"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
            {safeImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {safeImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setSelectedImageIndex(index)
                                onImageSelect?.(index)
                            }}
                            className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all duration-300 ${selectedImageIndex === index
                                ? 'border-blue-500 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-105'
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`${product.prodName} - Thumbnail ${index + 1}`}
                                fill
                                className="object-contain p-2"
                                sizes="(max-width: 768px) 25vw, 12vw"
                            />
                            {/* Selected Overlay */}
                            {selectedImageIndex === index && (
                                <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Product Description */}
            {product.prodDescription && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h4>
                    <p className="text-gray-700 text-sm">{product.prodDescription}</p>
                </div>
            )}
        </div>
    )
}