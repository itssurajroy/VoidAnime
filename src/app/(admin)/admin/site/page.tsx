import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { SitePageClient } from "@/components/admin/SitePageClient";
import { getSiteConfig, getRawNavLinks, getRawSocialLinks } from "@/lib/site-config";

export default async function AdminSitePage() {
    const [config, navLinks, socialLinks] = await Promise.all([
        getSiteConfig(),
        getRawNavLinks(),
        getRawSocialLinks()
    ]);

    return (
        <AdminPageContainer
            title="Site Configuration"
            description="Manage general site info, branding, navigation, and announcements."
        >
           <SitePageClient 
                initialConfig={config} 
                initialNavLinks={navLinks}
                initialSocialLinks={socialLinks}
            />
        </AdminPageContainer>
    );
}
