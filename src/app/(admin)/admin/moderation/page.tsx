import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { ModerationClient } from "@/components/admin/ModerationClient";
import { getFlaggedComments, getBannedUsers } from '@/actions/moderation';
import { getReports } from '@/lib/data/moderation';

export default async function AdminModerationPage() {
    const [reportsData, commentsData, bansData] = await Promise.all([
        getReports({ status: 'PENDING' }),
        getFlaggedComments(),
        getBannedUsers()
    ]);

    return (
        <AdminPageContainer
            title="Safety & Compliance"
            description="Manage abuse reports, platform rules, and community standards."
        >
           <ModerationClient 
                initialReports={reportsData.reports}
                totalReports={reportsData.total}
                totalPages={reportsData.totalPages}
                initialComments={commentsData.comments}
                initialBans={bansData.users}
            />
        </AdminPageContainer>
    );
}
