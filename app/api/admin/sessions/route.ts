import { NextRequest, NextResponse } from 'next/server';
import { listSessionsForAdmin } from '@/lib/db';

function verifyAdminKey(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey) {
    console.error('ADMIN_KEY environment variable not set');
    return false;
  }

  return adminKey === expectedKey;
}

export async function GET(request: NextRequest) {
  // Verify admin authentication
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const sessions = await listSessionsForAdmin(limit, offset);

    return NextResponse.json({
      sessions,
      pagination: {
        limit,
        offset,
        total: sessions.length, // TODO: Get actual total count from DB
      },
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

