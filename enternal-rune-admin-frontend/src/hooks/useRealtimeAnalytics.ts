'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export interface RealtimeData {
  activeUsers: number;
  metrics: {
    totalUsers: number;
    totalPageViews: number;
    uniqueVisitors: number;
    averageSessionDuration: string;
    totalUsersTrend: { value: string; isPositive: boolean };
  };
  sourceStats: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  userBehavior: never[];
  engagementData: Array<{
    hour: number;
    sessions: number;
    pageViews: number;
    events: number;
  }>;
  hourlyActivity: never[];
  recentEvents: Array<{
    id: string;
    eventName: string;
    urlPath: string;
    pageTitle: string;
    createdAt: string;
    browser?: string;
    country?: string;
  }>;
}

export interface RealtimeMessage {
  type: 'connected' | 'update' | 'error';
  timestamp: number;
  data?: RealtimeData;
  message?: string;
}

export interface UseRealtimeAnalyticsResult {
  data: RealtimeData | null;
  isConnected: boolean;
  error: string | null;
  lastUpdate: number | null;
  connect: () => void;
  disconnect: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_URL || '/api/analytics';

export function useRealtimeAnalytics(websiteId?: string): UseRealtimeAnalyticsResult {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const connect = useCallback(() => {
    const connectFn = () => {
      // Close existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // Clear any pending reconnection
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      try {
        const params = websiteId ? `?websiteId=${websiteId}` : '';
        const eventSource = new EventSource(`${API_BASE}/realtime${params}`);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log('[Realtime] Connected to analytics stream');
          setIsConnected(true);
          setError(null);
          reconnectAttemptsRef.current = 0;
        };

        eventSource.onmessage = (event) => {
          try {
            const message: RealtimeMessage = JSON.parse(event.data);
            
            switch (message.type) {
              case 'connected':
                console.log('[Realtime] Connection established');
                setLastUpdate(message.timestamp);
                break;
                
              case 'update':
                if (message.data) {
                  setData(message.data);
                  setLastUpdate(message.timestamp);
                }
                break;
                
              case 'error':
                console.error('[Realtime] Server error:', message.message);
                setError(message.message || 'Unknown server error');
                break;
                
              default:
                console.warn('[Realtime] Unknown message type:', message.type);
            }
          } catch (parseError) {
            console.error('[Realtime] Failed to parse message:', parseError);
            setError('Failed to parse realtime data');
          }
        };

        eventSource.onerror = (event) => {
          console.error('[Realtime] Connection error:', event);
          setIsConnected(false);
          
          // Attempt reconnection
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current += 1;
            const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1); // Exponential backoff
            
            console.log(`[Realtime] Attempting reconnection ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connectFn();
            }, delay);
          } else {
            setError('Failed to connect to realtime analytics after multiple attempts');
          }
        };

      } catch (connectError) {
        console.error('[Realtime] Failed to create connection:', connectError);
        setError('Failed to establish realtime connection');
        setIsConnected(false);
      }
    };

    connectFn();
  }, [websiteId]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
    console.log('[Realtime] Disconnected from analytics stream');
  }, []);

  // Auto-connect on mount and websiteId change
  useEffect(() => {
    connect();
    
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    isConnected,
    error,
    lastUpdate,
    connect,
    disconnect
  };
}

// Hook for getting current online users count
export function useOnlineUsers(websiteId?: string) {
  const { data, isConnected, error } = useRealtimeAnalytics(websiteId);
  
  return {
    count: data?.activeUsers || 0,
    isConnected,
    error
  };
}

// Hook for getting recent activity feed
export function useRecentActivity(websiteId?: string, limit: number = 10) {
  const { data, isConnected, error, lastUpdate } = useRealtimeAnalytics(websiteId);
  
  const recentEvents = data?.recentEvents?.slice(0, limit) || [];
  
  return {
    events: recentEvents,
    isConnected,
    error,
    lastUpdate
  };
}