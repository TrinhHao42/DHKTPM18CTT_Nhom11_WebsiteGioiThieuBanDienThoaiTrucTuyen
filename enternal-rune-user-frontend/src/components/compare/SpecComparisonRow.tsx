'use client'

import { Product } from '@/types/Product'
import {
  Camera,
  Cpu,
  Memory,
  Screen,
  Weight,
  Detail,
  FaSimCard,
  GrSystem,
  IoBatteryChargingOutline,
  LuMemoryStick,
  LuSmartphoneNfc
} from '@/lib/icons'

interface SpecComparisonRowProps {
  specKey: string
  products: Product[]
  displayMap: { [key: string]: string }
}

export const SpecComparisonRow = ({ specKey, products, displayMap }: SpecComparisonRowProps) => {
  const getSpecValue = (product: Product, specKey: string): string => {
    return product.prodSpecs?.[specKey]?.toString() || 'Không có thông tin'
  }

  // Chọn icon phù hợp với từng thông số (giống SpecificationsSection)
  const getIcon = (key: string) => {
    const lower = key.toLowerCase()
    if (lower.includes('cpu')) return <Cpu className="w-5 h-5 text-blue-500" />
    if (lower.includes('camera')) return <Camera className="w-5 h-5 text-green-500" />
    if (lower.includes('bộ nhớ') || lower.includes('storage') || lower.includes('memory')) return <Memory className="w-5 h-5 text-purple-500" />
    if (lower.includes('kích thước màn hình') || lower.includes('screen') || lower.includes('display')) return <Screen className="w-5 h-5 text-orange-500" />
    if (lower.includes('ram')) return <LuMemoryStick className="w-5 h-5 text-yellow-500" />
    if (lower.includes('trọng lượng') || lower.includes('weight')) return <Weight className="w-5 h-5 text-red-500" />
    if (lower.includes('sim')) return <FaSimCard className="w-5 h-5 text-pink-500" />
    if (lower.includes('hệ điều hành') || lower.includes('os')) return <GrSystem className="w-5 h-5 text-teal-500" />
    if (lower.includes('pin') || lower.includes('battery')) return <IoBatteryChargingOutline className="w-5 h-5 text-indigo-500" />
    if (lower.includes('nfc')) return <LuSmartphoneNfc className="w-5 h-5 text-cyan-500" />
    return <Detail className="w-5 h-5 text-gray-400" />
  }

  return (
    <div
      className={`grid ${products.length === 1 ? 'grid-cols-2' : products.length === 2 ? 'grid-cols-3' : 'grid-cols-4'} gap-0 group hover:bg-gray-50 transition-colors duration-200`}
    >
      {/* Spec Name Column */}
      <div className="p-6 bg-gray-50 group-hover:bg-blue-50 flex items-center font-semibold text-gray-900 border-r border-gray-200 transition-colors duration-200">
        <div className="flex items-center">
          <div className="mr-3 opacity-70 group-hover:opacity-100 transition-opacity">
            {getIcon(specKey)}
          </div>
          <span className="group-hover:text-blue-700 transition-colors">
            {displayMap[specKey] || specKey}
          </span>
        </div>
      </div>

      {/* Product Values */}
      {products.map((product, index) => (
        <div
          key={`${specKey}-${product.prodId}`}
          className={`p-6 text-gray-700 ${index > 0 ? 'border-l border-gray-200' : ''} ${index === 0 ? 'bg-blue-50/50 group-hover:bg-blue-100/50' : 'bg-white group-hover:bg-gray-50'} transition-all duration-200`}
        >
          <div className="relative">
            <span className={`font-medium ${index === 0 ? 'text-blue-800' : 'text-gray-800'} group-hover:text-gray-900 transition-colors`}>
              {getSpecValue(product, specKey)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}