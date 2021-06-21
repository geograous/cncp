// import fetch from "node-fetch";
import { Client, ClientConfig } from "./interface";
import { BaseClient } from "./client";
import { validateNotEmpty } from './util'
import { update as httpUpdate, getNamespaceMeta, MetaPrefix } from './http'
// import { getKey, setKey } from "./cache";
// import { validateNotEmpty } from "./util";
// import { get, update, upload as httpUpload } from "./http";

// /**
//  * 上传配置文件
//  */
// export async function upload(client: Client): void {
//   validateNotEmpty(client);
//   const { configPath, remoteUrl } = client;
//   httpUpload();
// }

// export async function getAll(instance: Client): Promise<any> {}

// /**
//  * 读取配置
//  * @param path 配置的路径，支持 a.b.c 这种形式
//  * @param config 获取配置的参数，可以设置是否动态获取
//  */
// export async function getValue<T = any>(
//   instance: Client,
//   path: string
// ): Promise<T> {}

// /**
//  * 动态从服务器中获取配置
//  * @param path 配置的路径，支持 a.b.c 这种形式
//  */
// export async function getHotValue<T = any>(
//   instance: Client,
//   path: string
// ): Promise<T> {}

// // 更新实例数据
// export function updateNamespaceData(
//   instance: Client,
//   data: object
// ): Promise<void> {
//   validateNotEmpty(instance);
//   fetch();
// }

// export function applyConfig(config: ClientConfig): void {}

// export function syncConfig(): void {}

// export function fetchConfig(): void {}

// /**
//  * 设置配置更新的监听函数
//  * @param path 监听时间的路径，支持 a.b.c 这种形式，仅当路径下的内容发生变化时触发
//  * @param handler 目标路径下内容变化的监听函数
//  */
// export function onChange(path: string, handler: (value: any) => void): void {}

// /**
//  * 设置配置平台报错时的监听函数
//  * @param info 错误信息
//  */
// export function onError(handler: (err: ErrorInfo) => void): void {}



// 创建实例
export async function createClient(config: ClientConfig): Promise<Client> {
  validateNotEmpty(config)
  validateNotEmpty(config.namespace)
  // fetch remote config and check
  const exist = await getNamespaceMeta(config.namespace)
  if (exist) {
    throw 'namespace already exist'
  }
  let extendConfig = null
  if (config.extends) {
    extendConfig = await getNamespaceMeta(config.extends)
  }
  // merge config
  const newConfig = { ...extendConfig, ...config };
  // push to remote
  await httpUpdate(config.namespace, newConfig, MetaPrefix)
  // create remove instance
  return new BaseClient(newConfig);
}
