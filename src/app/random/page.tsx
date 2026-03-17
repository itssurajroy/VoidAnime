import { redirect } from 'next/navigation';
import { getHomeData } from '@/services/anime';

export default async function RandomPage() {
    let targetPath = '/home';
    
    try {
        const homeRes = await getHomeData();
        
        if (homeRes.data) {
            const lists = [
                homeRes.data.trendingAnimes,
                homeRes.data.spotlightAnimes,
                homeRes.data.latestEpisodeAnimes,
                homeRes.data.topAiringAnimes,
                homeRes.data.mostPopularAnimes
            ].filter(list => list && list.length > 0);

            if (lists.length > 0) {
                const randomList = lists[Math.floor(Math.random() * lists.length)];
                const randomAnime = randomList[Math.floor(Math.random() * randomList.length)];

                if (randomAnime && randomAnime.id) {
                    targetPath = `/anime/${randomAnime.id}`;
                }
            }
        }
    } catch (error) {
        console.error("Error fetching data for random redirect:", error);
    }

    // Call redirect outside of the try-catch block
    redirect(targetPath);
}
