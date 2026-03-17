import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { SystemPageClient } from "@/components/admin/SystemPageClient";
import { fetchMaintenanceMode } from "@/actions/system";

export default async function AdminSystemPage() {
    // On the server, we can access environment variables.
    // We should only pass non-sensitive, public variables to the client.
    const publicEnvVars = Object.entries(process.env)
        .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
        .map(([key, value]) => ({ key, value: value || '' }));

    const serverInfo = {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
    };

    const maintenanceMode = await fetchMaintenanceMode();

    return (
        <AdminPageContainer
            title="Site Health"
            description="Manage site settings, cache, environment variables, and maintenance mode."
        >
            <SystemPageClient 
                envVars={publicEnvVars} 
                serverInfo={serverInfo} 
                initialMaintenanceMode={maintenanceMode}
            />
        </AdminPageContainer>
    );
}
