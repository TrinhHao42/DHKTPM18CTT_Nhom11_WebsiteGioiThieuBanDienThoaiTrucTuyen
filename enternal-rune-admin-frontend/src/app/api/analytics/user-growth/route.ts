import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

const analyticsService = new AnalyticsService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId') || undefined;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const startDate = startDateParam ? new Date(startDateParam) : new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000); // 12 months
    const endDate = endDateParam ? new Date(endDateParam) : new Date();

    if (!websiteId) {
      return NextResponse.json({
        success: true,
        data: [],
        timestamp: new Date().toISOString(),
      });
    }

    // Get detailed growth data with real calculations
    const transformedData = await analyticsService.getUserGrowthWithDetails(websiteId, startDate, endDate);

    return NextResponse.json({
      success: true,
      data: transformedData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('User growth API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user growth',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}