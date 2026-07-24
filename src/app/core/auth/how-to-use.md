# How to use — Auth

Modul auth terpisah dari HTTP transport (`core/services/api`).

## Prinsip

> **Token disimpan di httpOnly cookie oleh backend.** Modul ini tidak menyimpan token di frontend.

| Layer | Folder | Peran |
| ----- | ------ | ----- |
| HTTP transport | `core/services/api` | GET/POST, `withCredentials` |
| Auth orchestration | `core/auth` | Login, logout, refresh, guards |
| Session state | `AuthSessionService` | Signals UI (`isAuthenticated`, `currentUser`) |

---

## Struktur

```
core/auth/
├── auth-session.service.ts   ← state (signals), tanpa HTTP
├── auth.service.ts           ← facade: login, logout, refresh, bootstrap
├── auth.interceptor.ts       ← handle 401 → refresh
├── auth.guard.ts             ← authGuard, guestGuard
├── auth.constants.ts         ← path endpoint auth
├── auth.types.ts
├── how-to-use.md
└── index.ts
```

Registrasi di `app.config.ts`:

```typescript
provideHttpClient(withInterceptors([apiInterceptor, authInterceptor])),
```

Urutan: **api** dulu (credentials) → **auth** (401 retry).

---

## Import

```typescript
import {
  AuthService,
  AuthSessionService,
  authGuard,
  guestGuard,
} from '../../core/auth';
```

---

## 1. Login & logout

```typescript
import { inject, Injectable } from '@angular/core';
import { AuthService, type LoginCredentials } from '../../core/auth';

@Injectable({ providedIn: 'root' })
export class LoginFacade {
  private readonly auth = inject(AuthService);

  login(credentials: LoginCredentials) {
    return this.auth.login(credentials);
  }

  logout() {
    return this.auth.logout();
  }
}
```

Backend set cookie via `Set-Cookie` — frontend cukup panggil `auth.login()` lalu redirect.

---

## 2. Bootstrap session (app boot)

Cookie httpOnly tidak bisa dibaca JS. Validasi lewat `/auth/me`:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth';

@Component({ /* App shell atau root */ })
export class App implements OnInit {
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.bootstrapSession().subscribe({
      error: () => this.auth.clearSession(),
    });
  }
}
```

---

## 3. Cek state di component

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth';

@Component({ /* ... */ })
export class HeaderUser {
  private readonly auth = inject(AuthService);

  protected readonly isAuthenticated = this.auth.isAuthenticated;
  protected readonly currentUser = this.auth.currentUser;
}
```

Atau inject langsung `AuthSessionService` jika hanya butuh baca state (tanpa aksi login/logout).

---

## 4. Route guard

```typescript
// app.routes.ts
import { authGuard, guestGuard } from './core/auth';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
    canActivate: [guestGuard],
  },
];
```

> Route `/login` perlu dibuat di feature — guard sudah siap.

---

## 5. Alur 401 (otomatis)

```
Request → 401 → authInterceptor → AuthService.refreshSession()
    → POST /auth/refresh (cookie) → backend Set-Cookie → retry request
    → gagal → clearSession()
```

Tidak perlu handle manual di setiap feature API.

---

## 6. Pembagian tanggung jawab

| Service | Kapan dipakai |
| ------- | ------------- |
| `AuthService` | Login, logout, bootstrap, refresh — **gunakan ini di feature** |
| `AuthSessionService` | Hanya baca/update state internal — biasanya via `AuthService` |
| `ApiService` | Request data non-auth orchestration (`TaskApi`, dll.) |

---

## 7. Backend checklist

- [ ] Login/refresh: `Set-Cookie` httpOnly
- [ ] Logout: clear cookie
- [ ] CORS: `Allow-Credentials: true` + origin spesifik
- [ ] Sesuaikan path di `auth.constants.ts` jika berbeda

---

## Referensi

- [`core/services/api/how-to-use.md`](../services/api/how-to-use.md) — HTTP wrapper
- [`docs/api-service.md`](../../../../docs/api-service.md) — dokumentasi lengkap HTTP + auth
