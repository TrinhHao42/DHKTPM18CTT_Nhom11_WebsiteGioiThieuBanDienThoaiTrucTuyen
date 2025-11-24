import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Temporary fix: Use direct PrismaClient with correct credentials
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://analytics_user:analytics_password@localhost:5432/analytics',
    },
  },
});

export async function GET(request: NextRequest) {
  try {
    console.log('[API] Metrics endpoint called');
    
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('websiteId') || undefined;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    console.log('[API] Parameters:', { websiteId, startDateParam, endDateParam });

    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    // Simple direct implementation to avoid class instantiation issues
    const where: Record<string, unknown> = websiteId ? { websiteId } : {};
    if (startDate && endDate) {
      where.createdAt = { gte: startDate, lte: endDate };
    }

    console.log('[API] Where clause:', where);

    // Get basic counts
    const [totalPageViews, totalUsers] = await Promise.all([
      prisma.pageView.count({ where }),
      prisma.userSession.count({ where })
    ]);

    console.log('[API] Basic counts:', { totalPageViews, totalUsers });

    const uniqueVisitors = totalUsers;

    // Get top pages
    const topPagesData = await prisma.pageView.groupBy({
      by: ['urlPath'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    const topPages = topPagesData.map(page => ({
      url: page.urlPath,
      views: page._count.id
    }));

    console.log('[API] Top pages:', topPages.length);

    const result = {
      totalPageViews,
      uniqueVisitors,
      totalUsers,
      bounceRate: 0.12, // Simplified for now
      averageSessionDuration: 665, // Simplified for now
      topPages,
      topCountries: [], // Simplified for now
      deviceTypes: [] // Simplified for now
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