import React from 'react'
import { Package, MapPin, Calendar, TrendingUp } from 'lucide-react'

export const ProfileStats: React.FC<{
  totalOrders: number
  totalAddresses: number
  memberSince: string
}> = ({
  totalOrders,
  totalAddresses,
  memberSince,
}) => {
  const stats = [
    {
      label: 'Tổng đơn hàng',
      value: totalOrders.toString(),
      icon: Package,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Địa chỉ',
      value: totalAddresses.toString(),
      icon: MapPin,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      label: 'Thành viên từ',
      value: memberSince,
      icon: Calendar,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Điểm tích lũy',
      value: (totalOrders * 100).toString(),
      icon: TrendingUp,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className={`bg-white border ${stat.borderColor} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 ${stat.bgColor} rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {stat.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
