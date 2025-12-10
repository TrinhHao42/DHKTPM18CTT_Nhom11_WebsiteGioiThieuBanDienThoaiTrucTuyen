// app/activate-account/page.tsx
'use client'
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiActivateAccount } from '@/services/authService';

export default function ActivateAccountPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const email = useMemo(() => searchParams.get('email'), [searchParams]);
    const activateId = useMemo(() => searchParams.get('activateId'), [searchParams]);

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [status, setStatus] = useState('Đang xử lý...');

    useEffect(() => {
        if (!email || !activateId) {
            setStatus('Thiếu thông tin email hoặc mã kích hoạt.');
            setSuccess(false);
            setLoading(false);
            return;
        }

        const activate = async () => {
            try {
                const res = await apiActivateAccount(email, activateId);

                setSuccess(true);
                setStatus('Kích hoạt tài khoản thành công! Đang chuyển hướng...');
                setLoading(false);

                setTimeout(() => {
                    router.push('/LoginScreen');
                }, 2500);

            } catch (error: any) {

                const errMsg =
                    error?.response?.data?.message ||
                    error?.message ||
                    'Mã kích hoạt không hợp lệ hoặc đã hết hạn.';

                setSuccess(false);
                setStatus(`Kích hoạt thất bại: ${errMsg}`);
                setLoading(false);
            }
        };

        activate();
    }, [email, activateId, router]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
            
            {/* Title */}
            <h1
                className={`text-3xl font-bold mb-4 ${
                    success ? 'text-green-600' : success === false ? 'text-red-600' : 'text-blue-600'
                }`}
            >
                {loading ? 'Đang xử lý...' : success ? 'Thành Công' : 'Thất Bại'}
            </h1>

            {/* Status */}
            <p className="text-gray-700 max-w-lg">{status}</p>

            {/* Button when failed */}
            {!loading && success === false && (
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
