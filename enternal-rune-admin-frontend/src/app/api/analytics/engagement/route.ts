import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

const analyticsService = new AnalyticsService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId') || undefined;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const engagement = await analyticsService.getEngagement(
      websiteId,
      startDateParam ? new Date(startDateParam) : undefined,
      endDateParam ? new Date(endDateParam) : undefined
    );

    return NextResponse.json({
      success: true,
      data: engagement,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Engagement API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch engagement data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}