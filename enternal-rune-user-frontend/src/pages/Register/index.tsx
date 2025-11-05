'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { apiRegister } from "@/services/authService";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Giả lập API call
            // await apiRegister({ name, email, password });
            alert("Đăng ký thành công! Hãy đăng nhập để bắt đầu trải nghiệm.");
            router.push("/LoginScreen");
        } catch (err: any) { // Đảm bảo bắt lỗi đúng kiểu
            alert(err.message || "Đăng ký thất bại");
        } finally { setLoading(false); }
    };

    return (
        // Nền sáng nhẹ nhàng, thân thiện
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
            
            <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-100">
                
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                    Tạo Tài Khoản Mới 📝
                </h2>
                <p className="text-center text-slate-500 mb-8">
                    Tham gia **TechZone** để nhận các ưu đãi độc quyền.
                </p>

                <form onSubmit={handle} className="space-y-5">
                    
                    {/* Input: Họ và tên */}
                    <input 
                        className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400" 
                        placeholder="Họ và tên" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required
                    />
                    
                    {/* Input: Email */}
                    <input 
                        className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400" 
                        type="email" 
                        placeholder="Địa chỉ Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    
                    {/* Input: Mật khẩu */}
                    <input 
                        className="w-full p-4 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition duration-150 text-slate-700 placeholder:text-slate-400" 
                        placeholder="Mật khẩu (Tối thiểu 6 ký tự)" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                    
                    {/* Button: Đăng ký */}
                    <button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-4 rounded-xl shadow-lg shadow-blue-500/30 transition duration-300 ease-in-out transform hover:scale-[1.005] active:scale-100 disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                    </button>
                    
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-slate-500">
                        Bạn đã có tài khoản? 
                        <a 
                            href={'/LoginScreen'} 
                            className="text-blue-600 font-semibold hover:text-blue-700 ml-1 transition"
                        >
                            Đăng nhập ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}