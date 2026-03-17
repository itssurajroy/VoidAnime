
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AuditLogsClient } from "@/components/admin/AuditLogsClient";
import { getAuditLogs } from "@/actions/audit";

export default async function AdminAuditLogsPage() {
    const { logs } = await getAuditLogs(1, 100);

    return (
        <AdminPageContainer
            title="Action Logs"
            description="Review important activities and changes that have occurred in the management panel."
        >
           <AuditLogsClient initialLogs={logs} />
        </AdminPageContainer>
    );
}
