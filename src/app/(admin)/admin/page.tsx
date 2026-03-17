import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { DashboardClient } from "@/components/admin/DashboardClient";
import { getDashboardStats, getDailyStats, getTopAnimeByViews, getRecentActivity } from "@/actions/analytics";
import { fetchBackgroundJobs } from "@/actions/system";

export default async function AdminDashboardPage() {
  const [stats, dailyStats, topAnime, initialJobs, initialActivity] = await Promise.all([
    getDashboardStats(),
    getDailyStats(30),
    getTopAnimeByViews(5),
    fetchBackgroundJobs(),
    getRecentActivity(10),
  ]);

  return (
    <AdminPageContainer
      title="Console Overview"
      description="An overview of your platform statistics and health."
    >
      <DashboardClient 
        initialStats={stats}
        dailyStats={dailyStats}
        topAnime={topAnime}
        initialJobs={initialJobs}
        initialActivity={initialActivity}
      />
    </AdminPageContainer>
  );
}
