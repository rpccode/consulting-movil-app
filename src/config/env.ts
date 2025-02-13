import Constants from 'expo-constants';

export interface EnvConfig {
  env: string;
  apiUrl: string;
  apiKey: string;
  enableLogs: boolean;
  storageKeyPrefix: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
}

const extra = Constants.expoConfig?.extra;

export const config: EnvConfig = {
  env: extra?.env || 'development',
  apiUrl: extra?.apiUrl || 'http://localhost:3000',
  apiKey: extra?.apiKey || 'default_key',
  enableLogs: extra?.enableLogs ?? true,
  storageKeyPrefix: extra?.storageKeyPrefix || 'dev_',
  isProduction: extra?.env === 'production',
  isDevelopment: extra?.env === 'development',
  isStaging: extra?.env === 'staging',
};
