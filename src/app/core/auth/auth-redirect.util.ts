import { appEnv } from '../config/app-env';

/** Redirect ke entry auth (SSO eksternal). Return true jika redirect dieksekusi. */
export function redirectToSsoEntry(redirect_uri?: string): boolean {
  if (!appEnv.useSso || !appEnv.redirectSso) {
    return false;
  }

  const target = new URL(appEnv.redirectSso, window.location.origin);

  if (redirect_uri) {
    target.searchParams.set('redirect_uri', redirect_uri);
  }

  window.location.href = target.toString();
  return true;
}

export function usesLocalLogin(): boolean {
  return !appEnv.useSso;
}
