'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getUserOrders } from '@/services/checkoutService'
import { Order } from '@/types/Order'
import OrderCard from './components/OrderCard'
import { Package, Loader2, AlertCircle } from 'lucide-react'
import { ShippingStatus } from '@/types/enums/ShippingStatus'
import { PaymentStatus } from '@/types/enums/PaymentStatus'

const OrderManagement = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<'all' | ShippingStatus>('all')
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const pageSize = 5

    // 🔵 Fetch Orders
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
                console.log(data.content)
                setOrders(data.content || [])
                setTotalPages(data.totalPages || 0)
                setTotalItems(data.totalItems || 0)
                setError(null)

            } catch (err: any) {
                setError(err.message || 'Không thể tải danh sách đơn hàng.')
                console.error('Error fetching orders:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [user, currentPage])

    // 🔵 Filter UI theo ShippingStatus từ API
    const filteredOrders =
        filterStatus === 'all'
            ? orders
            : orders.filter(order => order.currentShippingStatus.statusCode === filterStatus)

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
                        {[
                            { code: 'all', label: 'Tất cả' },
                            { code: ShippingStatus.PROCESSING, label: 'Đang xử lý' },
                            { code: ShippingStatus.SHIPPED, label: 'Đang giao' },
                            { code: ShippingStatus.DELIVERED, label: 'Đã giao' },
                            { code: ShippingStatus.CANCELLED, label: 'Đã hủy' },
                            { code: ShippingStatus.RETURNED, label: 'Đã trả hàng' }
                        ].map(tab => (
                            <button
                                key={tab.code}
                                onClick={() => setFilterStatus(tab.code as any)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${filterStatus === tab.code
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label}
                                {(() => {
                                    const count = orders.filter(o =>
                                        tab.code === 'all'
                                            ? true
                                            : o.currentShippingStatus.statusCode === tab.code
                                    ).length;

                                    return count > 0 ? ` (${count})` : "";
                                })()}

                            </button>
                        ))}
                    </div>
                </div>

                {/* Order List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Không có đơn hàng nào
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Không tìm thấy đơn hàng với trạng thái này.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {filteredOrders.map((order, index) => (
                                <OrderCard key={index} order={order} router={router} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    Trước
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`px-3 py-2 rounded-lg ${currentPage === i
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    Tiếp
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default OrderManagement
