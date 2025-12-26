import { NextRequest, NextResponse } from 'next/server';
import { getPipelineStages, getLeadsWithStages } from '@/lib/db';

// Check admin key
function isAuthorized(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey || expectedKey === 'your_secure_admin_key_here') {
    // Allow access in development if key not configured
    return true;
  }

  return adminKey === expectedKey;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [stages, leads] = await Promise.all([
      getPipelineStages(),
      getLeadsWithStages(100),
    ]);

    return NextResponse.json({ stages, leads });
  } catch (error) {
    console.error('Error fetching pipeline data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pipeline data' },
      { status: 500 }
    );
  }
}
