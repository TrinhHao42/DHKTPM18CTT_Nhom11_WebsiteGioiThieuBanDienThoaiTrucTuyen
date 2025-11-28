'use client'
import React from 'react'
import { Camera, Cpu, Memory, Screen, Weight, Detail, FaSimCard, GrSystem, IoBatteryChargingOutline, LuMemoryStick, LuSmartphoneNfc }from '@/lib/icons'

interface SpecificationsSectionProps {
  specifications: Record<string, string>
}

export default function SpecificationsSection({ specifications }: SpecificationsSectionProps) {
  const specEntries = Object.entries(specifications)

  // Chọn icon phù hợp với từng thông số
  const getIcon = (key: string) => {
    const lower = key.toLowerCase()
    if (lower.includes('cpu')) return <Cpu className="w-6 h-6 text-blue-500" />
    if (lower.includes('camera')) return <Camera className="w-6 h-6 text-green-500" />
    if (lower.includes('bộ nhớ')) return <Memory className="w-6 h-6 text-purple-500" />
    if (lower.includes('kích thước màn hình')) return <Screen className="w-6 h-6 text-orange-500" />
    if (lower.includes('ram')) return <LuMemoryStick className="w-6 h-6 text-yellow-500" />
    if (lower.includes('trọng lượng')) return <Weight className="w-6 h-6 text-red-500" />
    if (lower.includes('sim')) return <FaSimCard className="w-6 h-6 text-pink-500" />
    if (lower.includes('hệ điều hành') || lower.includes('os')) return <GrSystem className="w-6 h-6 text-teal-500" />
    if (lower.includes('pin')) return <IoBatteryChargingOutline className="w-6 h-6 text-indigo-500" />
    if (lower.includes('nfc')) return <LuSmartphoneNfc className="w-6 h-6 text-cyan-500" />
    return <Detail className="w-6 h-6 text-gray-400" />
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 rounded-t-2xl">
        <h2 className="text-2xl font-bold text-gray-900">Thông số kỹ thuật</h2>
        <p className="text-gray-600 mt-2">
          Chi tiết thông số và đặc điểm nổi bật của sản phẩm
        </p>
      </div>

      {/* Danh sách thông số */}
      <div className="grid md:grid-cols-4 gap-4 py-6">
        {specEntries.map(([key, value]) => (
          <div key={key} className="group">
            <div className="bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">
                    {key}
                  </dt>
                  <dd
                    title={String(value)}
                    className="text-sm font-semibold text-gray-900 group-hover:text-blue-800 transition-colors line-clamp-1 overflow-hidden"
                  >
                    {value === null ? 'Chưa xác định' : value}
                  </dd>
                </div>
                <div className="ml-3 opacity-70 group-hover:opacity-100 transition-opacity">
                  {getIcon(key)}
                </div>
              </div>

              {/* Thanh nhấn mạnh cho thông số nổi bật */}
              {(key.toLowerCase().includes('cpu') ||
                key.toLowerCase().includes('ram') ||
                key.toLowerCase().includes('camera')) && (
                  <div className="mt-3 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Thông tin bổ sung */}
      <div className="bg-blue-50 rounded-2xl p-6 mt-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold text-blue-800">
            Sản phẩm đã được chứng nhận
          </span>
        </div>
        <p className="text-blue-700 text-sm">
          Tất cả thông số kỹ thuật đã được xác minh và chứng nhận bởi nhà sản xuất.
        </p>
      </div>
    </div>
  )
}
