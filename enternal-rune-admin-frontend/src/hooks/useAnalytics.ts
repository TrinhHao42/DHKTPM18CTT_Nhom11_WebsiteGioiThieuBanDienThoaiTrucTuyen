import { useState, useEffect, useCallback } from 'react';

export type AnalyticsMetrics = {
  // Main metrics
  totalPageViews: number;
  uniqueVisitors: number;
  totalUsers: number;
  bounceRate: number;
  averageSessionDuration: number;
  
  // Optional fields for compatibility
  newUsers?: number;
  activeUsers?: number;
  averageSessionTime?: string | number;
  
  // Trends (optional, will use mock data if not provided)
  totalUsersTrend?: { value: string; isPositive: boolean };
  newUsersTrend?: { value: string; isPositive: boolean };
  activeUsersTrend?: { value: string; isPositive: boolean };
  sessionTimeTrend?: { value: string; isPositive: boolean };
  
  // Additional data from API
  topPages?: Array<{ url: string; views: number }>;
  topCountries?: Array<{ country: string; visitors: number }>;
  deviceTypes?: Array<{ device: string; count: number; percentage: number }>;
};

export type PageView = {
  id: string;
  urlPath: string;
  pageTitle: string;
  views: number;
  uniqueViews: number;
  avgTimeOnPage: number;
};

export type UserBehavior = {
  action: string;
  currentMonth: number;
  previousMonth: number;
  change: number;
};

export type DeviceStats = {
  device: string;
  count: number;
  percentage: number;
};

export type LocationStats = {
  country: string;
  countryCode: string;
  users: number;
  percentage: number;
  trend: number;
};

export type HourlyActivity = {
  hour: string;
  [key: string]: string | number; // For days of week
};

export type SourceStats = {
  source: string;
  users: number;
  percentage: number;
};

export type GrowthData = {
  month: string;
  totalUsers: number;
  newUsers: number;
  churnedUsers: number;
};

export type RetentionData = {
  month: string;
  retentionRate: number;
  engagementRate: number;
};

export type EngagementData = {
  hour: string;
  avgTime: number;
  pagesPerSession: number;
  interactions: number;
};

export type DemographicsData = {
  ageGroups: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  genders: Array<{
    label: string;
    count: number;
    percentage: number;
  }>;
};

const API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'http://localhost:3002/api';

async function fetchAnalyticsData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  const result = await response.json();
  
  // Handle wrapped response format: { success: true, data: {...} }
  if (result.success && result.data) {
    return result.data as T;
  }
  
  return result as T;
}

export function useAnalyticsMetrics(websiteId?: string) {
  const [data, setData] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = websiteId ? `?websiteId=${websiteId}` : '';
      const metricsResponse = await fetchAnalyticsData<Record<string, unknown>>(`/metrics${params}`);
      
      // Transform backend response to match frontend expectations
      const metrics: AnalyticsMetrics = {
        totalPageViews: Number(metricsResponse.totalPageViews) || 0,
        uniqueVisitors: Number(metricsResponse.uniqueVisitors) || 0,
        totalUsers: Number(metricsResponse.totalUsers) || 0,
        bounceRate: Number(metricsResponse.bounceRate) || 0,
        averageSessionDuration: Number(metricsResponse.averageSessionDuration) || 0,
        newUsers: Number(metricsResponse.newUsers) || 0,
        activeUsers: Number(metricsResponse.activeUsers) || 0,
        averageSessionTime: String(metricsResponse.averageSessionTime) || '0m 0s',
        totalUsersTrend: (metricsResponse.totalUsersTrend as { value: string; isPositive: boolean }) || { value: '0%', isPositive: true },
        newUsersTrend: (metricsResponse.newUsersTrend as { value: string; isPositive: boolean }) || { value: '0%', isPositive: true },
        activeUsersTrend: (metricsResponse.activeUsersTrend as { value: string; isPositive: boolean }) || { value: '0%', isPositive: true },
        sessionTimeTrend: (metricsResponse.sessionTimeTrend as { value: string; isPositive: boolean }) || { value: '0%', isPositive: true },
        topPages: (metricsResponse.topPages as Array<{ url: string; views: number }>) || [],
        topCountries: (metricsResponse.topCountries as Array<{ country: string; visitors: number }>) || [],
        deviceTypes: (metricsResponse.deviceTypes as Array<{ device: string; count: number; percentage: number }>) || [],
      };
      
      setData(metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [websiteId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function usePageViews(websiteId?: string) {
  const [data, setData] = useState<PageView[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const pageViews = await fetchAnalyticsData<PageView[]>(`/page-views${params}`);
        setData(pageViews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch page views');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}

export function useUserBehavior(websiteId?: string) {
  const [data, setData] = useState<UserBehavior[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const behavior = await fetchAnalyticsData<UserBehavior[]>(`/user-behavior${params}`);
        setData(behavior);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user behavior');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}

export function useDeviceStats(websiteId?: string) {
  const [data, setData] = useState<DeviceStats[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const deviceData = await fetchAnalyticsData<{
          deviceTypes: DeviceStats[];
          browsers: Array<{browser: string; count: number; percentage: number}>;
          operatingSystems: Array<{os: string; count: number; percentage: number}>;
        }>(`/device-stats${params}`);
        
        // Use deviceTypes from the dedicated device-stats endpoint
        setData(deviceData.deviceTypes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch device stats');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}

export function useLocationStats(websiteId?: string) {
  const [data, setData] = useState<LocationStats[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const locationData = await fetchAnalyticsData<LocationStats[]>(`/location-stats${params}`);
        setData(locationData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch location stats');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}



export function useHourlyActivity(websiteId?: string) {
  const [data, setData] = useState<HourlyActivity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const activity = await fetchAnalyticsData<HourlyActivity[]>(`/hourly-activity${params}`);
        setData(activity);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch hourly activity');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}

export function useSourceStats(websiteId?: string) {
  const [data, setData] = useState<SourceStats[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const sources = await fetchAnalyticsData<SourceStats[]>(`/traffic-sources${params}`);
        setData(sources);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch traffic sources');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}

export function useGrowthData(websiteId?: string) {
  const [data, setData] = useState<GrowthData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const growth = await fetchAnalyticsData<GrowthData[]>(`/user-growth${params}`);
        setData(growth);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch growth data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}

export function useRetentionData(websiteId?: string) {
  const [data, setData] = useState<RetentionData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const retentionResponse = await fetchAnalyticsData<Array<{
          month: string;
          totalUsers: number;
          returningUsers: number;
          newUsers: number;
          retentionRate: number;
          churnRate: number;
        }>>(`/retention${params}`);
        
        // Transform to match RetentionData type
        const transformedData: RetentionData[] = retentionResponse.map(item => ({
          month: item.month,
          retentionRate: item.retentionRate,
          engagementRate: 100 - item.churnRate, // Use inverse of churn as engagement
        }));
        
        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch retention data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}

export function useEngagementData(websiteId?: string) {
  const [data, setData] = useState<EngagementData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const engagementResponse = await fetchAnalyticsData<Array<{
          hour: string;
          pageViews: number;
          events: number;
          sessions: number;
          avgEngagement: number;
        }>>(`/engagement${params}`);
        
        // Transform to match EngagementData type
        const transformedData: EngagementData[] = engagementResponse.map(item => ({
          hour: item.hour,
          avgTime: item.avgEngagement * 60, // Convert to seconds
          pagesPerSession: item.sessions > 0 ? Math.round(item.pageViews / item.sessions * 100) / 100 : 0,
          interactions: item.events,
        }));
        
        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch engagement data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}

export function useDemographics(websiteId?: string) {
  const [data, setData] = useState<DemographicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const demographicsResponse = await fetchAnalyticsData<{
          countries: Array<{country: string; users: number; percentage: number}>;
          languages: Array<{language: string; users: number; percentage: number}>;
          totalSessions: number;
        }>(`/demographics${params}`);
        
        // Transform to match DemographicsData type (placeholder - can be enhanced)
        const transformedData: DemographicsData = {
          ageGroups: [
            // Placeholder data since we don't track age in current schema
            { range: '18-24', count: Math.floor(demographicsResponse.totalSessions * 0.25), percentage: 25 },
            { range: '25-34', count: Math.floor(demographicsResponse.totalSessions * 0.35), percentage: 35 },
            { range: '35-44', count: Math.floor(demographicsResponse.totalSessions * 0.25), percentage: 25 },
            { range: '45+', count: Math.floor(demographicsResponse.totalSessions * 0.15), percentage: 15 },
          ],
          genders: [
            // Placeholder data since we don't track gender in current schema
            { label: 'Nam', count: Math.floor(demographicsResponse.totalSessions * 0.55), percentage: 55 },
            { label: 'Nữ', count: Math.floor(demographicsResponse.totalSessions * 0.42), percentage: 42 },
            { label: 'Khác', count: Math.floor(demographicsResponse.totalSessions * 0.03), percentage: 3 },
          ],
        };
        
        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch demographics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteId]);

  return { data, loading, error };
}