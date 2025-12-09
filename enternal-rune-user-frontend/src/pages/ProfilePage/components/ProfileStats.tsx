import React from 'react'
import { Package, MapPin, Calendar, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface ProfileStatsProps {
  totalOrders: number
  totalAddresses: number
  memberSince: string
  loading?: boolean
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({
  totalOrders,
  totalAddresses,
  memberSince,
  loading = false,
}) => {
    const stats = [
      {
        label: 'Xem đơn hàng',
        value: totalOrders.toString() + ' đơn hàng đã đặt',
        icon: Package,
        color: 'blue',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-200',
        href: "/OrderManagementScreen"
      },
      {
        label: 'Địa chỉ',
        value: totalAddresses.toString() + ' địa chỉ',
        icon: MapPin,
        color: 'green',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
        borderColor: 'border-green-200',
        href: "#"
      },
      {
        label: 'Điểm tích lũy',
        value: (totalOrders * 100).toString() + ' điểm',
        icon: TrendingUp,
        color: 'orange',
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-600',
        borderColor: 'border-orange-200',
      },
    ]

    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={index}
              href={stat.href || "#"}
              className={`bg-white border ${stat.borderColor} rounded-xl px-5 py-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                {loading ? (
                  <div className="h-6 w-24 animate-pulse bg-gray-200 rounded" />
                ) : (
                  <p className="text-lg font-bold text-gray-700">
                    {stat?.value}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    )
  }
