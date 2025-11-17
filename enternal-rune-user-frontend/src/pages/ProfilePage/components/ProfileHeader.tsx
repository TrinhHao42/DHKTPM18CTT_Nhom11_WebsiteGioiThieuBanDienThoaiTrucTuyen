import React from 'react'
import { User as UserIcon, Camera } from 'lucide-react'
import { User } from '@/types/User'

export const ProfileHeader: React.FC<{ user: User }> = ({ user }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-8 shadow-lg">
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      
      <div className="relative flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-xl">
            <span className="text-4xl font-bold text-white">
              {getInitials(user.userName)}
            </span>
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all group-hover:scale-110">
            <Camera className="w-4 h-4 text-blue-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">
            {user.userName}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-blue-50">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{user.userEmail}</span>
            </div>
            <div className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg">
              <span className="text-sm font-medium">ID: #{user.userId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
