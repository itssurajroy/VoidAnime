'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { AdProvider, ProviderType } from '@/types/db';
import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';

const supabaseAdmin = _supabaseAdmin!;

const providerSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    type: z.enum(['NETWORK', 'DIRECT', 'HOUSE']),
    isActive: z.boolean(),
    config: z.string().refine(val => {
        if (!val) return true;
        try { JSON.parse(val); return true; } catch { return false; }
    }, { message: "Invalid JSON format" }).optional(),
});

export async function saveAdProvider(prevState: any, formData: FormData) {
    if (!supabaseAdmin) return { error: 'Database not initialized.' };
    const validatedFields = providerSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const { id, name, type, isActive, config } = validatedFields.data;
    const configJson = config ? JSON.parse(config) : {};

    try {
        if (id && id !== 'new') {
            await supabaseAdmin.from('ad_providers').update({
                name,
                type,
                is_active: isActive,
                config: configJson,
                updated_at: new Date().toISOString()
            }).eq('id', id);
        } else {
            await supabaseAdmin.from('ad_providers').insert({
                name,
                type,
                is_active: isActive,
                config: configJson,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        }
        revalidatePath('/admin/ads');
        return { success: true, message: `Provider "${name}" saved.` };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to save provider.' };
    }
}

export async function deleteAdProvider(id: string) {
    if (!supabaseAdmin) return { error: 'Database not initialized.' };
    try {
        const { count } = await supabaseAdmin
            .from('ad_campaigns')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', id);
            
        if (count && count > 0) {
            return { error: 'Failed to delete provider. It may be linked to existing campaigns.' };
        }
        
        await supabaseAdmin.from('ad_providers').delete().eq('id', id);
        revalidatePath('/admin/ads');
        return { success: true, message: 'Provider deleted.' };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to delete provider.' };
    }
}
