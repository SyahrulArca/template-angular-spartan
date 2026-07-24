import { Injectable, signal } from '@angular/core';
import type { AuthUser } from './auth.types';

/**
 * State container session auth (signals).
 *
 * Tidak melakukan HTTP — orchestration ada di `AuthService`.
 * Token disimpan di httpOnly cookie oleh backend, bukan di service ini.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly authenticated = signal(false);
  private readonly user = signal<AuthUser | null>(null);
  private readonly ready = signal(false);

  readonly isAuthenticated = this.authenticated.asReadonly();
  readonly currentUser = this.user.asReadonly();
  readonly sessionReady = this.ready.asReadonly();

  markAuthenticated(user?: AuthUser | null): void {
    this.authenticated.set(true);
    if (user !== undefined) {
      this.user.set(user);
    }
  }

  setUser(user: AuthUser | null): void {
    this.user.set(user);
  }

  clearSession(): void {
    this.authenticated.set(false);
    this.user.set(null);
  }

  markSessionReady(): void {
    this.ready.set(true);
  }
}
