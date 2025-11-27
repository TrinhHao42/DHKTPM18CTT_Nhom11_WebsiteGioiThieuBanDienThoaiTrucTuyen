"use client";
import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useUserBehavior } from "@/hooks/useAnalytics";
import { EVENT_DISPLAY_NAMES } from "@/utils/eventNames";

// TypeScript declaration for window.umami helper (if available)
declare global {
  interface Window {
    umami?: {
      getEventDisplayName?: (eventName: string) => string;
    };
  }
}

interface UserBehaviorDetailListProps {
  websiteId?: string;
  timeRange: 'today' | 'yesterday' | '7days' | '30days';
  getFriendlyEventName: (name?: string) => string;
  eventFilter?: string;
}

function UserBehaviorDetailList({ websiteId, timeRange, getFriendlyEventName, eventFilter = 'all' }: UserBehaviorDetailListProps) {
  const { data: detailData, loading: detailLoading, error: detailError } = useUserBehavior(websiteId, timeRange);

  if (detailLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Đang tải dữ liệu hành vi...
        </p>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Lỗi tải dữ liệu: {detailError}</p>
      </div>
    );
  }

  // Filter behaviors based on selected category
  const allBehaviors = detailData || [];
  const behaviors = eventFilter === 'all' 
    ? allBehaviors 
    : allBehaviors.filter(b => {
        if (eventFilter === 'pages') {
          // Show items with urlPath or action that starts with /
          return (b.urlPath && b.urlPath.trim()) || b.action.startsWith('/');
        } else if (eventFilter === 'page_engagement') {
          return b.action === 'page_engagement';
        } else if (eventFilter === 'external_link') {
          return b.action === 'external_link';
        } else {
          // For other categories, match by action
          return b.action === eventFilter;
        }
      });

  return (
    <div className="space-y-3">
      {behaviors.length > 0 ? (
        behaviors.map((behavior, index) => {
          let label = behavior.urlPath || behavior.action;
          
          if (label.startsWith('/')) {
            if (label.includes(':')) {
              label = label.split(':')[0];
            }
            if (behavior.action === 'page_engagement') {
              label = `${getFriendlyEventName(behavior.action)} ${label}`;
            }
          } else {
            label = getFriendlyEventName(behavior.action || label);
          }

          return (
            <div
              key={`${behavior.action}-${behavior.urlPath || ''}-${index}`}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Mobile-first layout */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {label}
                  </h4>
                  {behavior.urlPath && behavior.urlPath !== behavior.action && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {behavior.urlPath}
                    </p>
                  )}
                </div>
                
                {/* Stats - responsive layout */}
                <div className="flex items-center justify-between gap-4 text-sm sm:gap-6">
                  <div className="text-center min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {behavior.currentMonth}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hiện tại</p>
                  </div>
                  <div className="text-center min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {behavior.previousMonth}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Trước đó</p>
                  </div>
                  <div className="text-center min-w-0">
                    <p className={`font-semibold ${
                      behavior.change >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {behavior.change >= 0 ? '+' : ''}{behavior.change}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Thay đổi</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            Không có dữ liệu hành vi cho khoảng thời gian này
          </p>
        </div>
      )}
    </div>
  );
}

interface UserBehaviorModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId?: string;
  selectedTimeRange: 'today' | 'yesterday' | '7days' | '30days';
  onTimeRangeChange: (timeRange: 'today' | 'yesterday' | '7days' | '30days') => void;
}

export default function UserBehaviorModal({ 
  isOpen, 
  onClose, 
  websiteId, 
  selectedTimeRange, 
  onTimeRangeChange 
}: UserBehaviorModalProps) {
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [lastTimeRange, setLastTimeRange] = useState(selectedTimeRange);
  
  // Fetch data to get available events for filter
  const { data: allBehaviorData } = useUserBehavior(websiteId, selectedTimeRange);
  
  // Reset event filter when time range changes
  if (lastTimeRange !== selectedTimeRange) {
    setLastTimeRange(selectedTimeRange);
    if (selectedEventFilter !== 'all') {
      setSelectedEventFilter('all');
    }
  }
  
  // Get available event categories for filter dropdown
  const availableCategories = useMemo(() => {
    if (!allBehaviorData || allBehaviorData.length === 0) {
      return [{ value: 'all', label: 'Tất cả loại' }];
    }
    
    const categories = new Set<string>();
    
    allBehaviorData.forEach(b => {
      if (b.urlPath && b.urlPath.trim()) {
        // Has urlPath - this is a page visit
        categories.add('pages');
      } else if (b.action === 'page_engagement') {
        categories.add('page_engagement');
      } else if (b.action === 'external_link') {
        categories.add('external_link');
      } else if (b.action.startsWith('/')) {
        // Action is a path - treat as page
        categories.add('pages');
      } else {
        // Other actions - group by action name
        categories.add(b.action);
      }
    });
    
    const categoryOptions = [
      { value: 'all', label: 'Tất cả loại' }
    ];
    
    if (categories.has('pages')) {
      categoryOptions.push({ value: 'pages', label: 'Trang web' });
    }
    if (categories.has('page_engagement')) {
      categoryOptions.push({ value: 'page_engagement', label: getFriendlyEventName('page_engagement') });
    }
    if (categories.has('external_link')) {
      categoryOptions.push({ value: 'external_link', label: getFriendlyEventName('external_link') });
    }
    
    // Add other unique actions
    Array.from(categories).forEach(cat => {
      if (!['pages', 'page_engagement', 'external_link'].includes(cat)) {
        categoryOptions.push({ 
          value: cat, 
          label: getFriendlyEventName(cat) 
        });
      }
    });
    
    return categoryOptions;
  }, [allBehaviorData]);

  // Local helper to convert raw event names to friendly labels
  function getFriendlyEventName(name?: string) {
    const raw = name || '';
    if (typeof window !== 'undefined' && window.umami?.getEventDisplayName) {
      try {
        return window.umami.getEventDisplayName(raw);
      } catch {
        // ignore
      }
    }

    return EVENT_DISPLAY_NAMES[raw] || raw;
  }

  // Close modal on ESC key and handle body scroll
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // More aggressive body scroll prevention
      const originalStyle = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const scrollY = window.scrollY;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = originalStyle;
        document.body.style.position = originalPosition;
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div 
      className="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999, // Much higher z-index
        padding: '16px',
        boxSizing: 'border-box',
        // Force above everything
        isolation: 'isolate'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="modal-content bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '896px', // max-w-4xl = 896px
          maxHeight: '85vh', // Slightly smaller to avoid header overlap
          position: 'relative',
          margin: 0,
          zIndex: 999999, // Same high z-index
          // Prevent any interference
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
              Tất cả hành vi người dùng
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Phân tích chi tiết các hành động của người dùng theo thời gian
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          {/* Time Range Filter */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Khoảng thời gian:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'today', label: 'Hôm nay' },
                { value: 'yesterday', label: 'Hôm qua' },
                { value: '7days', label: '7 ngày trước' },
                { value: '30days', label: '1 tháng trước' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => onTimeRangeChange(value as 'today' | 'yesterday' | '7days' | '30days')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedTimeRange === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Loại hành vi:
            </label>
            <select
              value={selectedEventFilter}
              onChange={(e) => setSelectedEventFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:w-auto sm:min-w-[200px]"
            >
              {availableCategories.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Content */}
        <div 
          className="overflow-y-auto p-6" 
          style={{ 
            maxHeight: 'calc(85vh - 180px)', // Adjusted for smaller modal height
            overflowX: 'hidden'
          }}
        >
          <UserBehaviorDetailList 
            websiteId={websiteId}
            timeRange={selectedTimeRange}
            getFriendlyEventName={getFriendlyEventName}
            eventFilter={selectedEventFilter}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}