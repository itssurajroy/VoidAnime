import { cookies } from 'next/headers';
import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';
import type { UserRole } from '@/types/db';

const supabaseAdmin = _supabaseAdmin!;

export async function verifyServerSession(): Promise<{ uid: string; role: UserRole } | null> {
  try {
    const cookieStore = await cookies();
    
    // Attempt to get the session/access token from common cookie names
    const token = cookieStore.get('sb-access-token')?.value || 
                  cookieStore.get('session')?.value ||
                  cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return null;
    }

    // Use the admin client to verify the user from the token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      // If direct token verification fails, it might be a session cookie that needs different handling,
      // but for standard Supabase JWTs, getUser(token) works.
      return null;
    }

    const uid = user.id;

    // Fetch additional user data (like role) from the public users table
    const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', uid)
        .maybeSingle();

    if (userError || !userData) {
        // Fallback if user exists in Auth but not yet in public.users
        return { uid, role: 'USER' };
    }

    return { uid, role: userData.role || 'USER' };
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
