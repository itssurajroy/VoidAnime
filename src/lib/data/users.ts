import 'server-only';
import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';
import type { User, UserRole } from '@/types/db';

const supabaseAdmin = _supabaseAdmin!;

export async function getUsers({ page = 1, limit = 10, search, role }: { page: number, limit: number, search?: string, role?: UserRole }) {
  let query = supabaseAdmin
    .from('users')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error('Error fetching users:', error);
    return {
      users: [],
      totalUsers: 0,
      totalPages: 0,
    };
  }

  const users: User[] = (data || []).map(userData => ({
    id: userData.id,
    name: userData.username || 'N/A',
    email: userData.email || 'N/A',
    avatarUrl: userData.avatar_url || null,
    role: userData.role || 'USER',
    status: userData.status || 'ACTIVE',
    lastLoginAt: userData.last_login_at ? new Date(userData.last_login_at) : null,
    createdAt: userData.created_at ? new Date(userData.created_at) : new Date(),
  })) as any; // Cast as any if there are strict type mismatches with the original string/date inconsistency

  const totalUsers = count || 0;
  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    totalUsers,
    totalPages,
  };
}
