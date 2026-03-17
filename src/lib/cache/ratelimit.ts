import { Ratelimit } from "@upstash/ratelimit";
import getRedis from "./redis";

const _redis = getRedis();

export const searchRateLimit = _redis
  ? new Ratelimit({
      redis: _redis,
      limiter: Ratelimit.slidingWindow(30, "60 s"),
    })
  : null;
