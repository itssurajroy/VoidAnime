import { cookies } from 'next/headers';
import { db, auth } from '@/lib/firebase-admin';
import type { UserRole } from '@/types/db';

export async function verifyServerSession(): Promise<{ uid: string; role: UserRole } | null> {
  if (!db || !auth) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return null;
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
        return { uid, role: 'USER' };
    }

    const userData = userDoc.data();
    return { uid, role: userData?.role || 'USER' };
  } catch (error) {
    console.error('Error verifying server session:', error);
    return null;
  }
}

export async function verifyAdminAction(): Promise<boolean> {
  const session = await verifyServerSession();
  if (!session) return false;
  
  const adminRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST'];
  return adminRoles.includes(session.role);
}
