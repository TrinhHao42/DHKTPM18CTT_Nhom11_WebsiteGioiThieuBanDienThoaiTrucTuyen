export interface TrackingData {
  website: string;
  hostname?: string;
  language?: string;
  referrer?: string;
  screen?: string;
  title?: string;
  url?: string;
  userAgent?: string;
}

export interface EventData extends TrackingData {
  name: string;
  data?: Record<string, any>;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  averageSessionDuration: number;
  userGrowth: { month: string; users: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  topPages: { path: string; views: number; uniqueUsers: number }[];
  trafficSources: { source: string; count: number; percentage: number }[];
  engagementByHour: { hour: number; sessions: number; pageViews: number }[];
  heatmapData: { weekday: number; hour: number; activeUsers: number }[];
}

export interface SessionInfo {
  id: string;
  websiteId: string;
  browser?: string;
  os?: string;
  device?: string;
  screen?: string;
  language?: string;
  country?: string;
  region?: string;
  city?: string;
  distinctId?: string;
  createdAt: Date;
}