import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

const analyticsService = new AnalyticsService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId') || undefined;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const userBehavior = await analyticsService.getUserBehavior(
      websiteId,
      startDateParam ? new Date(startDateParam) : undefined,
      endDateParam ? new Date(endDateParam) : undefined
    );

    return NextResponse.json({
      success: true,
      data: userBehavior,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('User behavior API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user behavior',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}