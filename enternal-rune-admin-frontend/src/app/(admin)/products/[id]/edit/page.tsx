'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import productService from '@/services/productService';
import { ProductResponse, ProductFormData, ImageResponse } from '@/types/product';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Gọi API /products/dashboard/{id} để lấy chi tiết sản phẩm
      const data = await productService.getById(parseInt(id));
      
      if (!data) {
        throw new Error('Không tìm thấy sản phẩm');
      }
      
      setProduct(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin sản phẩm');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Chuyển đổi ProductResponse sang ProductFormData
  const getFormData = (): Partial<ProductFormData> | undefined => {
    if (!product) return undefined;
    
    // Lấy giá đầu tiên từ productPrices
    const currentPrice = product.productPrices && product.productPrices.length > 0 
      ? product.productPrices[0].ppPrice 
      : 0;

    return {
      productId: product.prodId,
      productName: product.prodName,
      productModel: product.prodModel,
      productStatus: (product.productStatus as 'ACTIVE' | 'OUT_OF_STOCK' | 'REMOVED') || 'ACTIVE',
      productVersion: product.prodVersion || [''],
      productColor: product.prodColor || [''],
      productDescription: product.prodDescription || '',
      brandId: product.prodBrand?.brandId || 0,
      price: currentPrice,
    };
  };

  // Lấy danh sách ảnh hiện tại
  const getExistingImages = (): ImageResponse[] => {
    return product?.images || [];
  };

  const handleSubmit = async (data: ProductFormData, _images: File[]) => {
    try {
      // Lấy ảnh hiện tại để gửi lại trong request
      const existingImages = getExistingImages().map((img) => ({
        imageName: img.imageName,
        imageData: img.imageData,
      }));
      await productService.update(parseInt(id), data, existingImages);
      alert('Cập nhật sản phẩm thành công!');
      router.push('/products');
    } catch (error: any) {
      throw new Error(error.message || 'Không thể cập nhật sản phẩm');
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await productService.delete(productId);
      router.push('/products');
    } catch (error: any) {
      throw new Error(error.message || 'Không thể xóa sản phẩm');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-brand-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/products"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
            Chỉnh sửa sản phẩm
          </h1>
        </div>

        <div className="rounded-lg border border-error-200 bg-error-50 p-6 text-center dark:border-error-800 dark:bg-error-900/20">
          <svg
            className="h-12 w-12 text-error-600 dark:text-error-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium text-error-800 dark:text-error-300 mb-2">
            {error || 'Không tìm thấy sản phẩm'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/products"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
              Chỉnh sửa sản phẩm
            </h1>
          </div>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Cập nhật thông tin sản phẩm #{product.prodId}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <ProductForm
        initialData={getFormData()}
        existingImages={getExistingImages()}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isEdit={true}
      />
    </div>
  );
}
