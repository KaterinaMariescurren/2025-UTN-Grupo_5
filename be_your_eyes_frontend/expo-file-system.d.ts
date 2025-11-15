// expo-file-system.d.ts
declare module 'expo-file-system' {
  // Rutas estándar (API clásica y nueva)
  export const cacheDirectory: string;
  export const documentDirectory: string;

  // Nueva API (v19+)
  export const Paths: {
    cache: string;
    document: string;
  };

  export class Directory {
    constructor(uri: string);
    readonly uri: string;
    create(): Promise<void>;
    delete(): Promise<void>;
    exists(): Promise<boolean>;
  }

  export class File {
    constructor(parent: Directory | string, name?: string);
    readonly uri: string;
    write(content: string, options?: { encoding?: 'utf8' | 'base64' }): Promise<void>;
    text(options?: { encoding?: 'utf8' | 'base64' }): Promise<string>;
    delete(): Promise<void>;
    exists(): Promise<boolean>;
  }

  export const StorageAccessFramework: {
    requestDirectoryPermissionsAsync(initialFileUrl?: string): Promise<{ granted: boolean; directoryUri: string }>;
    createFileAsync(parentUri: string, fileName: string, mimeType: string): Promise<string>;
  };

  // API clásica (compatibilidad)
  export enum EncodingType {
    UTF8 = 'utf8',
    Base64 = 'base64',
  }

  export type DownloadResult = {
    uri: string;
    status: number;
    headers?: { [key: string]: string } | null;
  };

  export function downloadAsync(url: string, fileUri: string, options?: { headers?: { [key: string]: string } }): Promise<DownloadResult>;
  export function writeAsStringAsync(fileUri: string, contents: string, options?: { encoding?: EncodingType | string }): Promise<void>;
  export function readAsStringAsync(fileUri: string, options?: { encoding?: EncodingType | string }): Promise<string>;
  export function deleteAsync(fileUri: string, options?: { idempotent?: boolean }): Promise<void>;
  export function getInfoAsync(fileUri: string, options?: { size?: boolean; md5?: boolean; } ): Promise<{ exists: boolean; isDirectory?: boolean; size?: number; md5?: string | null; uri: string }>;

  // helper si hace falta
  export function makeDirectoryAsync(dirUri: string, options?: { intermediates?: boolean }): Promise<void>;
  export function readDirectoryAsync(dirUri: string): Promise<string[]>;

  // Reexport default (compatibilidad con import * as FileSystem)
  const _default: {
    cacheDirectory: string;
    documentDirectory: string;
    Paths: typeof Paths;
    File: typeof File;
    Directory: typeof Directory;
    StorageAccessFramework: typeof StorageAccessFramework;
    EncodingType: typeof EncodingType;
    downloadAsync: typeof downloadAsync;
    writeAsStringAsync: typeof writeAsStringAsync;
    readAsStringAsync: typeof readAsStringAsync;
    deleteAsync: typeof deleteAsync;
    getInfoAsync: typeof getInfoAsync;
    makeDirectoryAsync: typeof makeDirectoryAsync;
    readDirectoryAsync: typeof readDirectoryAsync;
  };

  export default _default;
}