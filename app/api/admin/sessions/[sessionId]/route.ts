import { NextRequest, NextResponse } from 'next/server';
import { getIntakeSession, getIntakeMessages, getMvpPrompt } from '@/lib/db';

function verifyAdminKey(request: NextRequest): boolean {
  const adminKey = request.headers.get('x-admin-key');
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey) {
    console.error('ADMIN_KEY environment variable not set');
    return false;
  }

  return adminKey === expectedKey;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  // Verify admin authentication
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId } = params;

    const session = await getIntakeSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const messages = await getIntakeMessages(sessionId);
    const mvpPrompt = await getMvpPrompt(sessionId);

    return NextResponse.json({
      session,
      messages,
      mvpPrompt,
    });
  } catch (error) {
    console.error('Error fetching session details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

