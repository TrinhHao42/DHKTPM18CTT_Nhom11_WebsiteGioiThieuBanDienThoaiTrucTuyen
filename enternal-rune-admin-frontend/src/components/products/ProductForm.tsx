'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductRequest, ProductStatus } from '@/types/product';
import { BrandResponse } from '@/types/brand';
import brandService from '@/services/brandService';

interface ProductFormProps {
  initialData?: Partial<ProductRequest> & { prodId?: number };
  onSubmit: (data: ProductRequest) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  isEdit?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onDelete,
  isEdit = false,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  
  const [formData, setFormData] = useState<ProductRequest>({
    prodName: initialData?.prodName || '',
    prodModel: initialData?.prodModel || '',
    productStatus: initialData?.productStatus || 'ACTIVE',
    prodVersion: initialData?.prodVersion || '',
    prodColor: initialData?.prodColor || '',
    prodDescription: initialData?.prodDescription || '',
    prodRating: initialData?.prodRating || 0,
    brandId: initialData?.brandId || 0,
  });

  // Fetch brands khi component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      const data = await brandService.getNames();
      setBrands(data);
    } catch (err) {
      console.error('Error fetching brands:', err);
      // Fallback to empty array if API fails
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'brandId' || name === 'prodRating' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.prodName.trim()) {
        throw new Error('Tên sản phẩm không được để trống');
      }
      if (!formData.prodModel.trim()) {
        throw new Error('Model không được để trống');
      }
      if (formData.brandId <= 0) {
        throw new Error('Vui lòng chọn thương hiệu');
      }

      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
      console.error('Form submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!initialData?.prodId || !onDelete) return;

    if (
      confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${formData.prodName}"?\nHành động này không thể hoàn tác.`
      )
    ) {
      setLoading(true);
      setError(null);
      try {
        await onDelete(initialData.prodId);
      } catch (err: any) {
        setError(err.message || 'Không thể xóa sản phẩm');
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
          {/* Thông tin cơ bản */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên sản phẩm <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  name="prodName"
                  value={formData.prodName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="VD: iPhone 15 Pro Max"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="prodModel"
                    value={formData.prodModel}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    placeholder="VD: A2894"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thương hiệu <span className="text-error-600">*</span>
                  </label>
                  <select
                    name="brandId"
                    value={formData.brandId}
                    onChange={handleChange}
                    required
                    disabled={loadingBrands}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <option value={0}>
                      {loadingBrands ? 'Đang tải...' : 'Chọn thương hiệu'}
                    </option>
                    {brands.map((brand) => (
                      <option key={brand.brandId} value={brand.brandId}>
                        {brand.brandName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phiên bản <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="prodVersion"
                    value={formData.prodVersion}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    placeholder="VD: 256GB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Màu sắc <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="prodColor"
                    value={formData.prodColor}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                    placeholder="VD: Titan tự nhiên"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Đánh giá (0-5)
                </label>
                <input
                  type="number"
                  name="prodRating"
                  value={formData.prodRating}
                  onChange={handleChange}
                  min={0}
                  max={5}
                  step={0.1}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="4.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mô tả <span className="text-error-600">*</span>
                </label>
                <textarea
                  name="prodDescription"
                  value={formData.prodDescription}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="Nhập mô tả chi tiết về sản phẩm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trạng thái */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Trạng thái
            </h3>
            <select
              name="productStatus"
              value={formData.productStatus}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="ACTIVE">Đang bán</option>
              <option value="INACTIVE">Ngừng bán</option>
              <option value="OUT_OF_STOCK">Hết hàng</option>
            </select>
          </div>

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
                    {isEdit ? 'Cập nhật' : 'Tạo sản phẩm'}
                  </>
                )}
              </button>

              <Link
                href="/products"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
              >
                Hủy
              </Link>

              {isEdit && onDelete && initialData?.prodId && (
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
                  Xóa sản phẩm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
