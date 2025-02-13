import { ExpoConfig, ConfigContext } from 'expo/config';

enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

// Obtener el ambiente desde los argumentos de línea de comando o variable de entorno
const getEnvironment = () => {
  const env = process.env.APP_ENV || Environment.DEVELOPMENT;
  return env as Environment;
};

// Configuraciones específicas por ambiente
const envConfig = {
  [Environment.DEVELOPMENT]: {
    apiUrl: 'http://localhost:3000',
    apiKey: 'dev_key_123',
    enableLogs: true,
    storageKeyPrefix: 'dev_',
  },
  [Environment.STAGING]: {
    apiUrl: 'https://staging-api.example.com',
    apiKey: 'staging_key_456',
    enableLogs: true,
    storageKeyPrefix: 'staging_',
  },
  [Environment.PRODUCTION]: {
    apiUrl: 'https://consult-board-api-production.up.railway.app',
    apiKey: 'prod_key_789',
    enableLogs: false,
    storageKeyPrefix: 'prod_',
  },
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const env = getEnvironment();
  const envSpecificConfig = envConfig[env];

  return {
    ...config,
    name: `${config.name}${env === Environment.DEVELOPMENT ? ' (Dev)' : env === Environment.STAGING ? ' (Staging)' : ''}`,
    slug: config.slug || 'consulting-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: `com.rpccode.consultingApp${env !== Environment.PRODUCTION ? `.${env}` : ''}`
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF'
      },
      package: `com.rpccode.consultingApp${env !== Environment.PRODUCTION ? `.${env}` : ''}`
    },
    extra: {
      env,
      ...envSpecificConfig,
      eas: {
        projectId: "faa41b08-88f2-4d6d-be65-671d4c2663c1"
      }
    }
  };
};