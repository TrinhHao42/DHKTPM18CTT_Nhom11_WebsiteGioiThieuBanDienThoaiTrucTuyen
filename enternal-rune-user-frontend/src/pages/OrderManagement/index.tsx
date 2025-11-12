'use client'
import React, { useState, useEffect } from 'react'
import { Order } from '@/types/Order'
import { PaymentStatus } from '@/types/enums/PaymentStatus'
import { ShippingStatus } from '@/types/enums/ShippingStatus'
import OrderCard from './components/OrderCard'
import { Package, Loader2, AlertCircle } from 'lucide-react'

const OrderManagement = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all')

    // Mock data - Replace with actual API call
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                // TODO: Replace with actual API call
                // const response = await axios.get('/api/orders')
                
                // Mock data for demonstration
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                const mockOrders: Order[] = [
                    {
                        orderUser: {
                            userId: 1,
                            userName: 'Nguyễn Văn A',
                            userEmail: 'user@example.com',
                        } as any,
                        orderDate: new Date('2025-11-01'),
                        orderTotalPrice: 25000000,
                        orderShippingAddress: {
                            addressId: '1',
                            streetName: '123 Nguyễn Huệ',
                            wardName: 'Phường Bến Nghé',
                            cityName: 'Quận 1, TP. Hồ Chí Minh',
                            countryName: 'Việt Nam',
                        },
                        orderPaymentStatus: PaymentStatus.PENDING,
                        orderShippingStatus: ShippingStatus.PENDING,
                        orderListDetails: []
                    },
                    {
                        orderUser: {
                            userId: 1,
                            userName: 'Nguyễn Văn A',
                            userEmail: 'user@example.com',
                        } as any,
                        orderDate: new Date('2025-10-28'),
                        orderTotalPrice: 15000000,
                        orderShippingAddress: {
                            addressId: '1',
                            streetName: '123 Nguyễn Huệ',
                            wardName: 'Phường Bến Nghé',
                            cityName: 'Quận 1, TP. Hồ Chí Minh',
                            countryName: 'Việt Nam',
                        },
                        orderPaymentStatus: PaymentStatus.PAID,
                        orderShippingStatus: ShippingStatus.SHIPPED,
                        orderListDetails: []
                    },
                    {
                        orderUser: {
                            userId: 1,
                            userName: 'Nguyễn Văn A',
                            userEmail: 'user@example.com',
                        } as any,
                        orderDate: new Date('2025-10-25'),
                        orderTotalPrice: 8000000,
                        orderShippingAddress: {
                            addressId: '1',
                            streetName: '123 Nguyễn Huệ',
                            wardName: 'Phường Bến Nghé',
                            cityName: 'Quận 1, TP. Hồ Chí Minh',
                            countryName: 'Việt Nam',
                        },
                        orderPaymentStatus: PaymentStatus.FAILED,
                        orderShippingStatus: ShippingStatus.CANCELLED,
                        orderListDetails: []
                    },
                    {
                        orderUser: {
                            userId: 1,
                            userName: 'Nguyễn Văn A',
                            userEmail: 'user@example.com',
                        } as any,
                        orderDate: new Date('2025-10-20'),
                        orderTotalPrice: 12000000,
                        orderShippingAddress: {
                            addressId: '1',
                            streetName: '123 Nguyễn Huệ',
                            wardName: 'Phường Bến Nghé',
                            cityName: 'Quận 1, TP. Hồ Chí Minh',
                            countryName: 'Việt Nam',
                        },
                        orderPaymentStatus: PaymentStatus.REFUNDED,
                        orderShippingStatus: ShippingStatus.RETURNED,
                        orderListDetails: []
                    }
                ]
                
                setOrders(mockOrders)
                setError(null)
            } catch (err) {
                setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.')
                console.error('Error fetching orders:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [])

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
                    <div className="space-y-4">
                        {filteredOrders.map((order, index) => (
                            <OrderCard key={index} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderManagement
