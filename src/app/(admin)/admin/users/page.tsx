import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { UsersPageClient } from "@/components/admin/UsersPageClient";
import { getUsers } from "@/lib/data/users";
import type { UserRole } from "@/types/db";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? Number(resolvedSearchParams.page) : 1;
  const limit = typeof resolvedSearchParams.limit === 'string' ? Number(resolvedSearchParams.limit) : 10;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const role = typeof resolvedSearchParams.role === 'string' ? resolvedSearchParams.role as UserRole : undefined;

  const { users, totalUsers, totalPages } = await getUsers({ page, limit, search, role });

  return (
    <AdminPageContainer
      title="User Management"
      description="View user data and manage roles and permissions."
    >
      <UsersPageClient 
        initialUsers={users} 
        totalUsers={totalUsers}
        totalPages={totalPages}
      />
    </AdminPageContainer>
  );
}
