"use client";

import { useState, useCallback } from "react";
import productService from "@/services/productService";
import {
  ProductRequest,
  ProductDashboardResponse,
  ProductDashboardListResponse,
  ProductStatus,
  ProductFilterParams,
} from "@/types/product";

interface UseProductsReturn {
  // Data
  products: ProductDashboardListResponse[];
  statistics: ProductDashboardResponse | null;
  
  // Pagination
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  
  // States
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: (params?: ProductFilterParams) => Promise<void>;
  fetchStatistics: () => Promise<void>;
  addProduct: (product: ProductRequest) => Promise<void>;
  updateProduct: (id: number, product: ProductRequest) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  
  // Pagination & Filter helpers
  changePage: (page: number) => void;
  changePageSize: (size: number) => void;
  search: (keyword: string) => void;
  filterByBrand: (brand: string) => void;
  filterByStatus: (status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK") => void;
  resetFilters: () => void;
}

/**
 * Hook để quản lý products trong admin dashboard
 */
export function useProducts(
  initialParams: ProductFilterParams = {}
): UseProductsReturn {
  const [products, setProducts] = useState<ProductDashboardListResponse[]>([]);
  const [statistics, setStatistics] = useState<ProductDashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialParams.page ?? 0,
    size: initialParams.size ?? 8,
    totalPages: 0,
    totalElements: 0,
  });
  const [currentFilters, setCurrentFilters] = useState<ProductFilterParams>(
    initialParams
  );

  /**
   * Fetch danh sách sản phẩm
   */
  const fetchProducts = useCallback(async (params?: ProductFilterParams) => {
    setLoading(true);
    try {
      const mergedParams: ProductFilterParams = {
        ...currentFilters,
        ...params,
      };

      // Cập nhật currentFilters và pagination
      setCurrentFilters(mergedParams);
      if (mergedParams.page !== undefined) {
        setPagination((prev) => ({ ...prev, page: mergedParams.page! }));
      }
      if (mergedParams.size !== undefined) {
        setPagination((prev) => ({ ...prev, size: mergedParams.size! }));
      }

      const response = await productService.getAll(mergedParams);
      setProducts(response.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      }));
      setError(null);
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err);
      setProducts([]);
      setPagination((prev) => ({
        ...prev,
        totalPages: 0,
        totalElements: 0,
      }));
      setError(err.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [currentFilters, pagination.page, pagination.size]);

  /**
   * Fetch thống kê
   */
  const fetchStatistics = useCallback(async () => {
    try {
      const data = await productService.getStatistics();
      setStatistics(data);
    } catch (err: any) {
      console.error("Lỗi khi tải thống kê:", err);
      setStatistics(null);
    }
  }, []);

  /**
   * Thêm sản phẩm mới
   */
  const addProduct = useCallback(
    async (product: ProductRequest) => {
      try {
        setLoading(true);
        setError(null);
        await productService.add(product);
        // Refresh danh sách sau khi thêm
        await fetchProducts();
        await fetchStatistics();
      } catch (err: any) {
        setError(err.message || "Không thể thêm sản phẩm");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, fetchStatistics]
  );

  /**
   * Cập nhật sản phẩm
   */
  const updateProduct = useCallback(
    async (id: number, product: ProductRequest) => {
      try {
        setLoading(true);
        setError(null);
        await productService.update(id, product);
        // Refresh danh sách sau khi cập nhật
        await fetchProducts();
        await fetchStatistics();
      } catch (err: any) {
        setError(err.message || "Không thể cập nhật sản phẩm");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, fetchStatistics]
  );

  /**
   * Xóa sản phẩm
   */
  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        await productService.delete(id);
        // Refresh danh sách sau khi xóa
        await fetchProducts();
        await fetchStatistics();
      } catch (err: any) {
        setError(err.message || "Không thể xóa sản phẩm");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, fetchStatistics]
  );

  /**
   * Chuyển trang
   */
  const changePage = useCallback(
    (page: number) => {
      fetchProducts({ page });
    },
    [fetchProducts]
  );

  /**
   * Thay đổi kích thước trang
   */
  const changePageSize = useCallback(
    (size: number) => {
      fetchProducts({ page: 0, size });
    },
    [fetchProducts]
  );

  /**
   * Tìm kiếm
   */
  const search = useCallback(
    (keyword: string) => {
      fetchProducts({ page: 0, keyword });
    },
    [fetchProducts]
  );

  /**
   * Filter theo brand
   */
  const filterByBrand = useCallback(
    (brand: string) => {
      fetchProducts({ page: 0, brand });
    },
    [fetchProducts]
  );

  /**
   * Filter theo status
   */
  const filterByStatus = useCallback(
    (status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK") => {
      fetchProducts({ page: 0, status });
    },
    [fetchProducts]
  );

  /**
   * Reset tất cả filters
   */
  const resetFilters = useCallback(() => {
    setCurrentFilters({ page: 0, size: pagination.size });
    fetchProducts({ page: 0, size: pagination.size });
  }, [fetchProducts, pagination.size]);

  return {
    // Data
    products,
    statistics,
    pagination,

    // States
    loading,
    error,

    // Actions
    fetchProducts,
    fetchStatistics,
    addProduct,
    updateProduct,
    deleteProduct,

    // Helpers
    changePage,
    changePageSize,
    search,
    filterByBrand,
    filterByStatus,
    resetFilters,
  };
}
