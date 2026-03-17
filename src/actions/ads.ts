'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { AdProvider, ProviderType } from '@/types/db';
import { db } from '@/lib/firebase-admin';

// -- Mutation Actions --

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
    if (!db) return { error: 'Database not initialized.' };
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
            await db.collection('adProviders').doc(id).update({
                name,
                type,
                isActive,
                config: configJson,
                updatedAt: new Date()
            });
        } else {
            await db.collection('adProviders').add({
                name,
                type,
                isActive,
                config: configJson,
                createdAt: new Date(),
                updatedAt: new Date(),
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
    if (!db) return { error: 'Database not initialized.' };
    try {
        // Check if provider is in use by any campaigns
        const campaignsSnap = await db.collection('adCampaigns').where('providerId', '==', id).limit(1).get();
        if (!campaignsSnap.empty) {
            return { error: 'Failed to delete provider. It may be linked to existing campaigns.' };
        }
        await db.collection('adProviders').doc(id).delete();
        revalidatePath('/admin/ads');
        return { success: true, message: 'Provider deleted.' };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to delete provider.' };
    }
}