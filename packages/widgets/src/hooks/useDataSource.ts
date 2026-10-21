import { useState, useEffect, useCallback } from 'react';
import type { DataSource } from '@repo/types';

interface UseDataSourceResult<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDataSource = <T = any>(dataSource?: DataSource): UseDataSourceResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    if (!dataSource) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (dataSource.type === 'static') {
      setData(dataSource.data ?? null);
      setLoading(false);
      setError(null);
    } else if (dataSource.type === 'api') {
      if (!dataSource.url) {
        setData(null);
        setLoading(false);
        setError('No API URL configured');
        return;
      }

      setLoading(true);
      setError(null);

      const timer = setTimeout(() => {
        setLoading(false);
        setError('API data source is currently coming soon');
        setData(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [dataSource?.type, dataSource?.data, dataSource?.url]);

  useEffect(() => {
    const cleanup = fetchData();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
