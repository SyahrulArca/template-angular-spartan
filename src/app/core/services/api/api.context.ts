import { HttpContextToken } from '@angular/common/http';

/** Lewati retry refresh token saat 401 (mis. endpoint login/register). */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

/** Lewati retry refresh saat 401 (mis. endpoint `/auth/refresh` itu sendiri). */
export const SKIP_REFRESH = new HttpContextToken<boolean>(() => false);
