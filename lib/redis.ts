import {Redis} from "@upstash/redis";

function fixUrl(url: string) {
  if (!url) {
    return "";
  }
  if (url.startsWith("redis://") && !url.startsWith("redis://:")) {
    return url.replace("redis://", "redis://:");
  }
  if (url.startsWith("rediss://") && !url.startsWith("rediss://:")) {
    return url.replace("rediss://", "rediss://:");
  }
  return url;
}

class ClientRedis {
  static instance: Redis;

  constructor() {
    throw new Error("Use Singleton.getInstance()");
  }

  static getInstance(): Redis | null {
    if (!ClientRedis.instance) {
      const redis = new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIE_TOKEN,
      });
      ClientRedis.instance = redis;
    }
    return ClientRedis.instance;
  }
}

export default ClientRedis.getInstance();
