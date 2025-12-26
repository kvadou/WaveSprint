import { NextRequest, NextResponse } from 'next/server';
import { listLeadsForAdmin } from '@/lib/db';

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

    const leads = await listLeadsForAdmin(limit, offset);

    return NextResponse.json({
      leads,
      pagination: {
        limit,
        offset,
        total: leads.length, // TODO: Get actual total count from DB
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

