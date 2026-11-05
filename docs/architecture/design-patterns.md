# Design pattern

Pola yang **benar-benar dipakai** di template ini, plus tempat melihatnya. Bukan katalog pola yang belum ada.

Peta lapisannya ada di [overview.md](./overview.md). Cara menggarap feature baru ada di [ddd.md](./ddd.md): satu bounded context = satu folder `features/<nama>/`.

## Standalone, OnPush, lazy route

Setiap component standalone dan `ChangeDetectionStrategy.OnPush`. Default itu dikunci di schematic `angular.json`, jadi `ng g c` mengikutinya.

Route tidak memakai `loadChildren` / NgModule. Satu URL = satu `loadComponent`:

```typescript
loadComponent: () => import('./features/tasks/pages/task-page/task-page').then((m) => m.TaskPage);
```

Root (`App`) hanya `<router-outlet />`. Tidak ada logic di situ.

## Layout route

Shell adalah **parent route**, bukan wrapper di `App`.

- `AppShell` merender sidebar, header, outlet, dan `<hlm-toaster>`.
- Child route (`dashboard`, `tasks`, `settings`, `**`) tampil di outlet itu.
- `/login` sibling di luar shell, jadi halaman penuh tanpa nav.

`data.breadcrumb` di route adalah kontrak kecil antara routing dan header. `AppHeader` mengubah `NavigationEnd` jadi signal (`toSignal`), lalu `computed` mengambil `data.breadcrumb` di route paling dalam.

## Config sebagai data

Menu, produk header, dan env bukan service.

| Data                        | File                        | Bentuk                                            |
| --------------------------- | --------------------------- | ------------------------------------------------- |
| Env build                   | `core/config/app-env.ts`    | objek `as const`, baca `import.meta.env.NG_APP_*` |
| Sidebar                     | `core/config/app-menu.ts`   | array `AppMenuSidebarGroup` + helper murni        |
| Header product & notifikasi | `core/config/app-header.ts` | array item + map ikon                             |

Component layout hanya me-render array itu. Menambah menu = menambah data, lalu route terpisah di `app.routes.ts`.

## Facade + state container

Auth dipecah dua class, keduanya `providedIn: 'root'`:

| Class                | Boleh HTTP?            | Tugas                                                    |
| -------------------- | ---------------------- | -------------------------------------------------------- |
| `AuthSessionService` | Tidak                  | Signal: `isAuthenticated`, `currentUser`, `sessionReady` |
| `AuthService`        | Ya, lewat `ApiService` | `login`, `logout`, `bootstrapSession`, `refreshSession`  |

UI dan guard membaca signal lewat facade (`auth.isAuthenticated`), bukan lewat session service. Session tidak menyimpan token; cookie httpOnly milik backend.

`refreshSession()` memakai `shareReplay` + field `refreshRequest$`. Beberapa 401 bersamaan hanya memicu **satu** `POST /auth/refresh`.

## Functional guard dan interceptor

Bukan class `CanActivate` / `HttpInterceptor`.

| Fungsi            | File                                   | Perilaku                                                                    |
| ----------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| `authGuard`       | `core/auth/auth.guard.ts`              | Tunggu session siap. Belum login → `/login?redirect_uri=` atau redirect SSO |
| `guestGuard`      | sama                                   | Sudah login → `/dashboard`. Mode SSO tidak menampilkan form lokal           |
| `apiInterceptor`  | `core/services/api/api.interceptor.ts` | Default `withCredentials: true`                                             |
| `authInterceptor` | `core/auth/auth.interceptor.ts`        | 401 → `refreshSession()` → ulang request yang sama                          |

Urutan di `provideHttpClient`: `apiInterceptor` dulu, lalu `authInterceptor`.

`HttpContext` token `SKIP_AUTH` dan `SKIP_REFRESH` (`api.context.ts`) menandai request yang tidak boleh masuk siklus refresh — login, logout, dan refresh itu sendiri. `ApiService` yang menerjemahkan `{ skipAuth, skipRefresh }` di config menjadi context.

## Signal store, scope-nya page

`TaskStore` adalah sumber data CRUD task. Bukan `providedIn: 'root'`.

```typescript
@Component({
  providers: [TaskStore, provideIcons({ lucidePlus })],
})
export class TaskPage {}
```

Akibatnya:

- Store hidup selama `TaskPage` hidup.
- Child (`TaskFormSheet`, `TaskTable`) yang `inject(TaskStore)` mendapat instance yang sama.
- Pindah route menghancurkan store; data seed tidak bocor ke kunjungan berikutnya.

Pola bacaannya: state privat `signal`, yang di-expose `asReadonly()`, turunan pakai `computed`. Sama seperti `ThemeService.dark` dan `NumberFormatContextService.format`.

`TaskStore` sekarang in-memory. Kalau nanti ada API, method `create` / `update` / `delete` yang diganti; page dan UI tidak perlu pindah folder. Lihat [sample/tasks-crud.md](../sample/tasks-crud.md).

## Page mengorkestrasi, UI memegang interaksi sendiri

`TaskPage` tidak berisi form. Ia memegang **state layar**:

- `formOpen`, `formTaskId` — sheet create/edit
- `pendingDeleteId` — dialog hapus
- toast setelah simpan atau hapus

`TaskTable` menerima `tasks` lewat `input()` dan mengembalikan niat user lewat `output()` (`edit`, `delete`).

`TaskFormSheet` tidak sepenuhnya presentational: ia `inject(TaskStore)` dan menulis lewat store. Itu disengaja karena store di-provide di page, jadi sheet tetap satu instance dengan tabel. Yang tidak boleh naik ke `ui/` adalah HTTP langsung.

Halaman datar (`Dashboard`, `Login`, `Settings`) tidak punya store. State lokal (`submitting`, `errorMessage` di login) cukup signal di component itu.

## Reactive form

Form yang ada (`Login`, `TaskFormSheet`) memakai `FormGroup` + `FormControl` non-nullable dan `Validators`. Bukan template-driven form. Control diikat ke Helm field/input/select.

## Composition Spartan

Helm dipakai sebagai **directive pada elemen**, bukan subclass.

- Sidebar: `hlmSidebarWrapper`, `hlmSidebarMenuButton`, `routerLink` di elemen yang sama.
- Page header: `contentChild(AppPageHeaderNaration)` membaca slot yang di-proyeksikan feature. Feature menulis narasi sebagai child, header yang memutuskan dialog-nya.
- Dialog konfirmasi global: `ConfirmService.open()` → `HlmDialogService.open(ConfirmDialogComponent)` → `Observable<boolean>`.
- Toast: fungsi `appToast()`, bukan service. Komponen `AppToast` hanya tampilan; `AppShell` yang memasang `<hlm-toaster>`.

Brain tidak di-import untuk styling. Kalau butuh behavior mentah (misalnya `toast()` dari Sonner), import-nya `@spartan-ng/brain/...`. Komponen ber-class Tailwind datang dari `@spartan-ng/helm/...`.

## Util statis, bukan service

`DateUtil`, `StringUtil`, `ImageUtil`, dan `ArrayObjectUtil` adalah class dengan method `static`. Tidak di-inject. Konstanta format angka ada di `core/constanta/`, lalu `NumberFormatContextService` menyimpan pilihan user.

Preferensi yang harus bertahan antar refresh (tema, format angka) baru layak jadi service + `localStorage`, dan hanya menulis storage kalau `isPlatformBrowser`.

## Yang sengaja tidak dipakai

| Tidak ada                                        | Sebagai gantinya                                        |
| ------------------------------------------------ | ------------------------------------------------------- |
| NgModule feature                                 | standalone + `loadComponent`                            |
| NgRx / signal store global                       | signal service root, atau store di `providers` page     |
| Repository interface                             | `TaskStore` langsung; seam-nya method store             |
| Token di `localStorage` / header `Authorization` | cookie httpOnly + `withCredentials`                     |
| SSR / `provideClientHydration`                   | `bootstrapApplication` dari `@angular/platform-browser` |
| CSS per component                                | Tailwind di template                                    |

## Lihat juga

- [ddd.md](./ddd.md)
- [overview.md](./overview.md)
- [structure-folder.md](./structure-folder.md)
- [conventions/component-conventions.md](../conventions/component-conventions.md)
- [api/api-service.md](../api/api-service.md)
