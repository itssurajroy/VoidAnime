'use server';

import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';
import type { SeoHealth } from '@/types/admin';

const supabaseAdmin = _supabaseAdmin!;

export async function getSeoHealth(): Promise<SeoHealth[]> {
    try {
        const { data: snapshot, error } = await supabaseAdmin
            .from('anime')
            .select('*')
            .limit(20);

        if (error || !snapshot) return [];
        
        return snapshot.map(item => {
            let score = 100;
            const issues: string[] = [];

            if (!item.name || item.name.length < 5) {
                score -= 20;
                issues.push('Title too short');
            } else if (item.name.length > 60) {
                score -= 10;
                issues.push('Title too long');
            }

            if (!item.description || item.description.length < 50) {
                score -= 30;
                issues.push('Meta description too short');
            }

            if (!item.poster) {
                score -= 15;
                issues.push('Missing OG image');
            }

            let status: 'Good' | 'Needs Improvement' | 'Poor' = 'Good';
            if (score < 50) status = 'Poor';
            else if (score < 80) status = 'Needs Improvement';

            return {
                id: item.id,
                title: item.name || 'Unknown Anime',
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
