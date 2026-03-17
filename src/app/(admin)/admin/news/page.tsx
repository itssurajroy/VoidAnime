import { getNewsAction } from '@/actions/news';
import NewsManagerClient from './NewsManagerClient';
import { AdminPageContainer } from '@/components/admin/AdminPageContainer';

export const metadata = {
    title: 'Manage News | Admin | VoidAnime',
};

export default async function AdminNewsPage() {
    const news = await getNewsAction();

    return (
        <AdminPageContainer
            title="Content Updates"
            description="Create, Edit and Delete website news articles"
        >
            <NewsManagerClient initialNews={news} />
        </AdminPageContainer>
    );
}
