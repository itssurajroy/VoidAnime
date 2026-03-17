import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    // Graceful no-op in dev when Redis is not configured
    return null;
  }
  redis = new Redis({ url, token });
  return redis;
}

export { getRedis };
export default getRedis;
