import { useState, useCallback } from 'react';
import {
  UserDashboardResponse,
  UserStatisticsResponse,
} from '@/types/customer';
import { customerService } from '@/services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<UserDashboardResponse[]>([]);
  const [statistics, setStatistics] = useState<UserStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await customerService.getStatistics();
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomers = useCallback(
    async (keyword?: string, activated?: boolean | null, page: number = 0) => {
      try {
        setLoading(true);
        setError(null);
        const data = await customerService.getDashboard(keyword, activated, page, pageSize);
        setCustomers(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setCurrentPage(data.number);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch customers');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  const deleteCustomer = useCallback(
    async (id: number, keyword?: string, activated?: boolean | null) => {
      try {
        setLoading(true);
        setError(null);
        await customerService.deleteCustomer(id);
        // Refresh the list after deletion
        await fetchCustomers(keyword, activated, currentPage);
        // Refresh statistics
        await fetchStatistics();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete customer');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomers, fetchStatistics, currentPage]
  );

  const search = useCallback(
    (keyword?: string, activated?: boolean | null) => {
      setCurrentPage(0);
      fetchCustomers(keyword, activated, 0);
    },
    [fetchCustomers]
  );

  const changePage = useCallback(
    (page: number, keyword?: string, activated?: boolean | null) => {
      fetchCustomers(keyword, activated, page);
    },
    [fetchCustomers]
  );

  return {
    customers,
    statistics,
    loading,
    error,
    totalPages,
    totalElements,
    currentPage,
    pageSize,
    fetchCustomers,
    fetchStatistics,
    deleteCustomer,
    search,
    changePage,
  };
};
