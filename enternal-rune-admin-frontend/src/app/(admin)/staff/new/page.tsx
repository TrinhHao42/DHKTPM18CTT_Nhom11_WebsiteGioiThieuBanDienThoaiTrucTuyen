"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StaffRequest, StaffResponse, Role, AddressResponse } from "@/types/staff";
import { staffService } from "@/services/staffService";
import { toast } from 'react-hot-toast'; 

// --- 🎯 KHẮC PHỤC LỖI ROLE DATABASE ---
// Ánh xạ giữa Role hiển thị (UI) và Role trong Database (DB)
const ROLE_MAPPING: { [key: string]: string } = {
    "Admin": "ROLE_ADMIN",
    "Nhân viên": "ROLE_STAFF",
    "Chỉ xem": "ROLE_USER", 
};

// Giá trị mặc định trong DB (ROLE_STAFF) sẽ được chuyển thành giá trị hiển thị ("Nhân viên")
const REVERSE_ROLE_MAPPING: { [key: string]: string } = {
    "ROLE_ADMIN": "Admin",
    "ROLE_STAFF": "Nhân viên",
    "ROLE_USER": "Chỉ xem",
};
// ----------------------------------------

// Khởi tạo trạng thái Form ban đầu
const initialAddress: AddressResponse = {
    addressId: null,
    streetName: "",
    wardName: "",
    cityName: "",
    countryName: "Vietnam",
};

const initialRole: Role = {
    roleName: REVERSE_ROLE_MAPPING["ROLE_STAFF"], 
};

const initialFormState: StaffRequest = {
    name: "",
    email: "",
    role: initialRole,
    status: true,
    password: "",
    address: initialAddress,
};


export default function NewStaffForm() { 
    const router = useRouter();
    const [formData, setFormData] = useState<StaffRequest>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);

    // Hàm chung để cập nhật các trường cấp 1
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "status" ? value === "true" : value,
        }));
    };

    // Hàm để cập nhật Address
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };
    
    // Hàm để cập nhật Role
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roleName = e.target.value;
        setFormData(prev => ({
            ...prev,
            role: { roleName: roleName },
        }));
    };

    // Hàm xử lý khi gửi Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // --- 🎯 KHẮC PHỤC LỖI ROLE DATABASE: Chuyển đổi Role trước khi gửi ---
            const actualRoleName = ROLE_MAPPING[formData.role.roleName] || "ROLE_STAFF"; 
            // -------------------------------------------------------------------

            // Chuẩn bị dữ liệu gửi đi
            const dataToSend: StaffRequest = {
                ...formData,
                password: createAccount ? formData.password : "", 
                address: {
                    ...formData.address,
                    addressId: null, // Đảm bảo addressId là null khi tạo mới
                },
                // Ghi đè Role với giá trị Back-end yêu cầu
                role: { roleName: actualRoleName } 
            };

            // Validation cơ bản phía Client
            if (!dataToSend.name || !dataToSend.email || (createAccount && !dataToSend.password)) {
                toast.error("Vui lòng điền đủ Họ tên, Email và Mật khẩu (nếu tạo tài khoản).");
                setIsSubmitting(false);
                return;
            }

            const response: StaffResponse = await staffService.createStaff(dataToSend);
            
            toast.success(`Thêm nhân viên ${response.name} thành công!`);
            router.push("/staff"); 

        } catch (error) {
            console.error("Error creating staff:", error);
            
            // --- TỐI ƯU HÓA XỬ LÝ LỖI ---
            let errorMessage = "Đã xảy ra lỗi không xác định khi thêm nhân viên.";
            
            if (error instanceof Error) {
                // Lỗi này có thể là 'Failed to fetch' (CORS/mạng) hoặc lỗi chi tiết từ Service
                errorMessage = error.message; 
            } 
            
            toast.error(`Lỗi thêm nhân viên: ${errorMessage}`); 
            // ----------------------------
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link
                            href="/staff"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>
                        <h1 className="text-title-md font-bold text-gray-800 dark:text-white/90">
                            Thêm nhân viên mới
                        </h1>
                    </div>
                    <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                        Điền thông tin để thêm nhân viên mới vào hệ thống
                    </p>
                </div>
            </div>

            {/* Form Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form (lg:col-span-2) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* 1. Personal Information (name, email) */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Thông tin cá nhân
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nguyễn Văn A"
                                        required
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@company.com"
                                        required
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Job Information (Giữ nguyên) */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Thông tin công việc
                        </h3>
                        {/* Placeholder */}
                        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                            (Thêm các trường Phone, DOB, v.v. tại đây nếu cần)
                        </p>
                    </div>

                    {/* 3. Address Information */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Địa chỉ liên hệ
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Địa chỉ chi tiết (streetName)
                                </label>
                                <input
                                    type="text"
                                    name="streetName"
                                    value={formData.address.streetName}
                                    onChange={handleAddressChange}
                                    placeholder="Số nhà, tên đường"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tỉnh/Thành phố (cityName)
                                    </label>
                                    <input 
                                        type="text"
                                        name="cityName"
                                        value={formData.address.cityName}
                                        onChange={handleAddressChange}
                                        placeholder="Ví dụ: TP. Hồ Chí Minh"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quận/Huyện (Không gửi lên server)
                                    </label>
                                    {/* Trường này không có name vì không có trong StaffRequest.address */}
                                    <input 
                                        type="text"
                                        placeholder="Ví dụ: Quận 1"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phường/Xã (wardName)
                                    </label>
                                    <input 
                                        type="text"
                                        name="wardName"
                                        value={formData.address.wardName}
                                        onChange={handleAddressChange}
                                        placeholder="Ví dụ: Bến Nghé"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status (status) */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Trạng thái
                        </h3>
                        <select 
                            name="status"
                            value={formData.status ? "true" : "false"}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                            <option value="true">Đang làm việc</option>
                            <option value="false">Ngừng hoạt động</option>
                        </select>
                    </div>

                    {/* Account Access (password) */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Tài khoản hệ thống
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="create-account"
                                    checked={createAccount}
                                    onChange={(e) => setCreateAccount(e.target.checked)}
                                    className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600"
                                />
                                <label htmlFor="create-account" className="text-theme-sm text-gray-700 dark:text-gray-300">
                                    Tạo tài khoản đăng nhập
                                </label>
                            </div>
                            <div className={!createAccount ? "opacity-50 pointer-events-none" : ""}>
                                <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mật khẩu {createAccount && "*"}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required={createAccount}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Permissions (role.roleName) */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Vai trò & Quyền
                        </h3>
                        <select 
                            name="roleName"
                            value={formData.role.roleName}
                            onChange={handleRoleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Quản lý">Quản lý</option>
                            <option value="Nhân viên">Nhân viên</option>
                            <option value="Chỉ xem">Chỉ xem</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="space-y-3">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-gray-400"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                )}
                                {isSubmitting ? "Đang lưu..." : "Lưu nhân viên"}
                            </button>
                            <Link
                                href="/staff"
                                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                            >
                                Hủy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    
    );
}