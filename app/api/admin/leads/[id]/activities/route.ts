import { NextRequest, NextResponse } from 'next/server';
import { getActivitiesForLead, createActivity } from '@/lib/db';
import type { ActivityInsert } from '@/types/database';

// Check admin key
function isAuthorized(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey || expectedKey === 'your_secure_admin_key_here') {
    return true;
  }

  return adminKey === expectedKey;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const activities = await getActivitiesForLead(id);

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const activityData: ActivityInsert = {
      lead_id: id,
      type: body.type,
      title: body.title,
      content: body.content,
      metadata: body.metadata || {},
      created_by: 'user',
    };

    const activity = await createActivity(activityData);

    if (!activity) {
      return NextResponse.json(
        { error: 'Failed to create activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({ activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}
