'use client'
import { useState } from "react";
import { apiSendResetCode } from "@/services/authService";
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Giả lập API call
            // await apiSendResetCode(email);
            alert("Yêu cầu đã được gửi. Vui lòng kiểm tra email của bạn để nhận mã khôi phục.");
            router.push(`/ResetPasswordScreen?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            alert(err.message || "Không thể gửi mã khôi phục. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // Nền sáng nhẹ nhàng, nhất quán với các màn hình khác
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4 py-10">
            
            <div className="w-full max-w-sm bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
                
                {/* Tiêu đề & Mô tả */}
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                    Quên Mật Khẩu? 🔒
                </h2>
                <p className="text-center text-slate-500 mb-8 text-base">
                    Nhập email đã đăng ký để chúng tôi gửi mã khôi phục cho bạn.
                </p>

                <form onSubmit={handle} className="space-y-5">
                    
                    {/* Input: Email */}
                    <input 
                        className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400 text-lg" 
                        type="email"
                        placeholder="Địa chỉ Email của bạn" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    
                    {/* Button: Gửi mã */}
                    <button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-xl shadow-lg shadow-blue-500/30 transition duration-300 ease-in-out transform hover:scale-[1.005] active:scale-100 disabled:bg-blue-400"
                        disabled={loading || !email}
                    >
                        {loading ? "Đang gửi..." : "Gửi Mã Khôi Phục"}
                    </button>
                    
                </form>

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