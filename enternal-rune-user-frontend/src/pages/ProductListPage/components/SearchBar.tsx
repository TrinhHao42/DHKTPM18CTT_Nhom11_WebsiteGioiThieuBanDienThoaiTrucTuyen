/**
 * SearchBar.tsx
 * Search input component for product filtering
 */

"use client"

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useProductList } from '@/context/ProductListContext'
import { useDebouncedCallback } from 'use-debounce'

export default function SearchBar() {
  const { searchProducts, isLoading } = useProductList()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Debounced search function
  const debouncedSearch = useDebouncedCallback(async (term: string) => {
    if (term.trim()) {
      setIsSearching(true)
      try {
        await searchProducts(term)
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    } 
  }, 1000)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Xóa tìm kiếm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Loading indicator */}
      {(isSearching || isLoading) && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  )
}