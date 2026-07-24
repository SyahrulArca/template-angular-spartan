function readEnvBoolean(value: string | undefined, fallback = false): boolean {
  if (value === undefined || value === '') {
    return fallback;
  }

  return value === 'true' || value === '1';
}

export const appEnv = {
  env: import.meta.env.NG_APP_ENV ?? 'development',
  name: import.meta.env.NG_APP_NAME ?? 'Spartan Template',
  apiUrl: import.meta.env.NG_APP_API_URL ?? 'http://localhost:3000/api',
  enableDebug: readEnvBoolean(import.meta.env.NG_APP_ENABLE_DEBUG, false),
  useSso: readEnvBoolean(import.meta.env.NG_APP_USE_SSO, false),
  redirectSso: import.meta.env.NG_APP_REDIRECT_SSO ?? '',
  cookieTenantKey: import.meta.env.NG_APP_COOKIE_TENANT_KEY ?? '',
  cookieRefreshKey: import.meta.env.NG_APP_COOKIE_REFRESH_KEY ?? '',
} as const;

export type AppEnv = typeof appEnv;
