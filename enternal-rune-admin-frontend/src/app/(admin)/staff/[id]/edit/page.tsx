'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from 'react-hot-toast';
import { useRouter, useParams } from "next/navigation";

import staffService from "@/services/staffService";


// Interface cho các đối tượng phức tạp
interface Role { id: number | null; roleName: string; }
interface Address { addressId: number | null; streetName: string; wardName: string; cityName: string; countryName: string; }

// Interface cho Dữ liệu nhận về (Response)
interface StaffResponse {
    id: number;
    name: string;
    email: string;
    role: Role;
    status: boolean;
    address: Address;
}

// Interface cho Dữ liệu gửi đi (Request) - Dùng để quản lý form state
interface StaffRequest {
    name: string;
    email: string;
    role: Role; // Gồm ID và Role Name
    status: boolean;
    password?: string; // Mật khẩu là optional
    address: Address; // Gồm Address ID và chi tiết
}

// Cấu trúc dữ liệu mặc định ban đầu cho form
const initialFormData: StaffRequest = {
    name: "", email: "", status: true, password: "",
    role: { id: null, roleName: "" },
    address: { addressId: null, streetName: "", wardName: "", cityName: "", countryName: "Việt Nam", },
};

// ****************************
// CHÚ Ý: ĐỊNH NGHĨA ROLES
// ****************************
// 1. Backend Roles: Dùng để gửi lên API (Phải có ID)
const predefinedRoles: Role[] = [
    { id: 1, roleName: "ROLE_ADMIN" },
    { id: 2, roleName: "ROLE_MANAGER" },
    { id: 3, roleName: "ROLE_STAFF" },
    { id: 4, roleName: "ROLE_VIEWER" },
];

// 2. Mapping Tên hiển thị (UI) và Tên Backend (API)
const ROLE_MAPPING_UI_TO_API: { [key: string]: string } = {
    "Quản trị viên": "ROLE_ADMIN",
    "Quản lý": "ROLE_USER",
    "Nhân viên": "ROLE_STAFF",
};

const ROLE_MAPPING_API_TO_UI: { [key: string]: string } = {
    "ROLE_ADMIN": "Quản trị viên",
    "ROLE_USER": "Quản lý",
    "ROLE_STAFF": "Nhân viên",
   
};

const UIRoles = Object.keys(ROLE_MAPPING_UI_TO_API);


// Danh sách thành phố
const VIETNAM_CITIES = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng",
    "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh",
    "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
    "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng",
    "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An",
    "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
    "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
    "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
    "Thừa Thiên Huế", "Tiền Giang", "Thành phố Hồ Chí Minh", "Trà Vinh",
    "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
].sort((a, b) => a.localeCompare(b));


// **********************************************
// 2. COMPONENT CHÍNH
// **********************************************

export default function EditStaffPage() {
    const router = useRouter();
    const params = useParams();

    const id = Number(params.id);

    const [staff, setStaff] = useState<StaffResponse | null>(null);
    const [formData, setFormData] = useState<StaffRequest>(initialFormData);

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [changePassword, setChangePassword] = useState(false); // Đổi tên thành changePassword cho dễ hiểu hơn

    // -----------------------------------------------------------------
    // A. Fetch Data (useEffect)
    // -----------------------------------------------------------------
    useEffect(() => {
        const fetchStaffData = async () => {
            if (!id || isNaN(id)) {
                toast.error("ID nhân viên không hợp lệ. Vui lòng kiểm tra lại đường dẫn.");
                setLoading(false);
                return;
            }

            try {
                // Giả định staffService.getStaffById hoạt động
                const staffData: StaffResponse = await staffService.getStaffById(id); 
                setStaff(staffData);

                // Lấy Role Name để hiển thị trên UI
                const uiRoleName = ROLE_MAPPING_API_TO_UI[staffData.role?.roleName] || staffData.role?.roleName || "";

                // Ánh xạ dữ liệu response vào form state, đảm bảo lưu ID
                setFormData({
                    name: staffData.name || "",
                    email: staffData.email || "",
                    status: staffData.status ?? true,
                    password: "",
                    role: {
                        id: staffData.role?.id || null, // LƯU ROLE ID (number)
                        roleName: uiRoleName // LƯU ROLE NAME HIỂN THỊ (ví dụ: 'Quản trị viên')
                    },
                    address: {
                        addressId: staffData.address?.addressId || null, // LƯU ADDRESS ID (number)
                        streetName: staffData.address?.streetName || "",
                        wardName: staffData.address?.wardName || "",
                        cityName: staffData.address?.cityName || "",
                        countryName: staffData.address?.countryName || "Việt Nam",
                    }
                });

            } catch (error: any) {
                console.error("Error fetching staff data:", error);
                toast.error(`Lỗi tải dữ liệu (ID: ${id}): ${error.message || "Kiểm tra kết nối hoặc cấu hình API/CORS."}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStaffData();
    }, [id]);

    // -----------------------------------------------------------------
    // B. Xử lý thay đổi Input
    // -----------------------------------------------------------------
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // Chuyển đổi chuỗi 'true'/'false' thành boolean cho trường 'status'
            [name]: name === 'status' ? value === 'true' : value, 
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            }
        }));
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const uiRoleName = e.target.value; // Tên hiển thị (ví dụ: 'Quản trị viên')
        // Ánh xạ sang tên API để tìm ID
        const apiRoleName = ROLE_MAPPING_UI_TO_API[uiRoleName] || uiRoleName;
        const selectedRole = predefinedRoles.find(r => r.roleName === apiRoleName);

        setFormData(prev => ({
            ...prev,
            role: {
                id: selectedRole?.id || null, // Lấy ID (number) của Role được chọn
                roleName: uiRoleName // LƯU TÊN HIỂN THỊ trong form state
            }
        }));
    };

    // -----------------------------------------------------------------
    // C. Xử lý Submit Form (ĐÃ SỬA)
    // -----------------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEditing) return;

        // 1. Validation
        if (!formData.name || !formData.email) { toast.error("Vui lòng điền đủ Họ tên và Email."); return; }
        if (!id || isNaN(id)) { toast.error("Lỗi: ID nhân viên không hợp lệ."); return; }

        const apiRoleName = ROLE_MAPPING_UI_TO_API[formData.role.roleName];
        if (!apiRoleName || !formData.role.id) {
            toast.error("Vui lòng chọn Vai trò hợp lệ cho nhân viên.");
            return;
        }

        // 2. Xử lý Mật khẩu
        if (changePassword && (!formData.password || formData.password.length < 6)) {
            toast.error("Vui lòng nhập mật khẩu mới (tối thiểu 6 ký tự).");
            return;
        }

        // 3. Chuẩn bị Request Body (Logic không cập nhật mật khẩu nằm ở đây)
        const requestBody: StaffRequest = {
            name: formData.name,
            email: formData.email,
            status: formData.status,
            // CHỈ GỬI PASSWORD NẾU changePassword LÀ TRUE
            password: changePassword ? formData.password : undefined, 

            // Gửi Role ID và Role Name chuẩn API
            role: {
                id: formData.role.id,
                roleName: apiRoleName
            },

            // Gửi Address ID và chi tiết
            address: formData.address,
        };

        setIsEditing(true);

        try {
            // 4. Gọi API Update (Giả định staffService.updateStaff hoạt động)
            const result = await staffService.updateStaff(id, requestBody);

            toast.success(`Cập nhật nhân viên ${result.name} (ID: ${id}) thành công!`);
            router.push('/staff');

        } catch (error: any) {
            console.error("Update staff failed:", error);
            toast.error(`Lỗi cập nhật: ${error.message || "Đã xảy ra lỗi không xác định."}`);
        } finally {
            setIsEditing(false);
        }
    };


    // -----------------------------------------------------------------
    // D. Render UI
    // -----------------------------------------------------------------

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-4 border-brand-500 border-t-transparent" />
                <p className="mt-4 text-gray-500 dark:text-gray-400">Đang tải thông tin nhân viên (ID: {id})...</p>
            </div>
        );
    }

    // Nếu tải xong mà không có dữ liệu
    if (!staff) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-bold text-red-600">Không tìm thấy thông tin nhân viên</h2>
                <Link href="/staff" className="mt-4 inline-block text-blue-500 hover:text-blue-700">Quay lại danh sách</Link>
            </div>
        );
    }


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
                            Chỉnh sửa nhân viên (ID: {id})
                        </h1>
                    </div>
                    <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                        Cập nhật thông tin chi tiết của nhân viên.
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

                   

                    {/* 3. Address Information (Địa chỉ) */}
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
                                    <select
                                        name="cityName"
                                        value={formData.address.cityName}
                                        onChange={handleAddressChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    >
                                        <option value="">--- Chọn Tỉnh/Thành phố ---</option>
                                        {VIETNAM_CITIES.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
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
                                <div>
                                    <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quốc gia (countryName)
                                    </label>
                                    <input
                                        type="text"
                                        name="countryName"
                                        value={formData.address.countryName}
                                        onChange={handleAddressChange}
                                        placeholder="Ví dụ: Việt Nam"
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

                    {/* Permissions (role.roleName) */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Vai trò & Quyền *
                        </h3>
                        <select
                            name="roleName"
                            value={formData.role.roleName}
                            onChange={handleRoleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                            {/* Option này cần được gỡ bỏ nếu muốn đảm bảo không phải chọn lại sau khi load data, 
                                hoặc đảm bảo formData.role.roleName luôn là giá trị hợp lệ trong UIRoles. */}
                            <option value="">--- Chọn Vai trò ---</option> 
                            
                            {/* Dùng danh sách tên hiển thị (UIRoles) */}
                            {UIRoles.map(uiRole => (
                                <option key={uiRole} value={uiRole}>
                                    {uiRole}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Account Access (password) */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Cập nhật Tài khoản
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="change-password"
                                    checked={changePassword}
                                    onChange={(e) => {
                                        setChangePassword(e.target.checked);
                                        // Xóa mật khẩu khi bỏ check
                                        if (!e.target.checked) {
                                            setFormData(prev => ({ ...prev, password: "" }));
                                        }
                                    }}
                                    className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600"
                                />
                                <label htmlFor="change-password" className="text-theme-sm text-gray-700 dark:text-gray-300">
                                    **Cập nhật mật khẩu** (Chỉ check khi muốn đổi)
                                </label>
                            </div>
                            <div className={!changePassword ? "opacity-50 pointer-events-none" : ""}>
                                <label className="block text-theme-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mật khẩu {changePassword && "*"}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required={changePassword}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="space-y-3">
                            <button
                                type="submit"
                                disabled={isEditing || loading}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                            >
                                {isEditing ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                )}
                                {isEditing ? "Đang lưu..." : "Lưu thay đổi"}
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