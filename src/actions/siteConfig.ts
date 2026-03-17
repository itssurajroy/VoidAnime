'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { 
    updateConfig, 
    updateTheme, 
    updateAnnouncement, 
    updateShareStats, 
    saveNavLink as saveDbNavLink, 
    deleteNavLink as deleteDbNavLink, 
    saveSocialLink as saveDbSocialLink, 
    deleteSocialLink as deleteDbSocialLink,
    saveCryptoDonation as saveDbCryptoDonation,
    deleteCryptoDonation as deleteDbCryptoDonation
} from '@/lib/site-config';
import { hexToHsl } from '@/lib/colors';

const siteConfigSchema = z.object({
    siteName: z.string().min(1, "Site name is required"),
    tagline: z.string().optional(),
    logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    faviconUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    primary: z.string(),
    background: z.string(),
    accent: z.string(),
    announcementEnabled: z.preprocess((val) => val === 'on', z.boolean()),
    announcementMessage: z.string().optional(),
    shareFacebook: z.string().optional(),
    shareTwitter: z.string().optional(),
    shareTelegram: z.string().optional(),
    shareWhatsapp: z.string().optional(),
    shareTotal: z.string().optional(),
});

export type ActionResponse = {
    success?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
    error?: string;
} | null;

export async function saveSiteConfigAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
    const validatedFields = siteConfigSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed.',
        };
    }
    
    const { 
        siteName, tagline, logoUrl, faviconUrl, primary, background, accent, 
        announcementEnabled, announcementMessage,
        shareFacebook, shareTwitter, shareTelegram, shareWhatsapp, shareTotal
    } = validatedFields.data;

    try {
        await updateConfig({
            siteName,
            tagline,
            logoUrl,
            faviconUrl,
        });
        await updateTheme({
            primary: hexToHsl(primary),
            background: hexToHsl(background),
            accent: hexToHsl(accent),
        });
        await updateAnnouncement({
            enabled: announcementEnabled,
            message: announcementMessage || '',
        });
        await updateShareStats({
            facebook: shareFacebook || '0',
            twitter: shareTwitter || '0',
            telegram: shareTelegram || '0',
            whatsapp: shareWhatsapp || '0',
            total: shareTotal || '0',
        });
        
        revalidatePath('/', 'layout');
        return { success: true, message: 'Site configuration saved successfully.' };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to save site configuration.' };
    }
}


// Schema for NavLink form
const navLinkSchema = z.object({
    id: z.string().optional(),
    text: z.string().min(1, "Text is required"),
    url: z.string().min(1, "URL is required"),
    icon: z.string().optional(),
    location: z.enum(['HEADER', 'FOOTER_SOCIAL']),
});

export async function saveNavLink(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
    const validatedFields = navLinkSchema.safeParse(Object.fromEntries(formData.entries()));
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed.',
        };
    }
    
    const { id, text, url, icon, location } = validatedFields.data;

    try {
        const linkData = {
            id: id && id !== 'new' ? parseInt(id) : undefined,
            text,
            url,
            icon: icon || '',
        };

        if (location === 'HEADER') {
            await saveDbNavLink({ ...linkData });
        } else {
            await saveDbSocialLink({...linkData, name: text});
        }
        revalidatePath('/', 'layout');
        return { success: true, message: `Link "${text}" saved.` };
    } catch (e) {
        return { error: 'Failed to save link.' };
    }
}

export async function deleteNavLink(id: number, location: 'HEADER' | 'FOOTER_SOCIAL') {
    try {
        if (location === 'HEADER') {
            await deleteDbNavLink(id);
        } else {
            await deleteDbSocialLink(id);
        }
        revalidatePath('/', 'layout');
        return { success: true, message: 'Link deleted.' };
    } catch (e) {
        return { error: 'Failed to delete link.' };
    }
}

// Crypto Donation Actions
const cryptoDonationSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required (e.g. Bitcoin)"),
    symbol: z.string().min(1, "Symbol is required (e.g. BTC)"),
    address: z.string().min(1, "Wallet address is required"),
    qrCodeUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    network: z.string().optional(),
});

export async function saveCryptoDonationAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
    const validatedFields = cryptoDonationSchema.safeParse(Object.fromEntries(formData.entries()));
    
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed.',
        };
    }
    
    try {
        await saveDbCryptoDonation(validatedFields.data);
        revalidatePath('/', 'layout');
        revalidatePath('/donate');
        return { success: true, message: `Crypto address "${validatedFields.data.name}" saved.` };
    } catch (e) {
        return { error: 'Failed to save crypto donation.' };
    }
}

export async function deleteCryptoDonationAction(id: string) {
    try {
        await deleteDbCryptoDonation(id);
        revalidatePath('/', 'layout');
        revalidatePath('/donate');
        return { success: true, message: 'Crypto address deleted.' };
    } catch (e) {
        return { error: 'Failed to delete crypto address.' };
    }
}
