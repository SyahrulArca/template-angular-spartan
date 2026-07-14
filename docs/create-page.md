# Cara menambah halaman baru

Panduan step-by-step untuk menambah feature page di template ini (sidebar layout + lazy routing + breadcrumb).

## Ringkasan alur

```
1. Generate component  →  src/app/features/<nama>/
2. Tulis template (.html) & logic (.ts)
3. Daftarkan route     →  app.routes.ts
4. Tambah nav sidebar  →  app-sidebar.ts (opsional)
5. Register icon       →  provideIcons() jika pakai ng-icon
```

---

## 1. Generate component

Project ini sudah mengatur **default schematic** di `angular.json`:

- Standalone component
- `ChangeDetectionStrategy.OnPush`
- **Template terpisah** (`.html`) — view & logic dipisah
- Tanpa file CSS (styling pakai Tailwind utility classes)

```bash
ng generate component features/reports --skip-tests
# shorthand:
ng g c features/reports --skip-tests
```

File yang dihasilkan:

```
src/app/features/reports/
├── reports.ts      ← logic (class, imports, inject, signals)
└── reports.html    ← view (template HTML)
```

> **Tip:** Tambah `--skip-tests` jika belum butuh spec. Hapus flag itu kalau mau sekalian generate `reports.spec.ts`.

### Verifikasi output generator

Dry-run dulu kalau mau lihat tanpa menulis file:

```bash
ng g c features/reports --skip-tests --dry-run
```

Pastikan **tidak** ada flag `-t` / `--inline-template`. Default project sudah `inlineTemplate: false`.

---

## 2. Isi component

### Logic — `reports.ts`

Ikuti pola feature page yang ada (`dashboard`, `settings`):

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports],
  templateUrl: './reports.html',
})
export class Reports {
  // state & methods di sini
}
```

**Konvensi:**

| Topik      | Aturan                                                  |
| ---------- | ------------------------------------------------------- |
| State      | Pakai `signal()` / `computed()`                         |
| DI         | Pakai `inject()`, bukan constructor injection           |
| Template   | Selalu `templateUrl`, bukan inline `template`           |
| Style      | Tailwind di HTML; hindari CSS kecuali benar-benar perlu |
| Spartan UI | Import `*Imports` const (e.g. `HlmCardImports`)         |

### View — `reports.html`

Struktur halaman konsisten supaya layout rapi di shell:

```html
<div class="flex flex-col gap-4">
  <!-- Page header -->
  <div>
    <h1 class="text-2xl font-semibold tracking-tight">Reports</h1>
    <p class="text-muted-foreground text-sm">Deskripsi singkat halaman.</p>
  </div>

  <!-- Konten utama -->
  <section hlmCard>
    <div hlmCardHeader>
      <h2 hlmCardTitle>Section title</h2>
      <p hlmCardDescription>Section description.</p>
    </div>
    <div hlmCardContent>
      <!-- isi halaman -->
    </div>
  </section>
</div>
```

### Icon (jika dipakai)

Register di `providers` component:

```typescript
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText } from '@ng-icons/lucide';

@Component({
  imports: [NgIcon, /* ... */],
  providers: [provideIcons({ lucideFileText })],
  // ...
})
```

Template: `<ng-icon name="lucideFileText" />`

---

## 3. Daftarkan route

Edit `src/app/app.routes.ts` — tambah **sebelum** wildcard `**`:

```typescript
{
  path: 'reports',
  loadComponent: () => import('./features/reports/reports').then((m) => m.Reports),
  title: 'Reports',
  data: { breadcrumb: 'Reports' },
},
```

| Field             | Fungsi                       |
| ----------------- | ---------------------------- |
| `path`            | URL segment (`/reports`)     |
| `loadComponent`   | Lazy load — chunk terpisah   |
| `title`           | Document title (tab browser) |
| `data.breadcrumb` | Label di header breadcrumb   |

Route redirect & 404 sudah ada — jangan hapus entry `**`.

---

## 4. Tambah ke sidebar (opsional)

Kalau halaman perlu muncul di navigasi, edit `src/app/layout/app-sidebar/app-sidebar.ts`:

**1. Import icon** (jika belum):

```typescript
import { lucideFileText } from '@ng-icons/lucide';

providers: [
  provideIcons({
    // ...existing icons
    lucideFileText,
  }),
],
```

**2. Tambah item nav:**

```typescript
protected readonly navItems: NavItem[] = [
  { title: 'Dashboard', path: '/dashboard', icon: 'lucideLayoutDashboard' },
  { title: 'Reports', path: '/reports', icon: 'lucideFileText' },
  { title: 'Settings', path: '/settings', icon: 'lucideSettings' },
];
```

Halaman tanpa sidebar entry (e.g. detail/modal route) cukup didaftarkan di `app.routes.ts` saja.

---

## 5. Cek hasil

```bash
ng serve
```

Buka `http://localhost:4200/reports` — pastikan:

- [ ] Layout shell (sidebar + header) tampil
- [ ] Breadcrumb: `Home > Reports`
- [ ] Document title tab browser benar
- [ ] Nav sidebar aktif (jika didaftarkan)
- [ ] Dark mode tetap berfungsi

---

## Contoh lengkap (copy-paste checklist)

Misal menambah halaman **Users**:

```bash
ng g c features/users --skip-tests
```

| File                        | Action                     |
| --------------------------- | -------------------------- |
| `features/users/users.ts`   | Logic + Spartan imports    |
| `features/users/users.html` | Template halaman           |
| `app.routes.ts`             | Route lazy + breadcrumb    |
| `app-sidebar.ts`            | Nav item + icon (opsional) |

---

## Halaman khusus

### Nested route (e.g. `/users/:id`)

Buat parent + child routes di `app.routes.ts`:

```typescript
{
  path: 'users',
  loadComponent: () => import('./features/users/users').then((m) => m.Users),
  title: 'Users',
  data: { breadcrumb: 'Users' },
  children: [
    {
      path: ':id',
      loadComponent: () =>
        import('./features/users/user-detail/user-detail').then((m) => m.UserDetail),
      title: 'User Detail',
      data: { breadcrumb: 'Detail' },
    },
  ],
},
```

Parent butuh `<router-outlet />` di template untuk render child.

### Halaman tanpa layout khusus

Semua route saat ini di-render di dalam `app-shell` (sidebar layout). Kalau butuh halaman full-screen (login, landing), buat route sibling di luar shell — itu perlu refactor routing terpisah (lihat optional task di `task/20260714_task.md`).

---

## Referensi

- Konvensi component & CLI: [component-conventions.md](./component-conventions.md)
- Spartan component catalog: `ng g @spartan-ng/cli:info --json`
- Cursor rules: `.cursor/rules/cursor.mdc`, `.cursor/rules/spartan.mdc`
