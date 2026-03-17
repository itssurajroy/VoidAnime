import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, auth } from '@/lib/firebase-admin';

export async function GET() {
  if (!db || !auth) {
      return NextResponse.json({ message: 'Server not configured' }, { status: 500 });
  }

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ role: 'USER' }, { status: 200 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
        return NextResponse.json({ role: 'USER' }, { status: 200 });
    }

    const userData = userDoc.data();
    return NextResponse.json({ role: userData?.role || 'USER' }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json({ role: 'USER' }, { status: 200 });
  }
}
