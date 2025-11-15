/**
 * ProductListContext.tsx
 * Context provider for product list page - manages products, filters, sorting, and pagination
 */

"use client"

import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect, useCallback } from 'react'
import { Product } from '@/types/Product'
import { ProductService, FilterParams } from '@/services/productService'

// Filter state interface
export interface FilterState {
  brands: number[]
  priceRanges: string[]
  features: string[]
  memory: string[]
  colors: string[]
  inStock: boolean | null
}

// Sort options
export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'newest'

interface ProductListContextType {
  products: Product[]
  filteredProducts: Product[]
  paginatedProducts: Product[]
  filters: FilterState
  setFilters: (filters: FilterState) => void
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
  itemsPerPage: number
  totalFilteredItems: number
  isLoading: boolean
  error: string | null
  applyFilters: (filterState: FilterState) => Promise<void>
  resetFilters: () => void
  searchProducts: (searchTerm: string) => Promise<void>
  clearSearch: () => Promise<void>
  searchTerm: string
}

const ProductListContext = createContext<ProductListContextType | undefined>(undefined)

interface ProductListProviderProps {
  children: ReactNode
}

export const ProductListProvider = ({ children }: ProductListProviderProps) => {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    priceRanges: [],
    features: [],
    memory: [],
    colors: [],
    inStock: null
  })

  const [sortOption, setSortOption] = useState<SortOption>('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiProducts, setApiProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 6

  // Apply filters via API
  const applyFilters = useCallback(async (filterState: FilterState) => {
    setIsLoading(true)
    setError(null)

    try {
      // Kiểm tra có filter nào được áp dụng không
      const hasFilters =
        filterState.brands.length > 0 ||
        filterState.priceRanges.length > 0 ||
        filterState.colors.length > 0 ||
        filterState.memory.length > 0

      if (hasFilters) {
        // Gọi API để filter
        const filterParams: FilterParams = {
          brands: filterState.brands.length > 0 ? filterState.brands : undefined,
          priceRange: filterState.priceRanges.length > 0 ? filterState.priceRanges : undefined,
          colors: filterState.colors.length > 0 ? filterState.colors : undefined,
          memory: filterState.memory.length > 0 ? filterState.memory : undefined,
          page: 0,
          size: 100
        }

        const result = await ProductService.getFilteredProducts(filterParams)
        setApiProducts(result)
      } else {
        // No filters: fetch default product list from API
        const result = await ProductService.getFilteredProducts({ page: 0, size: 100 })
        setApiProducts(result)
      }

      setFilters(filterState)
      setCurrentPage(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lọc sản phẩm')
      console.error('Error applying filters:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    const resetState: FilterState = {
      brands: [],
      priceRanges: [],
      features: [],
      memory: [],
      colors: [],
      inStock: null
    }

    setFilters(resetState)
    setSearchTerm('')
    // Reset triggers refetch of default API list
    ProductService.getFilteredProducts({ page: 1, size: 100 })
      .then(setApiProducts)
      .catch(err => setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi'))
    setCurrentPage(1)
    setError(null)
  }, [])

  // Search products
  const searchProducts = useCallback(async (search: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const filterParams: FilterParams = {
        search: search,
        brands: filters.brands.length > 0 ? filters.brands : undefined,
        priceRange: filters.priceRanges.length > 0 ? filters.priceRanges : undefined,
        colors: filters.colors.length > 0 ? filters.colors : undefined,
        memory: filters.memory.length > 0 ? filters.memory : undefined,
        page: 0,
        size: 100
      }

      const result = await ProductService.getFilteredProducts(filterParams)
      setApiProducts(result)
      setSearchTerm(search)
      setCurrentPage(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tìm kiếm sản phẩm')
      console.error('Error searching products:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  // Clear search
  const clearSearch = useCallback(async () => {
    setSearchTerm('')
    
    try {
      // Apply existing filters without search
      await applyFilters(filters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
      console.error('Error clearing search:', err)
    }
  }, [filters, applyFilters])

  // Chọn products để sử dụng (API hoặc local)
  const activeProducts = apiProducts

  // Initial load: fetch default products from API
  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    ProductService.getFilteredProducts({ page: 0, size: 100 })
      .then(data => {
        if (!mounted) return
        setApiProducts(data)
      })
      .catch(err => {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải sản phẩm')
      })
      .finally(() => {
        if (!mounted) return
        setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  // When using API-only, server returns filtered products. Use server results as-is.
  const filteredProducts = useMemo(() => {
    return [...activeProducts]
  }, [activeProducts])

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]

    switch (sortOption) {
      case 'price-asc':
        return sorted.sort((a, b) => (a.productPrices?.[0].ppPrice || 0) - (b.productPrices?.[0].ppPrice || 0))
      case 'price-desc':
        return sorted.sort((a, b) => (b.productPrices?.[0].ppPrice || 0) - (a.productPrices?.[0].ppPrice || 0))
      case 'newest':
        return sorted.sort((a, b) => Number(b.prodId) - Number(a.prodId))
      case 'popular':
      default:
        return sorted.sort((a, b) => (b.prodRating || 0) - (a.prodRating || 0))
    }
  }, [filteredProducts, sortOption])

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedProducts.slice(startIndex, endIndex)
  }, [sortedProducts, currentPage, itemsPerPage])

  // Reset to page 1 when filters or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortOption])

  const value: ProductListContextType = {
    products: activeProducts,
    filteredProducts: sortedProducts,
    paginatedProducts,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    totalFilteredItems: sortedProducts.length,
    isLoading,
    error,
    applyFilters,
    resetFilters,
    searchProducts,
    clearSearch,
    searchTerm
  }

  return (
    <ProductListContext.Provider value={value}>
      {children}
    </ProductListContext.Provider>
  )
}

// Custom hook
export const useProductList = (): ProductListContextType => {
  const context = useContext(ProductListContext)
  if (!context) {
    throw new Error('useProductList must be used within ProductListProvider')
  }
  return context
}
