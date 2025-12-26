import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getPipelineStages } from '@/lib/db';

// Check admin key
function isAuthorized(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey || expectedKey === 'your_secure_admin_key_here') {
    return true;
  }

  return adminKey === expectedKey;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [stats, stages] = await Promise.all([
      getDashboardStats(),
      getPipelineStages(),
    ]);

    return NextResponse.json({ ...stats, stages });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
