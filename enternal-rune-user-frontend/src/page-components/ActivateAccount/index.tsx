// app/activate-account/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// 🔥 Giả định bạn đã tạo apiActivateAccount trong authService
import { apiActivateAccount } from '@/services/authService';

export default function ActivateAccountPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('Đang kích hoạt tài khoản...');
    const [success, setSuccess] = useState(false);

    const email = searchParams!.get('email') || '';
    const activateId = searchParams!.get('activateId') || '';


    useEffect(() => {
        if (email && activateId) {
            const activate = async () => {
                try {
                    const response = await apiActivateAccount(email, activateId);
                    setStatus('Kích hoạt tài khoản thành công! Bạn sẽ được chuyển hướng đến trang Đăng nhập.');
                    setSuccess(true);
                    setTimeout(() => {
                        router.push('/LoginScreen');
                    }, 3000);

                } catch (error: any) {
                    setStatus(`Kích hoạt thất bại: ${error.message || 'Mã kích hoạt không hợp lệ.'}`);
                    setSuccess(false);
                }
            };
            activate();
        } else if (!email || !activateId) {
            setStatus('Lỗi: Thiếu thông tin email hoặc mã kích hoạt.');
            setSuccess(false);
        }
    }, [email, activateId, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
            <h1 className={`text-3xl font-bold ${success ? 'text-green-600' : 'text-red-600'} mb-4`}>
                {success ? 'Thành Công' : 'Thất Bại'}
            </h1>
            <p className="text-gray-700 max-w-lg">
                {status}
            </p>
            {!success && (
                <button
                    onClick={() => router.push('/')}
                    className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
                >
                    Quay lại trang chủ
                </button>
            )}
        </div>
    );
}