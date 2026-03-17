import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/lib/site-config';
import { getSeoSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [config, seo] = await Promise.all([
            getSiteConfig(),
            getSeoSettings()
        ]);
        return NextResponse.json({ config, seo });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch site config' }, { status: 500 });
    }
}
