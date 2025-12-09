import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';

const analyticsService = new AnalyticsService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId') || undefined;
    const timeRange = searchParams.get('timeRange') as 'today' | 'yesterday' | '7days' | '30days' | null;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Calculate dates based on timeRange if provided
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (timeRange) {
      const now = new Date();
      endDate = new Date();

      switch (timeRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'yesterday':
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
          endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
          break;
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
    } else if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
    }

    const userBehavior = await analyticsService.getUserBehavior(
      websiteId,
      startDate,
      endDate
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