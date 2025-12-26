import { NextRequest, NextResponse } from 'next/server';
import { getLeadById, updateLead, getActivitiesForLead } from '@/lib/db';

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
    const [lead, activities] = await Promise.all([
      getLeadById(id),
      getActivitiesForLead(id),
    ]);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead, activities });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const updates = await request.json();

    const lead = await updateLead(id, updates);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}
