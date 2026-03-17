import 'server-only';
import type { AdProvider, AdPlacement, AdCampaign, AdRule } from '@/types/db';
import { db } from '@/lib/firebase-admin';

// -- Data Fetching Actions --

export async function getAdProviders(): Promise<AdProvider[]> {
    if (!db) return [];
    try {
        const snapshot = await db.collection('adProviders').get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
                updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt)
            } as AdProvider;
        });
    } catch (e) {
        console.error('Failed to get ad providers:', e);
        return [];
    }
}

export async function getAdPlacements(): Promise<AdPlacement[]> {
    if (!db) return [];
    try {
        const snapshot = await db.collection('adPlacements').get();
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
                updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt)
            } as AdPlacement;
        });
    } catch (e) {
        console.error('Failed to get ad placements:', e);
        return [];
    }
}

export async function getAdCampaigns() {
    if (!db) return [];
    try {
        const [campaignsSnap, providersSnap] = await Promise.all([
            db.collection('adCampaigns').get(),
            db.collection('adProviders').get()
        ]);
        
        const providersMap = new Map();
        providersSnap.docs.forEach(doc => {
            const data = doc.data();
            providersMap.set(doc.id, {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
                updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt)
            });
        });

        return campaignsSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                startDate: data.startDate?.toDate?.() || (data.startDate ? new Date(data.startDate) : null),
                endDate: data.endDate?.toDate?.() || (data.endDate ? new Date(data.endDate) : null),
                createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
                updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
                provider: providersMap.get(data.providerId) || null,
                rules: data.rules || []
            } as any; // Cast as any temporarily to avoid complex intersection type issues if rules is missing
        });
    } catch (e) {
        console.error('Failed to get ad campaigns:', e);
        return [];
    }
}
