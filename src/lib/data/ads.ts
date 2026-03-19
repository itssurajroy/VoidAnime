import 'server-only';
import type { AdProvider, AdPlacement } from '@/types/db';
import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';

const supabaseAdmin = _supabaseAdmin!;

// -- Data Fetching Actions --

export async function getAdProviders(): Promise<AdProvider[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from('ad_providers')
            .select('*');
        
        if (error) throw error;

        return (data || []).map(provider => ({
            id: provider.id,
            name: provider.name,
            type: provider.type,
            isActive: provider.is_active,
            config: provider.config,
            createdAt: provider.created_at ? new Date(provider.created_at) : new Date(),
            updatedAt: provider.updated_at ? new Date(provider.updated_at) : new Date()
        })) as AdProvider[];
    } catch (e) {
        console.error('Failed to get ad providers:', e);
        return [];
    }
}

export async function getAdPlacements(): Promise<AdPlacement[]> {
    try {
        const { data, error } = await supabaseAdmin
            .from('ad_placements')
            .select('*');
        
        if (error) throw error;

        return (data || []).map(placement => ({
            id: placement.id,
            name: placement.name,
            description: placement.description,
            slotKey: placement.slot_key,
            deviceTarget: placement.device_target,
            maxAds: placement.max_ads,
            isActive: placement.is_active,
            createdAt: placement.created_at ? new Date(placement.created_at) : new Date(),
            updatedAt: placement.updated_at ? new Date(placement.updated_at) : new Date()
        })) as AdPlacement[];
    } catch (e) {
        console.error('Failed to get ad placements:', e);
        return [];
    }
}

export async function getAdCampaigns() {
    try {
        const { data, error } = await supabaseAdmin
            .from('ad_campaigns')
            .select(`
                *,
                provider:ad_providers (*)
            `);
        
        if (error) throw error;

        return (data || []).map(campaign => ({
            id: campaign.id,
            name: campaign.name,
            providerId: campaign.provider_id,
            status: campaign.status,
            priority: campaign.priority,
            startDate: campaign.start_date ? new Date(campaign.start_date) : null,
            endDate: campaign.end_date ? new Date(campaign.end_date) : null,
            budgetType: campaign.budget_type,
            budgetTotal: campaign.budget_total,
            budgetUsed: campaign.budget_used,
            frequencyCapPerUserPerDay: campaign.frequency_cap_per_user_per_day,
            isHouse: campaign.is_house,
            createdAt: campaign.created_at ? new Date(campaign.created_at) : new Date(),
            updatedAt: campaign.updated_at ? new Date(campaign.updated_at) : new Date(),
            provider: campaign.provider ? {
                ...campaign.provider,
                createdAt: campaign.provider.created_at ? new Date(campaign.provider.created_at) : new Date(),
                updatedAt: campaign.provider.updated_at ? new Date(campaign.provider.updated_at) : new Date()
            } : null,
            rules: campaign.rules || []
        })) as any;
    } catch (e) {
        console.error('Failed to get ad campaigns:', e);
        return [];
    }
}
