import { NextResponse } from 'next/server';

/**
 * Health check endpoint
 * GET /api/ping
 */
export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'enternal-rune-admin-frontend'
    },
    { status: 200 }
  );
}
