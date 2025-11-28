'use client'

export const LoadingState = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="relative mb-6">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải dữ liệu so sánh</h3>
                <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
            </div>
        </div>
    )
}