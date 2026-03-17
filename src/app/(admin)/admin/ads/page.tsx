import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { getAdProviders, getAdPlacements, getAdCampaigns } from "@/lib/data/ads";
import { AdsClient } from "@/components/admin/ads/AdsClient";

export default async function AdminAdsPage() {
    // In a real app, you'd implement proper error handling
    const [providers, placements, campaigns] = await Promise.all([
        getAdProviders(),
        getAdPlacements(),
        getAdCampaigns(),
    ]);

    return (
        <AdminPageContainer
            title="Revenue stream"
            description="Manage ad campaigns, providers, and placements with rule-based delivery."
        >
            <AdsClient
                initialProviders={providers}
                initialPlacements={placements}
                initialCampaigns={campaigns}
            />
        </AdminPageContainer>
    );
}
