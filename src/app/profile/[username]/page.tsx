import PublicProfileView from "@/components/profile/PublicProfileView";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  if (!username) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#101113]">
      <PublicProfileView username={username} />
    </div>
  );
}
