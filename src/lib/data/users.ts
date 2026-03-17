import 'server-only';
import { db, auth } from '@/lib/firebase-admin';
import type { User, UserRole } from '@/types/db';

export async function getUsers({ page = 1, limit = 10, search, role }: { page: number, limit: number, search?: string, role?: UserRole }) {
  if (!db) {
    throw new Error('Firebase Admin SDK not initialized');
  }

  let users: User[] = [];
  
  // Due to Firestore limitations on complex queries (e.g., text search + filtering),
  // we'll fetch all users and filter in memory. This is not scalable for large user bases.
  // A production app would use a dedicated search service like Algolia or Typesense.
  const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
  
  const allUsers: User[] = usersSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.username || 'N/A',
      email: data.email || 'N/A',
      avatarUrl: data.profileImageUrl || null,
      role: data.role || 'USER',
      status: data.status || 'ACTIVE',
      lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate().toISOString() : (typeof data.lastLoginAt === 'string' ? data.lastLoginAt : null),
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()),
    };
  });

  let filteredUsers = allUsers;

  if (search) {
    const lowercasedSearch = search.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(lowercasedSearch) ||
      user.email.toLowerCase().includes(lowercasedSearch)
    );
  }

  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / limit);
  users = filteredUsers.slice((page - 1) * limit, page * limit);

  return {
    users,
    totalUsers,
    totalPages,
  };
}
