'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BrandRequest, BrandFormData } from '@/types/brand';

interface BrandFormProps {
  initialData?: Partial<BrandFormData>;
  onSubmit: (data: BrandRequest) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  isEdit?: boolean;
}

// Ảnh mặc định cho thương hiệu
const DEFAULT_BRAND_LOGO = 'https://placehold.co/200x200/e2e8f0/64748b?text=Brand';

export default function BrandForm({
  initialData,
  onSubmit,
  onDelete,
  isEdit = false,
}: BrandFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BrandFormData>({
    brandId: initialData?.brandId,
    brandName: initialData?.brandName || '',
    brandLogoUrl: initialData?.brandLogoUrl || '',
    brandDescription: initialData?.brandDescription || '',
    brandStatus: initialData?.brandStatus || 'ACTIVE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.brandName.trim()) {
        throw new Error('Tên thương hiệu không được để trống');
      }

      const brandRequest: BrandRequest = {
        brandName: formData.brandName,
        brandLogoUrl: formData.brandLogoUrl,
        brandDescription: formData.brandDescription,
        brandStatus: formData.brandStatus,
      };

      await onSubmit(brandRequest);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
      console.error('Form submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!initialData?.brandId || !onDelete) return;

    if (
      confirm(
        `Bạn có chắc chắn muốn xóa thương hiệu "${formData.brandName}"?\nĐiều này có thể ảnh hưởng đến các sản phẩm liên quan.`
      )
    ) {
      setLoading(true);
      setError(null);
      try {
        await onDelete(initialData.brandId);
      } catch (err: any) {
        setError(err.message || 'Không thể xóa thương hiệu');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-900/20">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-error-600 dark:text-error-400"
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
            <p className="text-sm font-medium text-error-800 dark:text-error-300">
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Thông tin thương hiệu
            </h3>
            <div className="space-y-4">
              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên thương hiệu <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="VD: Apple, Samsung, Xiaomi..."
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Nhập tên thương hiệu chính xác, tránh trùng lặp
                </p>
              </div>

              {/* Brand Logo URL */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Logo thương hiệu
                </label>
                <input
                  type="url"
                  name="brandLogoUrl"
                  value={formData.brandLogoUrl}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="https://example.com/logo.png"
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Để trống sẽ sử dụng ảnh mặc định
                </p>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Xem trước:</p>
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    <Image
                      src={formData.brandLogoUrl || DEFAULT_BRAND_LOGO}
                      alt="Logo preview"
                      fill
                      className="object-contain p-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_BRAND_LOGO;
                      }}
                      unoptimized={true}
                    />
                  </div>
                </div>
              </div> */}

              {/* Brand Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mô tả thương hiệu
                </label>
                <textarea
                  name="brandDescription"
                  value={formData.brandDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="Nhập mô tả về thương hiệu..."
                />
              </div>

              {/* Brand Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trạng thái
                </label>
                <select
                  name="brandStatus"
                  value={formData.brandStatus}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Không hoạt động</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
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
                    Đang xử lý...
                  </>
                ) : (
                  <>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {isEdit ? 'Cập nhật' : 'Tạo thương hiệu'}
                  </>
                )}
              </button>

              <Link
                href="/brands"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
              >
                Hủy
              </Link>

              {isEdit && onDelete && initialData?.brandId && (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-error-300 bg-error-50 px-4 py-2.5 text-sm font-medium text-error-700 hover:bg-error-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-error-800 dark:bg-error-900/20 dark:text-error-400 dark:hover:bg-error-900/30"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Xóa thương hiệu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
