import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/analytics';
import { prisma } from '@/lib/prisma';

const analyticsService = new AnalyticsService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId');
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Default to last 7 days if no date range provided
    const startDate = startDateParam ? new Date(startDateParam) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = endDateParam ? new Date(endDateParam) : new Date();

    console.log(`[Hourly Activity API] Fetching data for websiteId: ${websiteId}, range: ${startDate.toISOString()} to ${endDate.toISOString()}`);

    // If no websiteId provided, get the first available website
    let targetWebsiteId = websiteId;
    if (!targetWebsiteId) {
      const websites = await prisma?.website.findFirst();
      if (websites) {
        targetWebsiteId = websites.id;
        console.log(`[Hourly Activity API] Using first available website: ${targetWebsiteId}`);
      }
    }

    if (!targetWebsiteId) {
      console.log('[Hourly Activity API] No website found, returning empty data');
      // Return empty structure if no websites exist
      const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      const emptyData = dayNames.map(name => {
        const dayResult: { name: string; [key: string]: number | string } = { name };
        for (let hour = 0; hour < 24; hour += 2) {
          const hourKey = `${hour.toString().padStart(2, '0')}h`;
          dayResult[hourKey] = 0;
        }
        return dayResult;
      });

      return NextResponse.json({
        success: true,
        data: emptyData,
        message: 'No website data available',
        timestamp: new Date().toISOString(),
      });
    }

    // Get real hourly activity data
    const hourlyActivityData = await analyticsService.getHourlyActivityData(targetWebsiteId, startDate, endDate);

    console.log(`[Hourly Activity API] Successfully fetched ${hourlyActivityData.length} days of data`);

    return NextResponse.json({
      success: true,
      data: hourlyActivityData,
      websiteId: targetWebsiteId,
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Hourly Activity API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch hourly activity data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}