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
    
    console.log('[API] Overall metrics:', overallMetrics);

    const result = {
      totalPageViews: overallMetrics.totalPageViews,
      uniqueVisitors: overallMetrics.uniqueVisitors,
      totalUsers: overallMetrics.totalUsers,
      bounceRate: overallMetrics.bounceRate,
      averageSessionDuration: overallMetrics.averageSessionDuration,
      topPages: overallMetrics.topPages || [],
      topCountries: [], // TODO: Implement countries data
      deviceTypes: [] // TODO: Implement device types data
    };

    console.log('[API] Returning result');

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