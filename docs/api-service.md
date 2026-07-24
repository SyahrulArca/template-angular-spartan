# ApiService & Auth — HTTP + session

Dua modul terpisah dengan tanggung jawab jelas:

| Modul | Path | Peran |
| ----- | ---- | ----- |
| **ApiService** | `core/services/api` | HTTP transport (axios-like) |
| **Auth** | `core/auth` | Session state, login/logout, guards, 401 refresh |

Quick reference:

- [`core/services/api/how-to-use.md`](../src/app/core/services/api/how-to-use.md)
- [`core/auth/how-to-use.md`](../src/app/core/auth/how-to-use.md)

---

## Prinsip auth: cookie owned by backend

> **Menyimpan token ke cookie selalu tanggung jawab backend.**

Frontend tidak menyimpan token di `localStorage` atau mengirim `Authorization: Bearer` manual.

| Layer | Peran |
| ----- | ----- |
| Backend | `Set-Cookie` saat login/refresh, clear saat logout |
| `apiInterceptor` | `withCredentials: true` default |
| `authInterceptor` | 401 → `AuthService.refreshSession()` → retry |
| `AuthSessionService` | Signals: `isAuthenticated`, `currentUser` |
| `AuthService` | Facade: `login`, `logout`, `bootstrapSession` |

---

## Setup (`app.config.ts`)

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/services/api';
import { authInterceptor } from './core/auth';

provideHttpClient(withInterceptors([apiInterceptor, authInterceptor])),
```

---

## Struktur folder

```
core/
├── auth/
│   ├── auth-session.service.ts   ← state (signals)
│   ├── auth.service.ts           ← login, logout, refresh, bootstrap
│   ├── auth.interceptor.ts       ← 401 handling
│   ├── auth.guard.ts             ← authGuard, guestGuard
│   ├── auth.constants.ts
│   ├── auth.types.ts
│   └── index.ts
└── services/
    └── api/
        ├── api.service.ts        ← GET/POST/PUT/PATCH/DELETE
        ├── api.interceptor.ts    ← withCredentials
        └── index.ts
```

---

## Penggunaan

### Feature data API

```typescript
// features/tasks/apis/task.api.ts
@Injectable({ providedIn: 'root' })
export class TaskApi {
  private readonly api = inject(ApiService);
  list() { return this.api.get<Task[]>('/tasks'); }
}
```

### Auth

```typescript
import { AuthService } from '../../core/auth';

const auth = inject(AuthService);

auth.login({ email, password }).subscribe(() => router.navigate(['/dashboard']));
auth.logout().subscribe(() => router.navigate(['/login']));
auth.bootstrapSession().subscribe(); // app boot
```

### Route guard

```typescript
import { authGuard } from './core/auth';

{ path: 'dashboard', canActivate: [authGuard], ... }
```

---

## Environment

```env
NG_APP_API_URL=http://localhost:3000/api
```

Auth paths (`/auth/login`, `/auth/refresh`, dll.) di `core/auth/auth.constants.ts`.

---

## Backend checklist

- [ ] Cookie httpOnly + Secure (prod)
- [ ] CORS credentials + origin spesifik
- [ ] `POST /auth/refresh` set cookie baru
- [ ] `GET /auth/me` untuk bootstrap session

---

## Referensi

- [create-page.md](./create-page.md)
- [structure-folder.md](../src/app/features/(instructions)/structure-folder.md)
