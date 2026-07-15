# Feature folder structure (copy this)

Gunakan pola ini saat membuat feature baru di `src/app/features/<feature-name>/`.
Copy folder ini sebagai scaffolding, lalu rename + hapus yang tidak dibutuhkan.

> Referensi live: `features/tasks/` (CRUD in-memory).

---

## Template lengkap

```
features/<feature-name>/
├── pages/                 # REQUIRED — route targets (lazy-loaded)
│   └── <feature>-page/
│       ├── <feature>-page.ts
│       └── <feature>-page.html
│
├── ui/                    # REQUIRED — feature-local presentational components
│   ├── <feature>-table/
│   ├── <feature>-form-sheet/
│   └── <feature>-toolbar/
│
├── models/                # REQUIRED — domain types (alias: types/)
│   └── <feature>.model.ts
│
├── data/                  # RECOMMENDED — state stores (signals)
│   └── <feature>.store.ts
│
├── apis/                  # OPTIONAL — HTTP calls ke backend
│   └── <feature>.api.ts
│
├── services/              # OPTIONAL — business logic non-UI / non-HTTP
│   └── <feature>.service.ts
│
├── utils/                 # OPTIONAL — pure helpers / mappers / formatters
│   └── <feature>.utils.ts
│
├── constants/             # OPTIONAL — enums, labels, config constants
│   └── <feature>.constants.ts
│
├── guards/                # OPTIONAL — route guards spesifik feature
│   └── <feature>.guard.ts
│
├── pipes/                 # OPTIONAL — pipes khusus feature
│   └── <feature>.pipe.ts
│
├── directives/            # OPTIONAL — directives khusus feature
│   └── <feature>.directive.ts
│
└── index.ts               # OPTIONAL — public barrel (re-export yang dipakai luar)
```

---

## Required

| Folder | Isi | Aturan |
|--------|-----|--------|
| **`pages/`** | Component yang di-`loadComponent` di route | 1 page = 1 folder, selalu `.ts` + `.html`. Orchestrator: wire store, sheet, dialog. |
| **`ui/`** | Presentational components milik feature | Tidak lazy-load sebagai route. `input()`/`output()`, OnPush, no HTTP langsung. |
| **`models/`** | Interfaces, types, DTOs domain | Bisa juga dinamai `types/`. Hindari logic — pure types saja. |

Minimal viable feature:

```
features/reports/
├── pages/report-page/
├── ui/report-card/
└── models/report.model.ts
```

---

## Recommended

| Folder | Isi | Kapan dipakai |
|--------|-----|----------------|
| **`data/`** | Signal stores (`*.store.ts`) | Feature punya state shared antar UI (list, filters, selection). Lihat `tasks/data/task.store.ts`. |

---

## Optional (pakai kalau perlu)

| Folder | Isi | Kapan dipakai |
|--------|-----|----------------|
| **`apis/`** | `HttpClient` wrappers (`*.api.ts`) | Ada endpoint backend. Return `Observable`/`Promise`. Jangan simpan state di sini. |
| **`services/`** | Business rules, mapping DTO→model, orchestration | Logic yang bukan UI dan bukan thin HTTP. Contoh: validasi kompleks, transform data, export PDF. |
| **`utils/`** | Pure functions | Formatter tanggal, sort helpers, mappers yang testable tanpa DI. |
| **`constants/`** | Status labels, permission keys, page size | Kalau model terlalu penuh — pisahkan label/config dari types. |
| **`guards/`** | `CanActivate` / `CanMatch` feature-scoped | Auth/permission spesifik feature (bukan global). |
| **`pipes/`** | Pipes hanya dipakai di feature ini | Kalau reuse lintas feature → pindah ke `shared/`. Lihat penjelasan di bawah. |
| **`directives/`** | Directives feature-scoped | Sama: reusable → `shared/`. Lihat penjelasan di bawah. |
| **`index.ts`** | Barrel export | Hanya export yang memang dipakai luar feature. Jangan export internal UI. |

---

## Pipes vs Directives — apa bedanya?

Keduanya **bukan page/component penuh**. Dipakai di template untuk membantu tampilan/perilaku elemen yang sudah ada.

| | **Pipe** | **Directive** |
|--|----------|---------------|
| **Apa** | Transform **nilai** di template (`value \| myPipe`) | Nempel **perilaku / atribut / class** ke elemen HTML / komponen |
| **Fokus** | Data → tampilan (format, filter, map label) | DOM / interaksi (scroll, click-outside, autofocus, highlight) |
| **Templat** | `{{ task.status \| taskStatusLabel }}` | `<input appAutoFocus />` atau `<div appHighlight="todo">` |
| **State** | Idealnya pure (input sama → output sama) | Bisa pakai lifecycle, host listeners, inject services |
| **Jangan** | Jangan fetch HTTP di pipe | Jangan jadi “component kecil” penuh template — itu urusan `ui/` |

---

### Pipes — penjelasan & contoh kasus

**Apa itu:** fungsi yang **mengubah nilai sebelum ditampilkan** di template. Angular built-in contohnya: `date`, `currency`, `async`.

**Kapan bikin pipe di feature:**

| Kasus | Contoh | Kenapa pipe |
|-------|--------|-------------|
| Mapping status → label/teks | `todo` → `"To Do"`, `in_progress` → `"In Progress"` | Dipakai berulang di table, badge, toast — DRY di template |
| Format domain-specific | invoice number `INV-2026-0042`, SKU, nomor PO | Bukan tanggal generic (itu `DatePipe`) — khusus bisnis feature |
| Relative / humanize domain | remaining days leave balance, “Due in 3d” | Logic kecil, hanya di feature invoices/HR |
| Filter list sederhana di template | `@for (t of tasks() \| taskByStatus: 'done'; …)` | OK untuk list kecil; list besar → filter di store/`computed()` |

**Contoh sample (Tasks):**

```typescript
// pipes/task-status-label.pipe.ts
@Pipe({ name: 'taskStatusLabel' })
export class TaskStatusLabelPipe {
  transform(status: TaskStatus): string {
    return TASK_STATUS_LABELS[status] ?? status;
  }
}
```

```html
<!-- di task-table.html -->
<td>{{ task.status | taskStatusLabel }}</td>
```

**Kapan *jangan* pakai pipe:**

- Logic berat / list besar → hitung di `computed()` di store/page.
- Butuh akses DOM / click → itu **directive**.
- Shared ke banyak feature → pindah ke `shared/pipes/`.

> Di sample Tasks sekarang, label status dipakai lewat `TaskStatusBadge` + `TASK_STATUS_LABELS` di model. Pipe jadi alternatif kalau mau format di banyak tempat tanpa component baru.

---

### Directives — penjelasan & contoh kasus

**Apa itu:** class yang **nempel ke elemen yang sudah ada** (bukan bikin elemen sendiri seperti component). Spartan sendiri banyak pakai directive (`hlmBtn`, `hlmFieldLabel`, `hlmInput`).

Ada dua macam umum:

1. **Attribute directive** — ubah style/perilaku: `appHighlight`, `appAutoFocus`
2. **Structural directive** — ubah struktur DOM: `@if` / `*appUnless` (jarang perlu custom di feature)

**Kapan bikin directive di feature:**

| Kasus | Contoh | Kenapa directive |
|-------|--------|------------------|
| Fokus otomatis saat sheet/dialog buka | `<input appTaskTitleAutofocus />` di `task-form-sheet` | Perilaku DOM, bukan transform nilai |
| Click outside untuk close popover lokal | `appClickOutside` di filter panel feature | Perlu `HostListener` / document events |
| Highlight baris berdasarkan status | `<tr [appTaskRowTone]="task.status">` | Tambah class/host binding tanpa component baru |
| Permission UI feature-scoped | `*appCanEditTask` hide tombol Edit | Structural: tampilkan/hilangkan elemen |
| Debounce search input khusus list | `appTaskSearchDebounce` di toolbar | Intercept `input` events sebelum update store |

**Contoh sample (Tasks):**

```typescript
// directives/task-row-tone.directive.ts
@Directive({
  selector: '[appTaskRowTone]',
  host: {
    '[class.opacity-60]': 'status() === "done"',
    '[class.border-l-primary]': 'status() === "in_progress"',
  },
})
export class TaskRowToneDirective {
  readonly status = input.required<TaskStatus>({ alias: 'appTaskRowTone' });
}
```

```html
<!-- di task-table.html -->
<tr [appTaskRowTone]="task.status">...</tr>
```

**Kapan *jangan* pakai directive:**

- Perlu template sendiri (HTML panjang, slot, `#ref`) → bikin **component** di `ui/`.
- Hanya format teks → pakai **pipe**.
- Behavior global (theme, a11y app-wide) → `core/` atau `shared/`.

---

### Ringkas keputusan

```
Mau ubah NILAI di template?           → pipe
Mau ubah PERILAKU / class elemen?     → directive
Mau potongan UI dengan template sendiri? → component di ui/
```

---

## Tanggung jawab per layer

```
pages/     → orchestration (open sheet, toast, route params)
ui/        → tampilan + interaksi lokal
data/      → state (signals) — single source of truth di client
apis/      → transport HTTP saja
services/  → domain logic / orchestration non-UI
models/    → kontrak data
```

Alur tipikal dengan API:

```
Page → Store → Api → Backend
         ↓
        UI (baca signals)
```

Alur tipikal tanpa API (seperti Tasks):

```
Page → Store (in-memory) → UI
```

---

## Naming

| Jenis | Contoh |
|-------|--------|
| Folder feature | `tasks`, `users`, `invoices` (kebab / plural domain) |
| Page | `task-page`, `user-detail-page` |
| UI | `task-table`, `task-form-sheet` |
| Store | `task.store.ts` → class `TaskStore` |
| Api | `task.api.ts` → class `TaskApi` |
| Service | `task.service.ts` → class `TaskService` |
| Model | `task.model.ts` → `Task`, `TaskStatus`, `TaskFormValue` |

---

## Yang tidak masuk di sini

| Tempat | Untuk apa |
|--------|-----------|
| `src/app/core/` | App-wide: theme, auth session, interceptors, config |
| `src/app/layout/` | Shell, sidebar, header |
| `src/app/shared/` | UI/utils yang dipakai **lebih dari 1 feature** |
| `libs/ui/` | Spartan Helm components (design system) |

---

## React → Angular (cheat sheet)

Kalau terbiasa React (`useContext`, Hooks), mapping ke Angular modern (yang dipakai di template ini):

### `useContext` → DI + Service / Store

| React | Angular |
|-------|---------|
| `createContext` + `Provider` | `@Injectable(...)` atau `providers: [X]` di component |
| `useContext(MyContext)` | `inject(MyService)` / `inject(TaskStore)` |

```typescript
// React
const ThemeContext = createContext(...);
const theme = useContext(ThemeContext);

// Angular
@Injectable({ providedIn: 'root' })
export class ThemeService { ... }

readonly theme = inject(ThemeService);
```

**Scope mirip Provider:**

| React | Angular | Contoh di project |
|-------|---------|-------------------|
| Context di root | `providedIn: 'root'` | `ThemeService` |
| `<Provider>` di halaman saja | `providers: [TaskStore]` di page | `TaskPage` — store hidup hanya di subtree Tasks |

Butuh “context value” tanpa class penuh → `InjectionToken` + `provide`.

---

### Hooks → signals + `inject()` + lifecycle

Tidak ada 1 API “Hooks”. Ekuivalen per kasus:

| React Hook | Angular |
|------------|---------|
| `useState` | `signal()` |
| `useMemo` / derived state | `computed()` |
| `useEffect` | `effect()`, `afterNextRender`, atau RxJS |
| `useRef` | `viewChild()` / `ElementRef` |
| `useCallback` | biasanya tidak perlu (method class biasa) |
| custom hook (`useTasks`) | **service / store** yang di-`inject` |

```typescript
// React
const [open, setOpen] = useState(false);
const total = useMemo(() => items.length, [items]);

// Angular
const open = signal(false);
const total = computed(() => this.items().length);
```

Custom hook ≈ store/service:

```typescript
// React:  const { tasks, create } = useTasks();
// Angular:
providers: [TaskStore],           // di page
readonly store = inject(TaskStore);
readonly tasks = this.store.tasks;
```

---

### Ringkas

| Mau... | React | Angular (template ini) | Folder tipikal |
|--------|-------|------------------------|----------------|
| State lokal UI | `useState` | `signal` | di component `pages/` / `ui/` |
| State turunan | `useMemo` | `computed` | di store / page |
| Side effect | `useEffect` | `effect` / RxJS | di store / page |
| Share state ke child | Context | `inject(Service\|Store)` + `providers` | `data/` atau `core/services/` |
| Logic reusable | custom hook | service / store / util | `data/`, `services/`, `utils/` |

---

## Store vs Api vs Service — kapan pakai apa

Salah satu sumber bingung paling sering. Pakai tabel ini:

| | **Store (`data/`)** | **Api (`apis/`)** | **Service (`services/`)** |
|--|---------------------|-------------------|---------------------------|
| **Peran** | State + mutasi state | Transport HTTP saja | Domain logic / orchestration |
| **Punya signal?** | Ya | Tidak | Kadang (jarang) |
| **Panggil HTTP?** | Tidak langsung — lewat Api | Ya | Boleh orchestrate Api + Store |
| **Siapa inject** | Page + UI (baca state) | Store (atau Service) | Page / Store |
| **Contoh** | `tasks()`, `create()`, filter | `GET /tasks`, `POST /tasks` | export CSV, hitung pricing |

```
UI ──baca──► Store ──panggil──► Api ──► Backend
                 ▲
Page / Service ──┘  (tulis / orchestrate)
```

**Rule of thumb:**

1. Butuh data di banyak child component → **Store**
2. Ada endpoint → **Api** (thin; map response di sini atau di service)
3. Logic bisnis bukan “simpan list” dan bukan “fetch” → **Service**
4. Feature tanpa backend (prototype) → Store in-memory saja (seperti Tasks)

---

## Scope DI (`providedIn` vs `providers`)

| Scope | Cara | Kapan | Contoh |
|-------|------|-------|--------|
| **App-wide singleton** | `providedIn: 'root'` | Theme, auth session, config | `ThemeService` |
| **Feature / page subtree** | `providers: [TaskStore]` di page | State reset saat keluar page; isolasi antar route | `TaskStore` di `TaskPage` |
| **Component-only** | `providers: [X]` di UI child | Sangat lokal (jarang) | — |

```typescript
// ✅ Store scoped ke page Tasks
@Component({
  providers: [TaskStore],
  // ...
})
export class TaskPage {}

// ❌ Jangan providedIn:'root' untuk list CRUD kalau mau state fresh tiap masuk page
```

Child UI pakai `inject(TaskStore)` — Angular ambil instance dari ancestor page.

---

## Konvensi component (wajib di feature ini)

| Topik | Aturan |
|-------|--------|
| Template | Selalu `templateUrl` + `.html` — **jangan inline** |
| CD | `ChangeDetectionStrategy.OnPush` |
| I/O | `input()` / `output()` — bukan `@Input` / `@Output` |
| DI | `inject()` — bukan constructor injection |
| Control flow | `@if` / `@for` / `@switch` — bukan `*ngIf` / `*ngFor` |
| Forms | Reactive forms + `hlmField` / `hlmFieldLabel` |
| Label wajib | `<label hlmFieldLabel required …>` |
| Icons | `provideIcons({ lucideX })` + `<ng-icon>` |
| Warna | Semantic tokens (`bg-primary`, `text-muted-foreground`) — bukan `bg-blue-500` |
| Style | Tailwind di HTML; file CSS hanya kalau terpaksa |

---

## UI state yang hampir selalu ada

Setiap list/page CRUD idealnya handle 4 state (di store + template):

| State | Signal tipikal | UI |
|-------|----------------|-----|
| **Loading** | `loading = signal(false)` | `<hlm-spinner />` / skeleton |
| **Error** | `error = signal<string \| null>(null)` | `hlmAlert` / toast |
| **Empty** | `tasks().length === 0` | empty message (lihat `task-table`) |
| **Success / data** | `tasks()` | table / cards |

Jangan fetch di `ui/` — page/store yang set loading & error.

---

## Nested / detail page (struktur)

Kalau feature punya list + detail:

```
features/users/
├── pages/
│   ├── user-list-page/
│   └── user-detail-page/      # /users/:id
├── ui/
│   ├── user-table/
│   └── user-profile-card/
├── models/
├── data/user.store.ts
└── apis/user.api.ts
```

Route (parent boleh flat atau children — lihat `docs/create-page.md`):

- List: `/users` → `UserListPage`
- Detail: `/users/:id` → `UserDetailPage` (baca `id` via `input()` route atau `ActivatedRoute`)

Satu store boleh di-share: provide di parent layout route, atau inject root kalau data perlu survive navigasi list↔detail.

---

## Testing (opsional tapi berguna)

```
features/tasks/
├── data/task.store.spec.ts      # unit: create/update/delete
├── apis/task.api.spec.ts        # HTTP testing (HttpTestingController)
└── pages/task-page/task-page.spec.ts   # smoke: create component
```

Prioritas: **store & api** dulu (logic), baru page (wiring). Skip test UI murni presentational kecuali ada logic rumit.

---

## Anti-patterns (jangan)

| Jangan | Kenapa | Lakukan |
|--------|--------|---------|
| HTTP di `ui/` component | Susah test & reuse | Page/Store → Api |
| Inline `template: \`...\`` di feature page | Melanggar konvensi project | `templateUrl` + `.html` |
| Satu `god` page 500+ baris HTML | Sulit maintain | Pecah ke `ui/` |
| `providedIn: 'root'` untuk setiap store CRUD | State bocor antar kunjungan page | `providers` di page |
| Duplikasi types di api + model | Drift | Satu `models/`; Api map ke model |
| Import feature A dari feature B dalam-dalam | Coupling | Shared contract di `shared/` atau event/route saja |
| Hardcode warna / raw CSS token | Melanggar Spartan styling | Semantic classes |
| `*ngIf` / `ngClass` | Legacy | `@if` / `[class.…]` |

---

## Quick: tambah halaman ke app shell

Setelah folder feature siap:

1. Route di `app.routes.ts` (sebelum `**`) + `data.breadcrumb`
2. Nav item + icon di `app-sidebar.ts`
3. Toast via `toast()` dari `@spartan-ng/brain/sonner` (toaster sudah di shell)

Detail step-by-step: [`docs/create-page.md`](../../../../docs/create-page.md).

---

## Checklist feature baru

1. [ ] Buat folder `features/<name>/` (ikuti template di atas)
2. [ ] Generate page: `ng g c features/<name>/pages/<name>-page --skip-tests`
3. [ ] Tambah `models/` + types domain
4. [ ] Pecah UI ke `ui/` (jangan inline di page)
5. [ ] State → `data/*.store.ts` + tentukan DI scope (`providers` di page vs `root`)
6. [ ] API real → `apis/*.api.ts` (store panggil api, bukan page)
7. [ ] Handle loading / error / empty di store + template
8. [ ] Daftarkan route di `app.routes.ts` (+ breadcrumb)
9. [ ] Tambah nav di `app-sidebar.ts` (kalau perlu)
10. [ ] (Opsional) unit test store/api

Lihat juga:

- [`docs/create-page.md`](../../../../docs/create-page.md) — walkthrough route + sidebar
- [`docs/tasks-crud.md`](../../../../docs/tasks-crud.md) — arsitektur sample CRUD
- [`docs/component-conventions.md`](../../../../docs/component-conventions.md) — generator CLI
- [`.cursor/rules/spartan.mdc`](../../../../.cursor/rules/spartan.mdc) — aturan Spartan untuk AI/editor
