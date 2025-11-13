import React from 'react';
import {
  UserAnalyticsMetrics,
  UserGrowthChart,
  UserDeviceChart,
  UserLocationAnalytics,
  UserActivityHeatmap,
  UserDemographics,
  UserRetentionChart,
  UserEngagementChart,
  UserSourcesChart,
  UserBehaviorChart,
} from '@/components/analytics';
import PageBreadCrumb from '@/components/common/PageBreadCrumb';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageBreadCrumb pageTitle="Phân tích dữ liệu người dùng" />

      <UserAnalyticsMetrics />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <UserGrowthChart />
        </div>
        <UserDeviceChart />
        <UserBehaviorChart />
        <UserSourcesChart />
      </div>

      {/* <div className="grid grid-cols-1">
          <UserRetentionChart />
      </div> */}
      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UserLocationAnalytics />
      </div> */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <UserEngagementChart />
        </div>
        <div className="lg:col-span-2">
      <UserActivityHeatmap />
        </div>
      </div>


    </div>
  );
}
