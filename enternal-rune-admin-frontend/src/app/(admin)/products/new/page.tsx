'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/products/ProductForm';
import productService from '@/services/productService';
import { ProductFormData } from '@/types/product';

export default function NewProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: ProductFormData, images: File[]) => {
    try {
      await productService.add(data, images);
      // alert('Tạo sản phẩm thành công!');
      router.push('/products');
    } catch (error: any) {
      throw new Error(error.message || 'Không thể tạo sản phẩm');
    }
  };

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
              Thêm sản phẩm mới
            </h1>
          </div>
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            Điền thông tin để thêm sản phẩm mới vào hệ thống
          </p>
        </div>
      </div>

      {/* Form Content */}
      <ProductForm onSubmit={handleSubmit} isEdit={false} />
    </div>
  );
}
