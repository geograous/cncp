import {
  Client,
  ClientConfig,
  ErrorInfo,
  errorHandler,
  changeHandler,
} from "./interface";
import { validateNotEmpty, getPathValue } from "./util";
import { get as httpGet } from "./http";
import { defaultConfig } from "./config";
// import { getAll, getValue, getHotValue, updateNamespaceData, onChange, onError  } from './commands'

export class BaseClient implements Client {
  // change event handlers
  private changeHandlerMap: Map<string, changeHandler> = new Map()
  // error event handlers
  private errorHandlerSet: Set<errorHandler> = new Set()
  // hot keys
  private hotKeySet: Set<string> = new Set()
  // remote config path
  private remoteConfigPath: string;
  // remote value
  private remoteValue: any;
  // 注意泄漏
  private intervalId: NodeJS.Timeout;

  constructor(private config: ClientConfig) {
    const newConfig = { ...defaultConfig, ...config };
    this.config = newConfig;
    this.remoteConfigPath = this.config.namespace;
    const intervalInMs = this.config.interval;
    this.intervalId = setInterval(() => {
      this.run(this)
    }, intervalInMs)
  }
  // called when destroy
  destroy() {
    clearInterval(this.intervalId)
    this.intervalId = null
  }
  // 后台执行
  private async run(context: BaseClient) {
    // sync remote config
    try {
      const newValue = await this.getAll()
      validateNotEmpty(newValue)
      // trigger changeHandler when updated
      if (this.remoteValue) {
        for(let hotKey of this.hotKeySet.values()) {
          const originalPathValue = getPathValue(this.remoteValue, hotKey)
          const newPathValue = getPathValue(newValue, hotKey)
          if (originalPathValue != newPathValue) {
            const changeHandler = this.changeHandlerMap.get(hotKey)
            changeHandler(this)
          }
        }
      }
    } catch(e) {
      console.error(e)
      // trigger errorHandler when errors occurred
      for(let handler of this.errorHandlerSet.values()) {
        handler(this)
      }
    }
  }
  async updateAll(data: object) {
    // validateNotEmpty(this.remoteConfigPath);
    // return httpGet(this.remoteConfigPath)
    throw 'please implement updateAll'
  }
  async getAll<T = any>() {
    validateNotEmpty(this.remoteConfigPath);
    return httpGet<T>(this.remoteConfigPath);
  }
  async getValue<T = any>(path: string) {
    validateNotEmpty(this.remoteConfigPath);
    validateNotEmpty(path);
    return httpGet<T>(this.remoteConfigPath, path);
  }
  async getHotValue<T = any>(path: string) {
    validateNotEmpty(this.remoteConfigPath);
    validateNotEmpty(path);
    if (!this.hotKeySet.has(path)) {
      this.hotKeySet.add(path);
    }
    return httpGet<T>(this.remoteConfigPath, path);
  }
  onChange(key: string, handler: changeHandler) {
    validateNotEmpty(key);
    validateNotEmpty(handler);
    if (this.changeHandlerMap.has(key)) {
      return;
    }
    this.changeHandlerMap.set(key, handler);
  }
  offChange(key: string) {
    validateNotEmpty(key);
    if (!this.changeHandlerMap.has(key)) {
      return;
    }
    this.changeHandlerMap.delete(key);
  }
  onError(handler: errorHandler) {
    validateNotEmpty(handler);
    if (this.errorHandlerSet.has(handler)) {
      return;
    }
    this.errorHandlerSet.add(handler);
  }
  offError(handler: errorHandler) {
    validateNotEmpty(handler);
    if (!this.errorHandlerSet.has(handler)) {
      return;
    }
    this.errorHandlerSet.delete(handler);
  }
}
