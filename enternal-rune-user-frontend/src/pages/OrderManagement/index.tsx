'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getUserOrders } from '@/services/checkoutService'
import { Order } from '@/types/Order'
import { PaymentStatus } from '@/types/enums/PaymentStatus'
import OrderCard from './components/OrderCard'
import { Package, Loader2, AlertCircle } from 'lucide-react'

const OrderManagement = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all')
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const pageSize = 5

    // Fetch real orders from backend
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.userId) {
                setError('Vui lòng đăng nhập để xem đơn hàng');
                setLoading(false);
                return;
            }

            try {
                setLoading(true)
                const data = await getUserOrders(user.userId, currentPage, pageSize);
                setOrders(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalItems(data.totalItems || 0);
                setError(null)
            } catch (err: any) {
                setError(err.message || 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.')
                console.error('Error fetching orders:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [user, currentPage])

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter(order => order.orderPaymentStatus === filterStatus)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-gray-600">Đang tải đơn hàng...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Quản lý đơn hàng
                    </h1>
                    <p className="text-gray-600">
                        Theo dõi và quản lý tất cả đơn hàng của bạn
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                filterStatus === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Tất cả ({orders.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus(PaymentStatus.PENDING)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                filterStatus === PaymentStatus.PENDING
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Chờ thanh toán ({orders.filter(o => o.orderPaymentStatus === PaymentStatus.PENDING).length})
                        </button>
                        <button
                            onClick={() => setFilterStatus(PaymentStatus.PAID)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                filterStatus === PaymentStatus.PAID
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Đã thanh toán ({orders.filter(o => o.orderPaymentStatus === PaymentStatus.PAID).length})
                        </button>
                        <button
                            onClick={() => setFilterStatus(PaymentStatus.FAILED)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                filterStatus === PaymentStatus.FAILED
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Thất bại ({orders.filter(o => o.orderPaymentStatus === PaymentStatus.FAILED).length})
                        </button>
                        <button
                            onClick={() => setFilterStatus(PaymentStatus.REFUNDED)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                filterStatus === PaymentStatus.REFUNDED
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Đã hoàn tiền ({orders.filter(o => o.orderPaymentStatus === PaymentStatus.REFUNDED).length})
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Không có đơn hàng nào
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {filterStatus === 'all' 
                                ? 'Bạn chưa có đơn hàng nào.'
                                : 'Không tìm thấy đơn hàng với trạng thái này.'}
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {filteredOrders.map((order, index) => (
                                <OrderCard key={index} order={order} router={router} />
                            ))}
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Trước
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {page + 1}
                                        </button>
                                    ))}
                                </div>
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Tiếp
                                </button>
                            </div>
                        )}
                        
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Hiển thị {orders.length} / {totalItems} đơn hàng
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default OrderManagement
