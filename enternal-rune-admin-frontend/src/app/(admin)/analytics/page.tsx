'use client';

import React from 'react';
import {
  UserAnalyticsMetrics,
  UserGrowthChart,
  UserDeviceChart,
  UserActivityHeatmap,
  UserEngagementChart,
  UserSourcesChart,
  UserBehaviorChart,
  RealtimeAnalytics,
  OnlineUsersWidget,
  RecentActivityFeed,
} from '@/components/analytics-ui';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageBreadCrumb pageTitle="Phân tích dữ liệu người dùng" />

      {/* Realtime Analytics Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RealtimeAnalytics websiteId="cmic2k2820000ml8mu0miqhlm" />
        </div>
        <div className="space-y-4">
          <OnlineUsersWidget websiteId="cmic2k2820000ml8mu0miqhlm" />
          <RecentActivityFeed websiteId="cmic2k2820000ml8mu0miqhlm" limit={8} />
        </div>
      </div>

      <UserAnalyticsMetrics websiteId="cmic2k2820000ml8mu0miqhlm" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <UserGrowthChart websiteId="cmic2k2820000ml8mu0miqhlm" />
        </div>
        <UserDeviceChart websiteId="cmic2k2820000ml8mu0miqhlm" />
        <UserBehaviorChart websiteId="cmic2k2820000ml8mu0miqhlm" />
        <UserSourcesChart websiteId="cmic2k2820000ml8mu0miqhlm" />
      </div>

      {/* <div className="grid grid-cols-1">
          <UserRetentionChart />
      </div> */}
      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UserLocationAnalytics />
      </div> */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <UserEngagementChart websiteId="cmic2k2820000ml8mu0miqhlm" />
        </div>
        <div className="lg:col-span-2">
          <UserActivityHeatmap websiteId="cmic2k2820000ml8mu0miqhlm" />
        </div>
      </div>


    </div>
  );
}
