import { Redis } from '@upstash/redis';

export const redis = Redis.fromEnv();

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = { ttl: 3600 }
): Promise<T> {
  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return cachedData as T;
    }
  } catch (error) {
    console.error(`Redis Get Error for key ${key}:`, error);
  }

  const freshData = await fetcher();

  try {
    if (freshData) {
      await redis.set(key, freshData as any, options.ttl ? { ex: options.ttl } : undefined);
    }
  } catch (error) {
    console.error(`Redis Set Error for key ${key}:`, error);
  }

  return freshData;
}
