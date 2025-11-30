'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrandForm from '@/components/brands/BrandForm';
import brandService from '@/services/brandService';
import { BrandRequest } from '@/types/brand';

export default function NewBrandPage() {
  const router = useRouter();

  const handleSubmit = async (data: BrandRequest) => {
    try {
      await brandService.add(data);
      alert('Tạo thương hiệu thành công!');
      router.push('/brands');
    } catch (error: any) {
      throw new Error(error.message || 'Không thể tạo thương hiệu');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/brands"
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
              Thêm thương hiệu mới
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Điền thông tin để thêm thương hiệu mới vào hệ thống
          </p>
        </div>
      </div>

      {/* Form Content */}
      <BrandForm onSubmit={handleSubmit} isEdit={false} />
    </div>
  );
}
