// Runtime configuration interface
interface RuntimeConfig {
  VITE_BACKEND_URL: string;
  VITE_APP_TITLE: string;
  VITE_APP_VERSION: string;
}

// Extend the window object to include runtime config
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

/**
 * Get environment variable value with fallback to build-time value
 * @param key - The environment variable key
 * @param fallback - Fallback value if not found
 * @returns The environment variable value
 */
export const getEnvVar = (key: keyof RuntimeConfig, fallback?: string): string => {
  // First try runtime config (injected at container startup)
  if (window.__RUNTIME_CONFIG__?.[key]) {
    return window.__RUNTIME_CONFIG__[key];
  }

  // Fallback to build-time environment variables
  const buildTimeValue = import.meta.env[key];
  if (buildTimeValue) {
    return buildTimeValue;
  }

  // Use fallback if provided
  if (fallback) {
    return fallback;
  }

  // Default values based on key
  switch (key) {
    case 'VITE_BACKEND_URL':
      return 'http://localhost:3050';
    case 'VITE_APP_TITLE':
      return 'RightOn';
    case 'VITE_APP_VERSION':
      return '1.0.0';
    default:
      return '';
  }
};

/**
 * Get the backend URL with runtime configuration support
 */
export const getBackendUrl = (): string => {
  return getEnvVar('VITE_BACKEND_URL');
};

/**
 * Get the app title with runtime configuration support
 */
export const getAppTitle = (): string => {
  return getEnvVar('VITE_APP_TITLE');
};

/**
 * Get the app version with runtime configuration support
 */
export const getAppVersion = (): string => {
  return getEnvVar('VITE_APP_VERSION');
};

/**
 * Check if we're running in development mode
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Check if we're running in production mode
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};
