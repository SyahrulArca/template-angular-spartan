import { inject, Injectable } from '@angular/core';
import { Observable, finalize, map, shareReplay, tap } from 'rxjs';
import { ApiService } from '../services/api/api.service';
import {
  AUTH_LOGIN_PATH,
  AUTH_LOGOUT_PATH,
  AUTH_ME_PATH,
  AUTH_REFRESH_PATH,
} from './auth.constants';
import { AuthSessionService } from './auth-session.service';
import type { AuthUser, LoginCredentials } from './auth.types';

/**
 * Facade auth — login, logout, refresh, bootstrap session.
 * Cookie auth diset/hapus oleh backend; service ini hanya orchestration + state UI.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly session = inject(AuthSessionService);
  private refreshRequest$: Observable<void> | null = null;

  readonly isAuthenticated = this.session.isAuthenticated;
  readonly currentUser = this.session.currentUser;

  login(credentials: LoginCredentials): Observable<void> {
    return this.api.post<void>(AUTH_LOGIN_PATH, credentials, { skipAuth: true }).pipe(
      tap(() => this.session.markAuthenticated()),
    );
  }

  logout(): Observable<void> {
    return this.api.post<void>(AUTH_LOGOUT_PATH, null).pipe(
      tap(() => this.session.clearSession()),
    );
  }

  /** Validasi session dari cookie (mis. saat app boot). */
  bootstrapSession(): Observable<AuthUser> {
    return this.api.get<AuthUser>(AUTH_ME_PATH).pipe(
      tap((user) => this.session.markAuthenticated(user)),
    );
  }

  /**
   * Minta backend refresh cookie session.
   * Dipanggil interceptor saat 401; dedupe request paralel.
   */
  refreshSession(): Observable<void> {
    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    this.refreshRequest$ = this.api
      .post<void>(AUTH_REFRESH_PATH, null, { skipAuth: true, skipRefresh: true })
      .pipe(
        tap(() => this.session.markAuthenticated()),
        map(() => void 0),
        shareReplay({ bufferSize: 1, refCount: false }),
        finalize(() => {
          this.refreshRequest$ = null;
        }),
      );

    return this.refreshRequest$;
  }

  clearSession(): void {
    this.session.clearSession();
  }
}
