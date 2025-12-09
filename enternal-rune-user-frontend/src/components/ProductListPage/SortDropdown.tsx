/**
 * SortDropdown.tsx
 * Dropdown for sorting products
 */

"use client"

import React from 'react'
import { useProductList, SortOption } from '@/context/ProductListContext'
import { ArrowUpDown } from 'lucide-react'

export default function SortDropdown() {
  const { sortOption, setSortOption } = useProductList()

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'Phổ biến nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến cao' },
    { value: 'price-desc', label: 'Giá: Cao đến thấp' },
    { value: 'newest', label: 'Mới nhất' }
  ]

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-5 h-5 text-gray-500" />
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value as SortOption)}
        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        aria-label="Sắp xếp sản phẩm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
