import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase-admin';

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie || !auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    try {
      await auth.revokeRefreshTokens(uid);

      return NextResponse.json({
        message: 'All sessions revoked successfully',
      });
    } catch (error) {
      console.error('Error revoking sessions:', error);
      return NextResponse.json(
        { message: 'Failed to revoke sessions' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
