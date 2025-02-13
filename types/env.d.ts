// env.d.ts
declare module '@env' {
    export const API_URL: string;
    export const API_KEY: string;
    export const ENV: 'development' | 'staging' | 'production';
    export const STORAGE_KEY_PREFIX: string;
    export const MAX_UPLOAD_SIZE: string;
    export const ENABLE_LOGS: string;
  }