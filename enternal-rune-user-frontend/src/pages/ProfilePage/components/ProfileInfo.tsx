import React from 'react'
import { Mail, User as UserIcon, Calendar, Edit2 } from 'lucide-react'
import { User } from '@/types/User'

export const ProfileInfo: React.FC<{ user: User }> = ({ user }) => {
  const memberSince = new Date().getFullYear() - 1 // Mock data

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Thông tin cá nhân
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Edit2 className="w-4 h-4" />
            <span className="text-sm font-medium">Chỉnh sửa</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Name */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
            <p className="text-base font-semibold text-gray-900">{user.userName}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="p-2 bg-green-100 rounded-lg">
            <Mail className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-base font-semibold text-gray-900">{user.userEmail}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Đã xác thực
            </span>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Thành viên từ</p>
            <p className="text-base font-semibold text-gray-900">{memberSince}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
