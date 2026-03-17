'use server';

import { revalidatePath } from 'next/cache';
import { 
    getSystemConfig,
    getMaintenanceMode,
    updateMaintenanceMode,
    getFeatureFlags,
    toggleFeatureFlag,
    getSystemServices,
    refreshServiceStatuses,
    getBackgroundJobs,
    triggerJob,
    clearCache,
    getCacheStatus,
    getDefaultFeatureFlags,
    getDefaultServices,
    getDefaultJobs
} from '@/lib/data/system';
import type { FeatureFlag, SystemService, BackgroundJob } from '@/types/db';

export async function fetchSystemConfig() {
    return await getSystemConfig();
}

export async function fetchMaintenanceMode() {
    return await getMaintenanceMode();
}

export async function setMaintenanceMode(enabled: boolean, message: string) {
    await updateMaintenanceMode(enabled, message);
    revalidatePath('/');
    revalidatePath('/admin/system');
    return { success: true };
}

export async function fetchFeatureFlags(): Promise<FeatureFlag[]> {
    try {
        return await getFeatureFlags();
    } catch {
        return getDefaultFeatureFlags();
    }
}

export async function setFeatureFlag(key: string, enabled: boolean) {
    await toggleFeatureFlag(key, enabled);
    revalidatePath('/admin/system');
    return { success: true };
}

export async function fetchSystemServices(): Promise<SystemService[]> {
    try {
        return await getSystemServices();
    } catch {
        return getDefaultServices();
    }
}

export async function refreshServices() {
    const services = await refreshServiceStatuses();
    revalidatePath('/admin/system');
    return { success: true, services };
}

export async function fetchBackgroundJobs(): Promise<BackgroundJob[]> {
    try {
        return await getBackgroundJobs();
    } catch {
        return getDefaultJobs();
    }
}

export async function runJobNow(jobId: string) {
    await triggerJob(jobId);
    revalidatePath('/admin/system');
    return { success: true, message: `Job ${jobId} started` };
}

export async function clearApiCache() {
    const result = await clearCache('api');
    revalidatePath('/admin/system');
    return result;
}

export async function clearDataCache() {
    const result = await clearCache('data');
    revalidatePath('/admin/system');
    return result;
}

export async function clearAllCaches() {
    const result = await clearCache('all');
    revalidatePath('/admin/system');
    return result;
}

export async function fetchCacheStatus() {
    return await getCacheStatus();
}
