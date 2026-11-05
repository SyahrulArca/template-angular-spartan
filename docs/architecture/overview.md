# Arsitektur aplikasi

Template ini adalah **SPA Angular 21** (standalone, signals, OnPush). Tidak ada NgModule feature, NgRx, atau SSR. Entry point: `src/main.ts` → `bootstrapApplication(App, appConfig)`.

Dokumen ini menggambarkan struktur yang **sudah ada di repo**. Feature baru digarap dengan DDD di dalam `features/<nama>/` — lihat [ddd.md](./ddd.md). Kontrak foldernya ada di [structure-folder.md](./structure-folder.md).

## Lapisan

```
template-angular-spartan/
├── src/
│   ├── main.ts                      # bootstrap browser
│   ├── styles.css                   # Tailwind v4 + token warna + radius Lyra
│   └── app/
│       ├── app.ts                   # root: <router-outlet />
│       ├── app.config.ts            # providers global
│       ├── app.routes.ts            # route tree
│       ├── core/                    # infrastruktur lintas halaman
│       ├── layout/                  # chrome aplikasi (shell, sidebar, header)
│       └── features/                # halaman yang di-lazy-load
└── libs/ui/                         # Spartan Helm (styled), disalin ke repo
```

`@spartan-ng/brain` tetap dari npm (behavior headless). Helm di-copy ke `libs/ui/` dan di-alias lewat `paths` di `tsconfig.json` (`@spartan-ng/helm/*`). `components.json` menunjuk `componentsPath: libs/ui`, style `lyra`.

### `core/` — dipakai semua, tidak kenal satu feature

| Folder          | Peran                                | Contoh                                                         |
| --------------- | ------------------------------------ | -------------------------------------------------------------- |
| `auth/`         | Session, login/logout, guard, 401    | `AuthService`, `authGuard`                                     |
| `services/api/` | HTTP transport                       | `ApiService`, `apiInterceptor`                                 |
| `services/`     | Service lintas halaman lain          | `ThemeService`, `ConfirmService`, `NumberFormatContextService` |
| `config/`       | Data konfigurasi, bukan class        | `appEnv`, `appMenuSidebar`, `appHeaderProducts`                |
| `components/`   | UI yang boleh dipakai banyak feature | toast, confirm dialog, skeleton, number format                 |
| `utils/`        | Fungsi murni                         | `DateUtil`, `StringUtil`, `ImageUtil`, `ArrayObjectUtil`       |
| `constanta/`    | Tabel konstanta                      | `number-template.ts`                                           |

### `layout/` — bingkai, bukan domain

| Folder             | Peran                                                                           |
| ------------------ | ------------------------------------------------------------------------------- |
| `app-shell/`       | Route parent: sidebar + header + `<router-outlet />` + toaster                  |
| `app-sidebar/`     | Nav dari `appMenuSidebar`                                                       |
| `app-header/`      | Breadcrumb, theme, product switcher, notifikasi, user. Potongan UI ada di `ui/` |
| `app-page-header/` | Judul halaman yang di-compose feature. Slot narasi ada di `ui/`                 |

### `features/` — satu bounded context, satu folder

Pola yang dianjurkan: DDD per feature. Model, state, API, dan UI sebuah kemampuan tinggal berdampingan, tidak dipecah ke `core/` atau feature lain. Pemetaannya ada di [ddd.md](./ddd.md).

| Bentuk | Kapan | Yang ada sekarang |
| ------ | ----- | ----------------- |
| **DDD** | Ada domain: tipe, daftar, aturan, atau CRUD | `tasks/` — `models/`, `data/`, `pages/`, `ui/` |
| **Datar** | Belum ada domain, satu layar saja | `login/`, `dashboard/`, `settings/`, `not-found/` |

`tasks/` adalah referensi hidup. Feature lain belum punya `apis/` atau `services/`. Halaman datar yang kemudian tumbuh tetap dipecah di dalam foldernya sendiri.

## Arah impor

```
app.ts / app.config / app.routes
        │
        ├── layout  ──►  core, libs/ui, @spartan-ng/brain
        ├── features ──► layout (page header), core, libs/ui
        └── core ──► libs/ui, @spartan-ng/brain
```

- Feature **tidak** mengimpor feature lain.
- `core` **tidak** mengimpor `features` atau `layout`.
- `libs/ui` tidak mengimpor `src/app`.

## Boot

`app.config.ts` mendaftarkan, berurutan:

1. `provideRouter(routes)`
2. `provideSpartanHlm()` — overlay CDK (dialog, sheet, tooltip) aman di dalam layout `fixed`
3. `provideHttpClient(withInterceptors([apiInterceptor, authInterceptor]))`
4. `provideAppInitializer` → `AuthService.bootstrapSession()`

Initializer selesai dulu, baru aplikasi dianggap siap. Guard yang butuh session memanggil `ensureSessionReady()` supaya tidak membaca signal sebelum bootstrap selesai.

## Route

```
/login                         guestGuard, di luar shell
/                              AppShell (lazy)
  ├── ''          → redirect /dashboard
  ├── dashboard
  ├── tasks
  ├── settings
  └── **          NotFound
```

`Login` sibling dari shell, jadi tidak dapat sidebar. Halaman di dalam shell dapat `data.breadcrumb`; `AppHeader` membaca route aktif dan menampilkan label itu.

`authGuard` sudah ada, tapi **belum dipasang** di route shell (`app.routes.ts` masih dikomentari). Selama itu, shell bisa dibuka tanpa session. Algoritmanya ada di [algorithm/guard.md](../algorithm/guard.md).

## Dua jalur auth

`appEnv.useSso` (`NG_APP_USE_SSO`) memilih strategi di `auth-redirect.util.ts`:

| Mode                   | Perilaku                                                                 |
| ---------------------- | ------------------------------------------------------------------------ |
| Lokal (`useSso` false) | `/login` + `guestGuard`. Form memanggil `AuthService.login`.             |
| SSO (`useSso` true)    | `guestGuard` / `authGuard` mengarahkan browser ke `NG_APP_REDIRECT_SSO`. |

Token tidak disimpan di frontend. Backend yang `Set-Cookie`. Detail HTTP ada di [api/api-service.md](../api/api-service.md).

## State

| State                                        | Pemilik                      | Scope                                             |
| -------------------------------------------- | ---------------------------- | ------------------------------------------------- |
| Session (`isAuthenticated`, `currentUser`)   | `AuthSessionService`         | root                                              |
| Tema gelap                                   | `ThemeService`               | root, `localStorage` key `theme`                  |
| Format angka                                 | `NumberFormatContextService` | root, `localStorage`                              |
| Daftar task                                  | `TaskStore`                  | **page** — `providers: [TaskStore]` di `TaskPage` |
| Sheet terbuka, id yang diedit, target delete | signal di `TaskPage`         | component                                         |

Store halaman sengaja tidak `providedIn: 'root'`, supaya state hilang saat page di-destroy.

## UI

- Styling: Tailwind utility + token semantik Spartan (`bg-background`, `text-muted-foreground`). Bukan file CSS per component.
- Ikon: `@ng-icons/lucide`, didaftarkan per component lewat `provideIcons()`.
- Feedback: `appToast()` (bungkus Sonner) dan `ConfirmService` (bungkus `HlmDialogService`). Toaster dipasang sekali di `AppShell`.

## Lihat juga

- [ddd.md](./ddd.md) — pola yang dianjurkan: satu bounded context per feature
- [design-patterns.md](./design-patterns.md) — pola yang dipakai, dengan file acuannya
- [structure-folder.md](./structure-folder.md) — template folder feature
- [development/create-page.md](../development/create-page.md) — menambah route + sidebar
- [sample/tasks-crud.md](../sample/tasks-crud.md) — sample CRUD
