import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie || !auth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    try {
      const user = await auth.getUser(uid);
      
      if (!user.email) {
        return NextResponse.json(
          { message: 'User has no email' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        message: 'Password change requires re-authentication. Please use the client-side updatePassword function.',
      });

    } catch (error) {
      console.error('Error changing password:', error);
      return NextResponse.json(
        { message: 'Failed to change password' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
