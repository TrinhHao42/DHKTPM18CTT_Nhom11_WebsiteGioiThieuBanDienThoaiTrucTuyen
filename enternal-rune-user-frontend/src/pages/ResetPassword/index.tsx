'use client'
import { useState } from "react";
// Lưu ý: Đổi từ 'next/router' sang 'next/navigation' nếu bạn dùng App Router
import { useRouter } from "next/navigation"; 
import { apiVerifyResetCode, apiResetPassword } from "@/services/authService";

export default function ResetPassword() {
    const router = useRouter();
    // Sử dụng window.location.search để lấy query nếu dùng App Router, 
    // hoặc giữ router.query nếu dùng Pages Router
    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const initialEmail = urlParams.get('email') || ""; 

    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- Xử lý Xác minh mã ---
    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Giả lập API call
            // await apiVerifyResetCode(email, code);
            
            // Nếu xác minh thành công
            setIsCodeVerified(true);
            alert("Mã hợp lệ. Vui lòng nhập mật khẩu mới.");
        } catch (err: any) {
            alert(err.message || "Mã không hợp lệ. Vui lòng kiểm tra lại.");
        } finally {
            setLoading(false);
        }
    };

    // --- Xử lý Đặt lại mật khẩu ---
    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Giả lập API call
            // await apiResetPassword(email, code, newPassword);
            alert("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
            router.push("/LoginScreen"); // Đổi về trang Đăng nhập
        } catch (err: any) {
            alert(err.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Nền sáng và thẻ form cao cấp
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4 py-10">
            <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-100">
                
                {/* Tiêu đề & Mô tả */}
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                    Đặt Lại Mật Khẩu
                </h2>
                <p className="text-center text-slate-500 mb-8 text-base">
                    {isCodeVerified ? 
                        "Bước 2: Tạo mật khẩu mới an toàn." : 
                        "Bước 1: Nhập mã xác minh đã gửi đến email của bạn."
                    }
                </p>

                {/* --- Form Xác Minh Mã (Bước 1) --- */}
                {!isCodeVerified && (
                    <form onSubmit={handleVerify} className="space-y-5">
                        <input 
                            className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400 text-lg" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={initialEmail.length > 0} // Không cho chỉnh sửa nếu đã có email từ query
                            type="email"
                            required
                        />
                        <input 
                            className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400 text-lg text-center tracking-widest" 
                            placeholder="Mã xác minh (6 chữ số)" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)} 
                            maxLength={6}
                            required
                        />
                        <button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl shadow-lg shadow-blue-500/30 transition duration-300 disabled:bg-blue-400"
                            disabled={loading || code.length < 6}
                        >
                            {loading ? "Đang xác minh..." : "Xác Minh Mã"}
                        </button>
                    </form>
                )}

                {/* --- Form Đặt Mật Khẩu Mới (Bước 2) --- */}
                {isCodeVerified && (
                    <form onSubmit={handleReset} className="space-y-5">
                        <input 
                            className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400 text-lg" 
                            placeholder="Mật khẩu mới (Tối thiểu 8 ký tự)" 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            minLength={8}
                            required
                        />
                        <button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold p-4 rounded-xl shadow-lg shadow-green-500/30 transition duration-300 disabled:bg-green-400"
                            disabled={loading || newPassword.length < 8}
                        >
                            {loading ? "Đang đặt lại..." : "Đặt Lại Mật Khẩu"}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center text-sm">
                    <p className="text-slate-500">
                        <a 
                            href={'/LoginScreen'} 
                            className="text-blue-600 font-semibold hover:text-blue-800 transition"
                        >
                            Quay lại Đăng nhập
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}