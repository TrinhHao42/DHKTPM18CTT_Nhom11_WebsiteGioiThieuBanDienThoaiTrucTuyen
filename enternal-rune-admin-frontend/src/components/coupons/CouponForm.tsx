"use client";
import React, { useState, useEffect } from "react";
// Giả định kiểu dữ liệu và service đã được định nghĩa
import { DiscountResponse } from "@/types/discount";
import discountService from "@/services/discountService";
import { useToast } from "@/hooks/useToast";

interface CouponFormData {
  discountCode: string;
  discountName: string;
  discountValue: number;
  discountValueType: 'PERCENT' | 'FIXED';
  discountMaxAmount: number;
  discountQuantityLimit: number;
  discountStartDate: string;
  discountEndDate: string;
  discountActive: boolean;
  discountTargetType: 'ORDER' | 'PRODUCT' | 'EVENT';
}

interface CouponFormProps {
  discountId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

// Kiểu dữ liệu cho lỗi theo trường
type FieldErrors = Partial<Record<keyof CouponFormData, string>>;

const initialFormData: CouponFormData = {
  discountCode: "",
  discountName: "",
  discountValue: 0,
  discountValueType: 'FIXED',
  discountMaxAmount: 0,
  discountQuantityLimit: 1,
  // Đảm bảo định dạng YYYY-MM-DD
  discountStartDate: new Date().toISOString().substring(0, 10),
  discountEndDate: new Date(Date.now() + 86400000 * 30).toISOString().substring(0, 10),
  discountActive: true,
  discountTargetType: 'ORDER',
};

export default function CouponForm({ discountId, onSuccess, onCancel }: CouponFormProps) {

  // 1. STATE MANAGEMENT
  const [formData, setFormData] = useState<CouponFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // NEW STATE: Quản lý lỗi cụ thể cho từng trường
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isEditMode = !!discountId;
  const toast = useToast();

  // 2. LOAD DATA (Dùng cho chế độ Edit)
  useEffect(() => {
    if (isEditMode && discountId) {
      const fetchCoupon = async () => {
        setLoading(true);
        try {
          const coupon: DiscountResponse = await discountService.getById(discountId);

          setFormData({
            discountCode: coupon.discountCode,
            discountName: coupon.discountName,
            discountValue: coupon.discountValue,
            discountValueType: coupon.discountValueType as 'PERCENT' | 'FIXED',
            discountMaxAmount: coupon.discountMaxAmount,
            discountQuantityLimit: coupon.discountQuantityLimit,
            discountStartDate: new Date(coupon.discountStartDate).toISOString().substring(0, 10),
            discountEndDate: new Date(coupon.discountEndDate).toISOString().substring(0, 10),
            discountActive: coupon.discountActive,
            discountTargetType: coupon.discountTargetType as 'ORDER' | 'PRODUCT' | 'EVENT',
          });
        } catch (err) {
          console.error("Lỗi tải dữ liệu coupon:", err);
          setError("Không thể tải dữ liệu mã giảm giá.");
        } finally {
          setLoading(false);
        }
      };
      fetchCoupon();
    } else {
      setFormData(initialFormData);
    }
  }, [discountId, isEditMode]);


  // 3. HANDLERS
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Xử lý checkbox/switch
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Tự động xóa lỗi của trường khi người dùng bắt đầu nhập/thay đổi
    if (fieldErrors[name as keyof CouponFormData]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof CouponFormData];
        return newErrors;
      });
      // Nếu không còn lỗi trường nào nữa, xóa luôn lỗi chung
      if (Object.keys(fieldErrors).length === 1 && error === "Vui lòng kiểm tra lại các trường được đánh dấu đỏ.") {
        setError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({}); // RESET lỗi trường

    const finalData = { ...formData };
    const newFieldErrors: FieldErrors = {};
    let hasError = false;

    // --- VALIDATION LOGIC CHI TIẾT ---

    // 1. Mã và Tên
    if (!finalData.discountCode) {
      newFieldErrors.discountCode = "Mã giảm giá là bắt buộc.";
      hasError = true;
    }
    if (!finalData.discountName) {
      newFieldErrors.discountName = "Tên mã giảm giá là bắt buộc.";
      hasError = true;
    }

    // 2. Giá trị giảm giá
    if (finalData.discountValue <= 0) {
      newFieldErrors.discountValue = "Giá trị giảm giá phải lớn hơn 0.";
      hasError = true;
    }

    if (finalData.discountValueType === 'PERCENT') {
      if (finalData.discountValue > 100) {
        newFieldErrors.discountValue = "Giá trị phần trăm không được vượt quá 100.";
        hasError = true;
      }
      // Giảm tối đa
      if (finalData.discountMaxAmount < 0) {
        newFieldErrors.discountMaxAmount = "Giảm tối đa không được âm.";
        hasError = true;
      }
    } else if (finalData.discountValueType === 'FIXED') {
      // Đảm bảo Max Amount bằng 0 khi là FIXED
      if (finalData.discountMaxAmount !== 0) {
        // Tự động sửa lỗi này cho người dùng nếu cần, không cần đặt lỗi.
        finalData.discountMaxAmount = 0;
      }
    }

    // 3. Số lượng sử dụng tối đa
    if (finalData.discountQuantityLimit < 1) {
      newFieldErrors.discountQuantityLimit = "Số lượng sử dụng tối đa phải lớn hơn hoặc bằng 1.";
      hasError = true;
    }

    // 4. Kiểm tra ngày
    const startDate = new Date(finalData.discountStartDate);
    const endDate = new Date(finalData.discountEndDate);

    if (startDate > endDate) {
      newFieldErrors.discountEndDate = "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.";
      newFieldErrors.discountStartDate = "Ngày bắt đầu phải trước ngày kết thúc.";
      hasError = true;
    }

    // Nếu CÓ lỗi validation, cập nhật state và dừng
    if (hasError) {
      setFieldErrors(newFieldErrors);
      setError("Vui lòng kiểm tra lại các trường được đánh dấu đỏ."); // Thông báo lỗi chung ở trên
      setLoading(false);
      return;
    }

    const payload = finalData;

    try {

      if (isEditMode) {
        await discountService.update(discountId!, payload);
        toast.success(`Cập nhật mã ${payload.discountCode} thành công!`);
      } else {
        await discountService.create(payload);
        toast.success(`Tạo mã ${payload.discountCode} thành công!`);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
      (document.activeElement as HTMLElement)?.blur();

      onSuccess();
    } catch (err) {
      console.error("Submit error:", err);
      const apiError = (err as any).message || `Lỗi khi ${isEditMode ? 'cập nhật' : 'tạo mới'} mã giảm giá.`;
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  // 5. RENDER LOGIC
  // Hàm trợ giúp để tạo className cho input
  const getInputClassName = (fieldName: keyof CouponFormData, baseClasses: string, disabled: boolean = false) => {
    const errorClass = fieldErrors[fieldName]
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-600 focus:border-brand-500 focus:ring-brand-500';

    const disabledClass = disabled
      ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-500'
      : 'dark:bg-gray-700 dark:text-white';

    return `${baseClasses} ${errorClass} ${disabled ? disabledClass : ''}`;
  };

  if (loading && isEditMode) {
    return <div className="p-8 text-center text-lg font-medium text-gray-500 dark:text-gray-400">Đang tải thông tin mã giảm giá...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
        {isEditMode ? "📝 Chỉnh sửa Mã giảm giá" : "✨ Tạo Mã giảm giá mới"}
      </h2>

      {/* Thông báo lỗi chung (Nếu có lỗi trường nào đó, nó sẽ hiển thị) */}
      {error && (
        <div className="p-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-900 dark:text-red-300">
          {error}
        </div>
      )}

      ---

      {/* Group: CƠ BẢN */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Discount Code */}
          <div>
            <label htmlFor="discountCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mã giảm giá (Code) <span className="text-red-500">*</span></label>
            <input
              id="discountCode"
              type="text"
              name="discountCode"
              value={formData.discountCode}
              onChange={handleChange}
              // Áp dụng lớp CSS dựa trên fieldErrors
              className={getInputClassName('discountCode', 'mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm', isEditMode)}
              placeholder="VD: FREESHIP05"
              readOnly={isEditMode}
              required
            />
            {fieldErrors.discountCode && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{fieldErrors.discountCode}</p>
            )}
            {isEditMode && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Mã giảm giá không thể chỉnh sửa.</p>}
          </div>

          {/* Discount Name */}
          <div>
            <label htmlFor="discountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên mã giảm giá <span className="text-red-500">*</span></label>
            <input
              id="discountName"
              type="text"
              name="discountName"
              value={formData.discountName}
              onChange={handleChange}
              // Áp dụng lớp CSS dựa trên fieldErrors
              className={getInputClassName('discountName', 'mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm')}
              required
            />
            {fieldErrors.discountName && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{fieldErrors.discountName}</p>
            )}
          </div>
        </div>
      </div>

      ---

      {/* Group: GIÁ TRỊ VÀ GIỚI HẠN */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Giá trị & Giới hạn</h3>

        <div className="grid grid-cols-3 gap-6">
          {/* Value Type */}
          <div>
            <label htmlFor="discountValueType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loại giảm giá</label>
            <select
              id="discountValueType"
              name="discountValueType"
              value={formData.discountValueType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="FIXED">Cố định (VND)</option>
              <option value="PERCENT">Phần trăm (%)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="col-span-2">
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giá trị giảm giá <span className="text-red-500">*</span></label>
            <div className="mt-1 relative rounded-lg shadow-sm">
              <input
                id="discountValue"
                type="number"
                name="discountValue"
                min="1"
                max={formData.discountValueType === 'PERCENT' ? "100" : undefined}
                value={formData.discountValue}
                onChange={handleChange}
                // Áp dụng lớp CSS dựa trên fieldErrors
                className={getInputClassName('discountValue', 'block w-full rounded-lg border pr-14 pl-3 py-2')}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm">
                  {formData.discountValueType === 'PERCENT' ? '%' : 'VND'}
                </span>
              </div>
            </div>
            {fieldErrors.discountValue && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{fieldErrors.discountValue}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Max Discount Amount */}
          <div>
            <label htmlFor="discountMaxAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giảm tối đa (VND)</label>
            <input
              id="discountMaxAmount"
              type="number"
              name="discountMaxAmount"
              min="0"
              value={formData.discountMaxAmount}
              onChange={handleChange}
              // Áp dụng lớp CSS dựa trên fieldErrors và trạng thái disabled
              className={getInputClassName('discountMaxAmount', 'mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm', formData.discountValueType === 'FIXED')}
              disabled={formData.discountValueType === 'FIXED'}
            />
            {fieldErrors.discountMaxAmount && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{fieldErrors.discountMaxAmount}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Chỉ áp dụng cho loại **Phần trăm**. Đặt **0** nếu không giới hạn.</p>
          </div>

          {/* Quantity Limit */}
          <div>
            <label htmlFor="discountQuantityLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số lượng sử dụng tối đa <span className="text-red-500">*</span></label>
            <input
              id="discountQuantityLimit"
              type="number"
              name="discountQuantityLimit"
              min="1"
              value={formData.discountQuantityLimit}
              onChange={handleChange}
              // Áp dụng lớp CSS dựa trên fieldErrors
              className={getInputClassName('discountQuantityLimit', 'mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm')}
              required
            />
            {fieldErrors.discountQuantityLimit && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{fieldErrors.discountQuantityLimit}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Tổng số lần mã có thể được sử dụng.</p>
          </div>
        </div>
      </div>

      ---

      {/* Group: THỜI GIAN VÀ MỤC TIÊU */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Thời gian & Phạm vi</h3>

        <div className="grid grid-cols-2 gap-6">
          {/* Start Date */}
          <div>
            <label htmlFor="discountStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày bắt đầu <span className="text-red-500">*</span></label>
            <input
              id="discountStartDate"
              type="date"
              name="discountStartDate"
              value={formData.discountStartDate}
              onChange={handleChange}
              // Áp dụng lớp CSS dựa trên fieldErrors
              className={getInputClassName('discountStartDate', 'mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm')}
              required
            />
            {fieldErrors.discountStartDate && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{fieldErrors.discountStartDate}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="discountEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày kết thúc <span className="text-red-500">*</span></label>
            <input
              id="discountEndDate"
              type="date"
              name="discountEndDate"
              value={formData.discountEndDate}
              onChange={handleChange}
              // Áp dụng lớp CSS dựa trên fieldErrors
              className={getInputClassName('discountEndDate', 'mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm')}
              required
            />
            {fieldErrors.discountEndDate && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-medium">{fieldErrors.discountEndDate}</p>
            )}
          </div>

          {/* Target Type */}
          <div>
            <label htmlFor="discountTargetType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Áp dụng cho</label>
            <select
              id="discountTargetType"
              name="discountTargetType"
              value={formData.discountTargetType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="ORDER">Toàn bộ Đơn hàng</option>
              <option value="PRODUCT">Sản phẩm cụ thể</option>
              <option value="EVENT">Sự kiện/Chiến dịch</option>
            </select>
          </div>

          {/* Active Status (Sử dụng Toggle Switch) */}
          <div className="flex flex-col justify-end">
            <label htmlFor="discountActive" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trạng thái Kích hoạt</label>
            <div className="flex items-center space-x-3 h-[42px]">
              <span className={`text-sm font-medium ${formData.discountActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formData.discountActive ? 'Đang hoạt động' : 'Tạm dừng'}
              </span>
              <button
                type="button"
                id="discountActive"
                name="discountActive"
                onClick={() => setFormData(prev => ({ ...prev, discountActive: !prev.discountActive }))}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 ${formData.discountActive ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${formData.discountActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      ---

      {/* Action Buttons */}
      <div className="pt-6 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition duration-150"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg border border-transparent bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-brand-700 disabled:opacity-50 transition duration-150"
        >
          {loading ? "Đang xử lý..." : isEditMode ? "💾 Lưu thay đổi" : "🚀 Tạo mã giảm giá"}
        </button>
      </div>
    </form>
  );
}