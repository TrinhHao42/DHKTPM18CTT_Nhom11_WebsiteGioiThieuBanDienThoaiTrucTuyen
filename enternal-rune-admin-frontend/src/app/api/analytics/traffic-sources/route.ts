import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

const analyticsService = new AnalyticsService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId') || undefined;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const startDate = startDateParam ? new Date(startDateParam) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = endDateParam ? new Date(endDateParam) : new Date();

    const trafficSources = websiteId 
      ? await analyticsService.getTrafficSources(websiteId, startDate, endDate)
      : [];

    return NextResponse.json({
      success: true,
      data: trafficSources,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Traffic sources API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch traffic sources',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}