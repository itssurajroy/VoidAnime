import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AnalyticsClient } from "@/components/admin/AnalyticsClient";
import { getDailyStats, getTopAnimeByViews, getTrafficSources, getEngagementMetrics, getViewsByCountry } from "@/actions/analytics";

export default async function AdminAnalyticsPage() {
  const [dailyStats, topAnime, trafficSources, engagement, countryStats] = await Promise.all([
    getDailyStats(30),
    getTopAnimeByViews(10),
    getTrafficSources(),
    getEngagementMetrics(),
    getViewsByCountry(),
  ]);

  return (
    <AdminPageContainer
      title="Traffic Data"
      description="View platform metrics for traffic, watch time, and revenue."
    >
      <AnalyticsClient 
        initialDailyStats={dailyStats}
        initialTopAnime={topAnime}
        initialTrafficSources={trafficSources}
        initialEngagement={engagement}
        initialCountryStats={countryStats}
      />
    </AdminPageContainer>
  );
}
