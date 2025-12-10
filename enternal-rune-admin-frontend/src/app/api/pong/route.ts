import { NextResponse } from 'next/server';

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
