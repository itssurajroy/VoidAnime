import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { SeoDashboardClient } from "@/components/admin/SeoDashboardClient";
import { getSeoSettings } from "@/lib/settings";
import { getSeoHealth } from "@/actions/seo";
import type { SeoHealth } from "@/types/admin";

export default async function AdminSeoPage() {
    const [settings, seoHealthData] = await Promise.all([
        getSeoSettings(),
        getSeoHealth()
    ]);

    return (
        <AdminPageContainer
            title="Site Discovery"
            description="Manage global SEO, content health, sitemaps, and crawlers."
        >
            <SeoDashboardClient initialSettings={settings} seoHealthData={seoHealthData} />
        </AdminPageContainer>
    );
}
