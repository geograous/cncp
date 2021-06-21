import { join } from "path";
import fetch from "node-fetch";
import { getKey, setKey } from './cache'
import { getPathValue, validateNotEmpty } from './util'

export const BasePrefix = "https://cdn.geograous.com/config/";
export const MetaPrefix = "https://cdn.geograous.com/config-meta/"

// update data
export function update(urlPath: string, data?: any, prefix = BasePrefix) {
  throw 'please implement by yourself'
}

// upload data
export function upload() {
  throw 'please implement by yourself'
}

// fetch data
export async function get<T = any>(urlPath: string, path?: string, prefix = BasePrefix) {
  validateNotEmpty(urlPath)
  const url = join(prefix, urlPath)
  // seek cache
  const cacheData = getKey(url)
  if (cacheData) {
    return getPathValue<T>(cacheData, path)
  }
  // fetch from http
  const result = await fetch(url);
  const remoteData = await result.json();
  setKey(url, remoteData)
  return getPathValue<T>(remoteData, path)
}

export async function getNamespaceMeta(namespace: string) {
  validateNotEmpty(namespace)
  const url = join(MetaPrefix, namespace)
  return await fetch(url);
}
