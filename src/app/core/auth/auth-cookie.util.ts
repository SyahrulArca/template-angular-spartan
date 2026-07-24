import { appEnv } from '../config/app-env';

/**
 * Nama cookie tenant & refresh sudah dikonfigurasi di env.
 * Cookie httpOnly — frontend tidak bisa baca nilainya; dipakai sebagai flag
 * bahwa backend mengelola tenant + refresh cookie dan recovery lewat `/auth/refresh`.
 */
export function isAuthCookieConfigReady(): boolean {
  return Boolean(appEnv.cookieTenantKey && appEnv.cookieRefreshKey);
}

/** Backend mengirim tenant + refresh sebagai httpOnly cookie dengan nama dari env. */
export function getAuthCookieKeys(): { tenantKey: string; refreshKey: string } | null {
  if (!isAuthCookieConfigReady()) {
    return null;
  }

  return {
    tenantKey: appEnv.cookieTenantKey,
    refreshKey: appEnv.cookieRefreshKey,
  };
}

/** Saat `/auth/me` gagal, coba refresh jika mode cookie multitenant aktif. */
export function shouldRecoverSessionViaRefresh(): boolean {
  return isAuthCookieConfigReady();
}
