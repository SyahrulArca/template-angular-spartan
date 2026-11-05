# DDD per feature

Cara yang dianjurkan untuk menggarap project ini. Satu kemampuan bisnis tinggal di satu folder, supaya perubahan tidak meloncat dari `models` ke `core`, lalu ke feature lain.

Contoh hidup: `src/app/features/tasks/`. Daftar folder dan aturan isinya ada di [structure-folder.md](./structure-folder.md).

## Bounded context = `features/<nama>/`

Bukan lapisan global `src/app/domain`, `application`, `infrastructure`. Lapisan DDD ada **di dalam** feature.

```
features/tasks/                  ← bounded context Task
├── models/                      ← domain
├── data/task.store.ts           ← application state (use case)
├── services/                    ← aturan bisnis, kalau ada (belum dipakai tasks)
├── apis/                        ← infrastructure HTTP, kalau ada
├── pages/task-page/             ← interface: orchestrator route
└── ui/                          ← interface: tampilan
```

`core/` bukan tempat domain Task. Itu shared kernel: auth, `ApiService`, toast, tema, format angka. `layout/` hanya bingkai (sidebar, header, shell).

## Siapa panggil siapa

```
pages/  →  data/ (store)  →  apis/  →  core/services/api
   │            │
   └── ui/ ─────┘
models/ dipakai semua lapisan di feature yang sama
```

| Lapisan        | Folder            | Boleh                                           | Jangan                                      |
| -------------- | ----------------- | ----------------------------------------------- | ------------------------------------------- |
| Domain         | `models/`         | Tipe, label status, bentuk form                 | HTTP, Angular component, signal store       |
| Application    | `data/*.store.ts` | State use case, `create` / `update` / `delete`  | Template, `providedIn: 'root'`              |
| Domain service | `services/`       | Aturan yang bukan UI dan bukan thin HTTP        | Menyimpan state layar (sheet terbuka, dll.) |
| Infrastructure | `apis/`           | Panggil `ApiService`, map response ke `models/` | State UI, komponen                          |
| Interface      | `pages/`          | Route, buka/tutup sheet, toast, sediakan store  | Markup tabel/form yang panjang              |
| Interface      | `ui/`             | `input()` / `output()`, form milik komponen itu | `HttpClient` / `ApiService` langsung        |

Store di-`provide` di page (`TaskPage` → `providers: [TaskStore]`). Child di `ui/` yang `inject(TaskStore)` mendapat instance yang sama, dan state hilang saat page ditutup. Itu scope use case-nya, bukan singleton aplikasi.

## Feature baru

Mulai di `features/<nama>/`, bukan file baru di `core/components` atau `core/services`.

Minimal, begitu ada tipe dan lebih dari satu tampilan:

```
features/reports/
├── models/report.model.ts
├── pages/report-page/
└── ui/report-card/
```

Tambahkan folder lain hanya saat dibutuhkan, tetap di dalam feature yang sama:

| Kebutuhan                                   | Tambah                                                     |
| ------------------------------------------- | ---------------------------------------------------------- |
| State dipakai lebih dari satu UI            | `data/<nama>.store.ts`                                     |
| Aturan bisnis di luar store                 | `services/`                                                |
| Endpoint backend                            | `apis/<nama>.api.ts` — store yang memanggilnya, bukan page |
| Label / permission yang membuat model sesak | `constants/`                                               |
| Guard khusus feature ini                    | `guards/`                                                  |

Halaman yang sekarang masih datar (`dashboard/`, `settings/`, `login/`, `not-found/`) boleh tetap begitu selama belum punya domain. Begitu ada model, daftar, atau aturan bisnis, pecah **di dalam folder itu** (`models/`, `data/`, `ui/`). Jangan memindahkan potongannya ke `core/`.

## Batas antar context

- Feature tidak mengimpor feature lain.
- Dua feature butuh konsep yang sama dan stabil (auth, format angka, toast) → pakai yang sudah ada di `core/`.
- Konsep bisnis yang baru dipakai satu feature tetap di `models/` feature itu, walaupun terasa "umum".
- Route cukup mengimpor page: `loadComponent` ke `pages/<nama>-page`. Jangan mengimpor `ui/` atau `store` dari `app.routes.ts`.

## Tasks sebagai acuan

| Yang terjadi di Tasks                                           | Lapisan                                                        |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| `Task`, `TaskStatus`, `TaskFormValue` di `models/task.model.ts` | Domain                                                         |
| `TaskStore` create/update/delete, signal readonly               | Application                                                    |
| `TaskPage` pegang `formOpen`, target delete, toast              | Interface                                                      |
| `TaskTable` terima `tasks`, emit edit/delete                    | Interface                                                      |
| `TaskFormSheet` pegang form dan menulis lewat store yang sama   | Interface, masih di context Task                               |
| Belum ada `apis/` — data in-memory                              | Infrastructure menyusul di folder yang sama, tanpa memindah UI |

Detail CRUD-nya ada di [sample/tasks-crud.md](../sample/tasks-crud.md).

## Lihat juga

- [structure-folder.md](./structure-folder.md)
- [overview.md](./overview.md)
- [design-patterns.md](./design-patterns.md)
