'use server';

import { saveSeoSettings as save, type SeoSettings } from '@/lib/settings';
import { revalidatePath } from 'next/cache';

export async function saveSeoSettingsAction(settings: SeoSettings) {
    const result = await save(settings);
    // Revalidate all pages to apply the new SEO settings
    revalidatePath('/', 'layout');
    return result;
}
