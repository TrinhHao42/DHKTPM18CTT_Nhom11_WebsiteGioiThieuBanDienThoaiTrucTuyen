'use client';

import React from 'react';
import { useRealtimeAnalytics, useOnlineUsers, useRecentActivity } from '@/hooks/useRealtimeAnalytics';

interface RealtimeAnalyticsProps {
  websiteId?: string;
  className?: string;
}

export default function RealtimeAnalytics({ websiteId, className = '' }: RealtimeAnalyticsProps) {
  const { data, isConnected, error, lastUpdate } = useRealtimeAnalytics(websiteId);

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Phân tích thời gian thực
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Đã kết nối' : 'Mất kết nối'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Lỗi kết nối
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Users */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Đang hoạt động</p>
              <p className="text-2xl font-bold">{data?.activeUsers || 0}</p>
            </div>
          </div>
          {lastUpdate && (
            <p className="text-blue-100 text-xs mt-2">
              Cập nhật lần cuối: {new Date(lastUpdate).toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Page Views */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Lượt xem gần đây</p>
              <p className="text-2xl font-bold">{data?.metrics?.totalPageViews || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Hoạt động gần đây</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {data?.recentEvents?.length ? (
            data.recentEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.eventName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {event.pageTitle || event.urlPath}
                  </p>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-400">
                  {event.browser && (
                    <span className="mr-2">{event.browser}</span>
                  )}
                  {event.country && (
                    <span>{event.country}</span>
                  )}
                </div>
                <div className="flex-shrink-0 text-xs text-gray-400">
                  {new Date(event.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              {isConnected ? 'Không có hoạt động gần đây' : 'Đang kết nối...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for showing just online users count
export function OnlineUsersWidget({ websiteId, className = '' }: RealtimeAnalyticsProps) {
  const { count, isConnected, error } = useOnlineUsers(websiteId);

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Người dùng trực tuyến</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-xs text-gray-500">
            {isConnected ? 'Trực tiếp' : 'Ngoại tuyến'}
          </span>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}

// Component for showing recent activity feed
export function RecentActivityFeed({ websiteId, limit = 5, className = '' }: RealtimeAnalyticsProps & { limit?: number }) {
  const { events, isConnected, error } = useRecentActivity(websiteId, limit);

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-md font-medium text-gray-900">Hoạt động trực tiếp</h4>
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
      </div>
      
      {error && (
        <p className="text-xs text-red-500 mb-3">{error}</p>
      )}
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {events.length ? (
          events.map((event) => (
            <div key={event.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {event.eventName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {event.urlPath}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(event.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3 text-gray-500 text-sm">
            {isConnected ? 'Không có hoạt động gần đây' : 'Đang kết nối...'}
          </div>
        )}
      </div>
    </div>
  );
}