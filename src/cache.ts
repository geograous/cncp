import Cache from "lru-cache";

// 过期时间 30 days
const cacheOptions = {
  maxAge: 1000 * 3600 * 24 * 30,
  max: 500,
};

const cache = new Cache(cacheOptions);

export function getKey(key: string) {
  return cache.get(key)
}

export function setKey(key: string, value: string) {
  return cache.set(key, value)
}
