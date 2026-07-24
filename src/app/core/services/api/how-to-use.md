# How to use — ApiService

HTTP transport layer — **bukan** tempat logic auth. Auth ada di [`core/auth/how-to-use.md`](../../auth/how-to-use.md).

## Import

```typescript
import { ApiService } from '../../core/services/api';
```

## Request data

```typescript
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  private readonly api = inject(ApiService);

  list() {
    return this.api.get<Task[]>('/tasks');
  }

  create(body: CreateTaskDto) {
    return this.api.post<Task>('/tasks', body);
  }
}
```

## Config

| Option | Default | Keterangan |
| ------ | ------- | ---------- |
| `withCredentials` | `true` | Cookie auth ke backend |
| `skipAuth` | `false` | Skip retry refresh saat 401 |
| `skipRefresh` | `false` | Skip panggilan refresh saat 401 |
| `params` / `headers` | — | Query & header tambahan |

## Login / logout

**Jangan** panggil endpoint auth langsung dari feature — gunakan `AuthService`:

```typescript
import { AuthService } from '../../core/auth';
```

## Interceptor

| Interceptor | Folder | Peran |
| ----------- | ------ | ----- |
| `apiInterceptor` | `core/services/api` | Default `withCredentials: true` |
| `authInterceptor` | `core/auth` | 401 → refresh session |

Dokumentasi lengkap: [`docs/api-service.md`](../../../../docs/api-service.md).
