'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Settings, Shield, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/useToast'
import { ProfileHeader } from './components/ProfileHeader'
import { ProfileInfo } from './components/ProfileInfo'
import { ProfileStats } from './components/ProfileStats'
import { AddressList } from './components/AddressList'
import { AddAddressModal } from './components/AddAddressModal'
import { Address } from '@/types/Address'
import { apiGetUserProfile, UserProfile } from '@/services/authService'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, addUserAddress } = useAuth()
  const toast = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/LoginScreen')
      return
    }

    // Fetch user profile from API
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true)
        const token = localStorage.getItem('token')
        if (token && user.userId) {
          const profile = await apiGetUserProfile(user.userId, token)
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [user, router])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      logout()
      toast.success('Đăng xuất thành công!')
      router.push('/')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleAddAddress = () => {
    setIsAddModalOpen(true)
  }

  const handleAddAddressSubmit = async (address: {
    streetName: string
    wardName: string
    cityName: string
    countryName: string
  }) => {
    try {
      await addUserAddress(address)
      toast.success('Đã thêm địa chỉ mới thành công!')
    } catch (error: any) {
      toast.error(error.message || 'Không thể thêm địa chỉ')
      throw error
    }
  }

  const handleEditAddress = (address: Address) => {
    toast.info('Chức năng chỉnh sửa địa chỉ đang được phát triển')
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return
    }
    
    try {
      // TODO: Implement delete address API
      toast.info('Chức năng xóa địa chỉ đang được phát triển')
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa địa chỉ')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  const memberSince = new Date().getFullYear() - 1 // Mock data

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <ProfileHeader user={user} />
        </div>

        {/* Stats */}
        <div className="mb-8">
          <ProfileStats
            totalOrders={userProfile?.totalOrder ?? 0}
            totalAddresses={user.userAddress.length}
            memberSince={memberSince.toString()}
            loading={isLoadingProfile}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileInfo user={user} isVerified={userProfile?.activate ?? false} loading={isLoadingProfile} />

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">
                  Hành động nhanh
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Cài đặt tài khoản
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Bảo mật
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Bell className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Thông báo
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="p-2 bg-red-100 rounded-lg">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-red-700">
                    {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Address List */}
          <div className="lg:col-span-2">
            <AddressList
              addresses={user.userAddress}
              onAddAddress={handleAddAddress}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
            />
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAddressSubmit}
      />
    </div>
  )
}
