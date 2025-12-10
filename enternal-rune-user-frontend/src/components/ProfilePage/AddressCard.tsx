import React from 'react'
import { MapPin, Edit2, Trash2 } from 'lucide-react'
import { Address } from '@/types/Address'

const AddressCard: React.FC<{
  address: Address
  isDefault?: boolean
  onEdit: (address: Address) => void
  onDelete: (addressId: string) => void
}> = ({
  address,
  isDefault = false,
  onEdit,
  onDelete,
}) => {
  const fullAddress = `${address.streetName}, ${address.wardName}, ${address.cityName}, ${address.countryName}`

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
      {isDefault && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
            Mặc định
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-base font-medium text-gray-900 mb-2 break-words">
            {fullAddress}
          </p>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => onEdit(address)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Chỉnh sửa
            </button>
            <button
              onClick={() => onDelete(address.addressId)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressCard