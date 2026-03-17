'use server';

import { db } from '@/lib/firebase-admin';
import type { SeoHealth } from '@/types/admin';

export async function getSeoHealth(): Promise<SeoHealth[]> {
    if (!db) return [];
    try {
        const snapshot = await db.collection('anime').limit(20).get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            let score = 100;
            const issues: string[] = [];

            if (!data.name || data.name.length < 5) {
                score -= 20;
                issues.push('Title too short');
            } else if (data.name.length > 60) {
                score -= 10;
                issues.push('Title too long');
            }

            if (!data.description || data.description.length < 50) {
                score -= 30;
                issues.push('Meta description too short');
            }

            if (!data.poster) {
                score -= 15;
                issues.push('Missing OG image');
            }

            let status: 'Good' | 'Needs Improvement' | 'Poor' = 'Good';
            if (score < 50) status = 'Poor';
            else if (score < 80) status = 'Needs Improvement';

            return {
                id: doc.id,
                title: data.name || 'Unknown Anime',
                type: 'Anime',
                seoScore: score,
                status,
                issues,
                lastChecked: new Date().toISOString()
            };
        });
    } catch (e) {
        console.error('Error fetching SEO health:', e);
        return [];
    }
}
