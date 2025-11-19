"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProductListProvider, useProductList, FilterState } from '@/context/ProductListContext'
import FilterSidebar from '@/pages/ProductListPage/components/FilterSidebar'
import SortDropdown from '@/pages/ProductListPage/components/SortDropdown'
import SearchBar from '@/pages/ProductListPage/components/SearchBar'
import ProductGrid from '@/pages/ProductListPage/components/ProductGrid'
import Pagination from '@/pages/ProductListPage/components/Pagination'
import { Filter } from 'lucide-react'

const ProductListContent = () => {
  const { paginatedProducts, totalFilteredItems, applyFilters } = useProductList()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const searchParams = useSearchParams()

  // Load products based on URL query param or default
  useEffect(() => {
    const brandParam = searchParams?.get('brand')
    const filterState: FilterState = {
      brands: [],
      priceRanges: [],
      features: [],
      memory: [],
      colors: [],
      inStock: null
    }

    if (brandParam) {
      const brandId = parseInt(brandParam, 10)
      if (!isNaN(brandId)) {
        filterState.brands = [brandId]
      }
    }

    applyFilters(filterState)
  }, [searchParams, applyFilters])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto md:px-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Điện thoại di động</h1>
          <p className="text-gray-600">
            Hiển thị {totalFilteredItems} sản phẩm
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Mở bộ lọc"
          >
            <Filter className="w-5 h-5" />
            <span>Bộ lọc</span>
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <FilterSidebar />

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <FilterSidebar
              isMobile
              onClose={() => setShowMobileFilters(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Controls */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm gap-4">
              <div className="flex items-center justify-between gap-4 flex-1">
                {/* Search Bar */}
                <SearchBar />
                
                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sắp xếp theo:</span>
                  <SortDropdown />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid products={paginatedProducts} />

            {/* Pagination */}
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  )
}

export const ProductListPage = () => {
  return (
    <ProductListProvider>
      <ProductListContent />
    </ProductListProvider>
  )
}