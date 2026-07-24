import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { redirectToSsoEntry, usesLocalLogin } from './auth-redirect.util';

/** Lindungi route yang butuh user sudah login. */
export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ensureSessionReady();

  if (auth.isAuthenticated()) {
    return true;
  }

  if (redirectToSsoEntry(state.url)) {
    return false;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { redirect_uri: state.url },
  });
};

/** Halaman login — redirect jika sudah auth; SSO mode redirect ke provider eksternal. */
export const guestGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ensureSessionReady();

  if (auth.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }

  if (!usesLocalLogin()) {
    if (redirectToSsoEntry(state.url)) {
      return false;
    }

    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
