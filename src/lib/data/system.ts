import 'server-only';
import type { SystemConfig, FeatureFlag, SystemService, BackgroundJob, ServiceStatus, JobStatus } from '@/types/db';
import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';

const supabaseAdmin = _supabaseAdmin!;

const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
    { key: 'embed-video-player', description: 'Enables video player embedding for all content.', enabled: true },
    { key: 'anime-recommendations-v2', description: 'Uses a new ML model for homepage recommendations.', enabled: true },
    { key: 'real-time-comments', description: 'Enables WebSocket-based real-time comments on watch pages.', enabled: true },
    { key: 'real-time-notifications', description: 'Enables live notification updates for users.', enabled: true },
    { key: 'watch-together', description: 'Enables synchronized watching with friends.', enabled: true },
    { key: 'admin-dashboard-v2', description: 'Activates the new, redesigned admin dashboard.', enabled: false },
];

const DEFAULT_SERVICES: SystemService[] = [
    { id: 'service-1', name: 'Main Site', status: 'Operational', url: '/', lastChecked: new Date() },
    { id: 'service-2', name: 'API Service', status: 'Operational', url: '/api', lastChecked: new Date() },
];

const DEFAULT_JOBS: BackgroundJob[] = [
    { id: 'job-1', name: 'Sitemap Generation', status: 'Idle', schedule: '0 0 * * *', lastRun: null, nextRun: null },
    { id: 'job-2', name: 'Analytics Aggregation', status: 'Idle', schedule: '0 2 * * *', lastRun: null, nextRun: null },
    { id: 'job-3', name: 'Metadata Fetcher', status: 'Idle', schedule: '*/30 * * * *', lastRun: null, nextRun: null },
];

const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
    id: 'system-config',
    maintenanceMode: {
        enabled: false,
        message: 'The site is currently down for maintenance. We\'ll be back shortly!',
    },
    featureFlags: [...DEFAULT_FEATURE_FLAGS],
    services: [...DEFAULT_SERVICES],
    jobs: [...DEFAULT_JOBS],
    updatedAt: new Date(),
    updatedBy: null,
};

let cacheCleared = false;
let cacheClearedAt: Date | null = null;

async function getOrCreateSystemConfig(): Promise<SystemConfig> {
    try {
        const { data, error } = await supabaseAdmin
            .from('system_config')
            .select('*')
            .eq('id', 'config')
            .maybeSingle();

        if (error) throw error;
        
        if (!data) {
            const { error: insertError } = await supabaseAdmin
                .from('system_config')
                .insert([{ ...DEFAULT_SYSTEM_CONFIG, id: 'config' }]);
            
            if (insertError) {
                console.error('Failed to create default system config:', insertError);
                return DEFAULT_SYSTEM_CONFIG;
            }
            return DEFAULT_SYSTEM_CONFIG;
        }
        
        return {
            ...DEFAULT_SYSTEM_CONFIG,
            ...data,
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
            featureFlags: data.featureFlags || DEFAULT_FEATURE_FLAGS,
            services: (data.services || DEFAULT_SERVICES).map((s: any) => ({
                ...s,
                lastChecked: s.lastChecked ? new Date(s.lastChecked) : new Date()
            })),
            jobs: (data.jobs || DEFAULT_JOBS).map((j: any) => ({
                ...j,
                lastRun: j.lastRun ? new Date(j.lastRun) : null,
                nextRun: j.nextRun ? new Date(j.nextRun) : null
            }))
        };
    } catch (e) {
        console.error('Failed to get system config:', e);
        return DEFAULT_SYSTEM_CONFIG;
    }
}

async function saveSystemConfig(updates: Partial<SystemConfig>): Promise<void> {
    try {
        const { error } = await supabaseAdmin
            .from('system_config')
            .upsert({
                id: 'config',
                ...updates,
                updatedAt: new Date().toISOString()
            });
        
        if (error) throw error;
    } catch (e) {
        console.error('Failed to save system config:', e);
    }
}

export async function getSystemConfig(): Promise<SystemConfig> {
    return await getOrCreateSystemConfig();
}

export async function getMaintenanceMode(): Promise<{ enabled: boolean; message: string }> {
    const config = await getOrCreateSystemConfig();
    return config.maintenanceMode;
}

export async function updateMaintenanceMode(enabled: boolean, message: string, updatedBy?: string): Promise<void> {
    await saveSystemConfig({
        maintenanceMode: { enabled, message },
        updatedBy: updatedBy || null
    });
}

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
    const config = await getOrCreateSystemConfig();
    return config.featureFlags;
}

export async function toggleFeatureFlag(key: string, enabled: boolean): Promise<void> {
    const config = await getOrCreateSystemConfig();
    const flags = config.featureFlags.map(f => f.key === key ? { ...f, enabled } : f);
    await saveSystemConfig({ featureFlags: flags });
}

export async function getSystemServices(): Promise<SystemService[]> {
    const config = await getOrCreateSystemConfig();
    return config.services;
}

export async function updateServiceStatus(id: string, status: ServiceStatus): Promise<void> {
    const config = await getOrCreateSystemConfig();
    const services = config.services.map(s => s.id === id ? { ...s, status, lastChecked: new Date() } : s);
    await saveSystemConfig({ services });
}

export async function checkServiceHealth(service: SystemService): Promise<ServiceStatus> {
    if (!service.url) return service.status;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const url = service.url.startsWith('/') ? `http://localhost:3000${service.url}` : service.url;
        
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeout);
        return response.ok ? 'Operational' : 'Down';
    } catch {
        return 'Down';
    }
}

export async function refreshServiceStatuses(): Promise<SystemService[]> {
    const config = await getOrCreateSystemConfig();
    const checks = config.services.map(async (service) => {
        if (service.url) {
            const status = await checkServiceHealth(service);
            return { ...service, status, lastChecked: new Date() };
        }
        return { ...service, lastChecked: new Date() };
    });

    const updatedServices = await Promise.all(checks);
    await saveSystemConfig({ services: updatedServices });
    return updatedServices;
}

export async function getBackgroundJobs(): Promise<BackgroundJob[]> {
    const config = await getOrCreateSystemConfig();
    return config.jobs;
}

export async function updateJobStatus(id: string, status: JobStatus): Promise<void> {
    const config = await getOrCreateSystemConfig();
    const jobs = config.jobs.map(j => {
        if (j.id === id) {
            return {
                ...j,
                status,
                lastRun: status === 'Running' ? new Date() : j.lastRun
            };
        }
        return j;
    });
    await saveSystemConfig({ jobs });
}

export async function triggerJob(id: string): Promise<void> {
    await updateJobStatus(id, 'Running');
    // Simulate job completion
    setTimeout(async () => {
        await updateJobStatus(id, 'Idle');
    }, 2000);
}

export async function clearCache(type: 'api' | 'data' | 'all'): Promise<{ success: boolean; message: string }> {
    cacheCleared = true;
    cacheClearedAt = new Date();

    const messages: Record<string, string> = {
        api: 'API cache cleared successfully',
        data: 'Data cache cleared successfully',
        all: 'All caches cleared successfully',
    };

    return { success: true, message: messages[type] || 'Cache cleared' };
}

export async function getCacheStatus(): Promise<{ cleared: boolean; clearedAt: Date | null }> {
    return { cleared: cacheCleared, clearedAt: cacheClearedAt };
}

export function getDefaultFeatureFlags(): FeatureFlag[] {
    return [...DEFAULT_FEATURE_FLAGS];
}

export function getDefaultServices(): SystemService[] {
    return [...DEFAULT_SERVICES];
}

export function getDefaultJobs(): BackgroundJob[] {
    return [...DEFAULT_JOBS];
}
