# Algoritma route guard

Guard sudah ada. Keduanya fungsi `CanActivateFn` di `src/app/core/auth/auth.guard.ts`, di-export dari `core/auth`.

| Guard | Route yang memakainya sekarang | Tugas |
| ----- | ------------------------------ | ----- |
| `guestGuard` | `/login` | Halaman tamu. User yang sudah login tidak melihat form. |
| `authGuard` | Belum dipasang. Di `app.routes.ts` masih komentar pada route shell | Halaman yang butuh session. |

Selama `canActivate: [authGuard]` pada shell tetap dikomentari, `/dashboard`, `/tasks`, dan `/settings` bisa dibuka tanpa login. Guard-nya sendiri sudah jalan kalau dipasang.

Guard tidak memanggil HTTP. Ia menunggu bootstrap session selesai, lalu membaca signal `isAuthenticated`.

## Sebelum guard berjalan

`app.config.ts` menjalankan `AuthService.bootstrapSession()` lewat `provideAppInitializer`:

1. `GET /auth/me`. Sukses → `markAuthenticated(user)`.
2. Gagal, dan `NG_APP_COOKIE_TENANT_KEY` plus `NG_APP_COOKIE_REFRESH_KEY` terisi → `POST /auth/refresh`, lalu `GET /auth/me` sekali lagi.
3. `finalize` selalu memanggil `markSessionReady()`, baik session ada maupun tidak.

`ensureSessionReady()` di kedua guard menunggu signal `sessionReady`. Kalau initializer sudah selesai, pemanggilan ini langsung lolos.

## `authGuard`

Melindungi route yang butuh user sudah login. Argumen yang dipakai hanya `state.url` (URL yang ingin dibuka).

```
ensureSessionReady()
        │
        ▼
isAuthenticated?
   │ya                         │tidak
   ▼                           ▼
 return true            redirectToSsoEntry(state.url)?
                         │ya                    │tidak
                         ▼                      ▼
                   return false          UrlTree /login
                   (browser pindah       ?redirect_uri=<state.url>
                    ke SSO)
```

`return false` setelah redirect SSO membatalkan navigasi Angular, karena pindah halamannya lewat `window.location.href`.

## `guestGuard`

Melindungi `/login` agar tidak tampil untuk user yang sudah punya session, dan agar mode SSO tidak menampilkan form lokal.

```
ensureSessionReady()
        │
        ▼
isAuthenticated?
   │ya                         │tidak
   ▼                           ▼
 UrlTree /dashboard     useSso?
                         │ya                         │tidak
                         ▼                           ▼
               redirectToSsoEntry(state.url)?    return true
                │ya                    │tidak      (tampilkan /login)
                ▼                      ▼
          return false           UrlTree /dashboard
```

Cabang terakhir (`useSso` true tetapi `NG_APP_REDIRECT_SSO` kosong) tidak membuka form login. Guard mengarahkan ke `/dashboard`.

## Redirect SSO

`redirectToSsoEntry` di `auth-redirect.util.ts` hanya jalan bila `NG_APP_USE_SSO` true **dan** `NG_APP_REDIRECT_SSO` tidak kosong.

1. Buat URL dari `NG_APP_REDIRECT_SSO` terhadap origin halaman sekarang.
2. Kalau ada URL yang ingin dibuka, tempel sebagai query `redirect_uri`.
3. Set `window.location.href`, lalu return `true`.

`usesLocalLogin()` adalah kebalikan `NG_APP_USE_SSO`. Bukan `useSso` → form `/login` lokal yang dipakai.

| `NG_APP_USE_SSO` | `NG_APP_REDIRECT_SSO` | Belum login, buka shell (`authGuard`) | Buka `/login` (`guestGuard`) |
| ---------------- | --------------------- | -------------------------------------- | ---------------------------- |
| false            | apa saja              | `/login?redirect_uri=...`              | Form login tampil            |
| true             | terisi                | Browser pindah ke SSO                  | Browser pindah ke SSO        |
| true             | kosong                | `/login?redirect_uri=...`              | `/dashboard`                 |

## Memasang `authGuard`

Satu baris di parent shell melindungi semua child (`dashboard`, `tasks`, `settings`, `**`):

```typescript
{
  path: '',
  loadComponent: () => import('./layout/app-shell/app-shell').then((m) => m.AppShell),
  canActivate: [authGuard],
  children: [ /* ... */ ],
}
```

`/login` tetap sibling di luar shell dan tetap memakai `guestGuard`, supaya redirect ke login tidak berputar.

Guard khusus satu feature (bukan session global) bukan milik file ini. Itu `features/<nama>/guards/`, lihat [structure-folder.md](../architecture/structure-folder.md).
