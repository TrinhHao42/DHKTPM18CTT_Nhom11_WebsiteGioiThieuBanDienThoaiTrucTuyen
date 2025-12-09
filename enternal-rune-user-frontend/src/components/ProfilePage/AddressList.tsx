import React from 'react'
import { Plus } from 'lucide-react'
import AddressCard from './AddressCard'
import { Address } from '@/types/Address'

const AddressList: React.FC<{
  addresses: Address[]
  onAddAddress: () => void
  onEditAddress: (address: Address) => void
  onDeleteAddress: (addressId: string) => void
}> = ({
  addresses,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Địa chỉ của tôi
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý địa chỉ giao hàng của bạn
            </p>
          </div>
          <button
            onClick={onAddAddress}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Thêm địa chỉ</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">
              Bạn chưa có địa chỉ nào
            </p>
            <button
              onClick={onAddAddress}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm địa chỉ đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address: Address, index: number) => (
              <AddressCard
                key={address.addressId}
                address={address}
                isDefault={index === 0}
                onEdit={onEditAddress}
                onDelete={onDeleteAddress}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressList