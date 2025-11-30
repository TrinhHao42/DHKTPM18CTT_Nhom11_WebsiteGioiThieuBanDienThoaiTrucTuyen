'use client';

import { useState, useCallback } from 'react';
import brandService from '@/services/brandService';
import { BrandDashboardListResponse, BrandRequest, BrandStatisticResponse } from '@/types/brand';

interface UseBrandsReturn {
  brands: BrandDashboardListResponse[];
  loading: boolean;
  error: string | null;
  statistics: BrandStatisticResponse | null;
  statisticsLoading: boolean;
  pagination: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
  
  fetchBrands: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  addBrand: (brand: BrandRequest) => Promise<void>;
  updateBrand: (id: number, brand: BrandRequest) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;
  search: (keyword: string) => void;
  changePage: (page: number) => void;
}

export function useBrands(initialPage: number = 0, initialSize: number = 8): UseBrandsReturn {
  const [brands, setBrands] = useState<BrandDashboardListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<BrandStatisticResponse | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: initialPage,
    size: initialSize,
    totalPages: 0,
    totalElements: 0,
  });
  const [keyword, setKeyword] = useState<string>('');

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const response = await brandService.getDashboard(
        keyword || undefined,
        pagination.page,
        pagination.size
      );
      setBrands(response.content);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      }));
      setError(null);
    } catch (err: any) {
      console.error('Lỗi khi tải danh sách thương hiệu:', err);
      setBrands([]);
      setPagination((prev) => ({
        ...prev,
        totalPages: 0,
        totalElements: 0,
      }));
      setError(err.message || 'Không thể tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  }, [keyword, pagination.page, pagination.size]);

  const fetchStatistics = useCallback(async () => {
    setStatisticsLoading(true);
    try {
      const response = await brandService.getStatistics();
      setStatistics(response);
    } catch (err: any) {
      console.error('Lỗi khi tải thống kê thương hiệu:', err);
      setStatistics(null);
    } finally {
      setStatisticsLoading(false);
    }
  }, []);

  const addBrand = useCallback(
    async (brand: BrandRequest) => {
      try {
        setLoading(true);
        setError(null);
        await brandService.add(brand);
        await fetchBrands();
      } catch (err: any) {
        setError(err.message || 'Không thể thêm thương hiệu');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchBrands]
  );

  const updateBrand = useCallback(
    async (id: number, brand: BrandRequest) => {
      try {
        setLoading(true);
        setError(null);
        await brandService.update(id, brand);
        await fetchBrands();
      } catch (err: any) {
        setError(err.message || 'Không thể cập nhật thương hiệu');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchBrands]
  );

  const deleteBrand = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        await brandService.delete(id);
        // Optimistic update: xóa brand khỏi state ngay lập tức
        setBrands((prevBrands) => prevBrands.filter((brand) => brand.brandId !== id));
        setPagination((prev) => ({
          ...prev,
          totalElements: Math.max(0, prev.totalElements - 1),
        }));
      } catch (err: any) {
        setError(err.message || 'Không thể xóa thương hiệu');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const search = useCallback((searchKeyword: string) => {
    setKeyword(searchKeyword);
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  return {
    brands,
    loading,
    error,
    statistics,
    statisticsLoading,
    pagination,
    fetchBrands,
    fetchStatistics,
    addBrand,
    updateBrand,
    deleteBrand,
    search,
    changePage,
  };
}
