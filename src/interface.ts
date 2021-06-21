
// export interface InstanceConfig {
//   namespace: string;
//   extends?: string;
// }

export interface Client {
  updateAll(data: object): Promise<void>;
  getAll<T = any>(): Promise<T>;
  getValue<T = any>(path: string): Promise<T>;
  getHotValue<T = any>(path: string): Promise<T>;
  // 简单的处理方式，每个字段的变动只能注册一个监听事件
  onChange(key: string, handler: changeHandler): void;
  offChange(key: string): void;
  onError(handler: errorHandler): void;
  offError(handler: errorHandler): void;
}

export interface ClientConfig {
  localPath?: string;
  // remotePath?: string;
  configPath?: string;
  namespace: string;
  extends?: string;
  interval?: number;
}

export interface ErrorInfo {}

export type changeHandler = (value: any) => void

export type errorHandler = (error: ErrorInfo) => void
