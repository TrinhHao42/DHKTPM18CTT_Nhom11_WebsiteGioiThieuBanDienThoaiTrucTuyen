import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

const analyticsService = new AnalyticsService();

export async function GET(request: NextRequest) {
  try {
    console.log('[API] Metrics endpoint called');
    
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    console.log('[API] Parameters:', { websiteId, startDateParam, endDateParam });

    // Use default date range if not provided (last 30 days)
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam ? new Date(startDateParam) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    if (!websiteId) {
      return NextResponse.json(
        { success: false, error: 'websiteId is required' },
        { status: 400 }
      );
    }

    // Get metrics using AnalyticsService
    const overallMetrics = await analyticsService.getOverallMetrics(websiteId, startDate, endDate);
    
    // Calculate trend data by comparing with previous period
    const periodDuration = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodDuration);
    const previousEndDate = new Date(startDate.getTime() - 1); // End at 1ms before current start
    
    const previousMetrics = await analyticsService.getOverallMetrics(websiteId, previousStartDate, previousEndDate);

    // Helper function to calculate trend
    const calculateTrend = (current: number, previous: number): { value: string; isPositive: boolean } => {
      if (previous === 0) {
        return { value: current > 0 ? '+100%' : '0%', isPositive: current > 0 };
      }
      
      const change = ((current - previous) / previous) * 100;
      const isPositive = change >= 0;
      const formattedChange = Math.abs(change).toFixed(1);
      
      return {
        value: `${isPositive ? '+' : '-'}${formattedChange}%`,
        isPositive
      };
    };

    const result = {
      totalPageViews: overallMetrics.totalPageViews,
      uniqueVisitors: overallMetrics.uniqueVisitors,
      totalUsers: overallMetrics.totalUsers,
      bounceRate: overallMetrics.bounceRate,
      averageSessionDuration: overallMetrics.averageSessionDuration,
      topPages: overallMetrics.topPages || [],
      topCountries: [], // TODO: Implement countries data
      deviceTypes: [], // TODO: Implement device types data
      
      // Add trend data
      totalUsersTrend: calculateTrend(overallMetrics.totalUsers, previousMetrics.totalUsers),
      newUsersTrend: calculateTrend(overallMetrics.uniqueVisitors, previousMetrics.uniqueVisitors),
      activeUsersTrend: calculateTrend(overallMetrics.totalUsers, previousMetrics.totalUsers),
      sessionTimeTrend: calculateTrend(overallMetrics.averageSessionDuration, previousMetrics.averageSessionDuration),
    };


    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Metrics API error:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : 'No details'
      },
      { status: 500 }
    );
  }
}