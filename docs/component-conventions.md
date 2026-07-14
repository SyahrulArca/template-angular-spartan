# Konvensi component & generator CLI

## Kenapa tidak pakai custom schematic?

Angular CLI **sudah cukup** untuk kebutuhan template ini. Custom schematic (`ng g c` versi sendiri) baru worth it kalau:

- Boilerplate > 5 file per generate (route + service + sidebar + test fixture sekaligus)
- Banyak developer dengan pola yang harus **identik** tanpa exception
- Perlu integrasi ke monorepo/Nx generator

Untuk saat ini, **default schematic + dokumentasi** lebih ringan di-maintain.

Project ini mengatur default di `angular.json`:

```json
"@schematics/angular:component": {
  "changeDetection": "OnPush",
  "inlineTemplate": false,
  "inlineStyle": false,
  "style": "none",
  "standalone": true
}
```

Artinya `ng g c <name>` otomatis menghasilkan pola **view/logic terpisah** yang kamu mau.

---

## Kapan pakai file terpisah vs inline template?

| Tipe             | Template                       | Contoh di project                                      |
| ---------------- | ------------------------------ | ------------------------------------------------------ |
| **Feature page** | `templateUrl` + `.html`        | `features/dashboard/` (disarankan refactor ke `.html`) |
| **Layout kecil** | Inline `template` OK           | `app-shell`, `app-header`                              |
| **Reusable UI**  | `templateUrl` jika > ~30 baris | —                                                      |

**Rule of thumb:** halaman di `features/` → selalu `.html` terpisah. Layout/shell boleh inline selama template pendek.

---

## Perintah generator

### Feature page (disarankan)

```bash
ng g c features/<nama-page> --skip-tests
```

### Component di folder lain

```bash
# Shared UI widget
ng g c shared/ui/confirm-dialog --skip-tests

# Layout piece
ng g c layout/page-header --skip-tests
```

### Override default (sekali pakai)

```bash
# Butuh CSS file lokal
ng g c features/charts --style=css

# Inline template (hindari untuk feature page)
ng g c features/quick --inline-template
```

---

## Struktur file component

### Feature page (target pattern)

```
features/reports/
├── reports.ts       # @Component, imports, class logic
└── reports.html     # HTML template
```

```typescript
// reports.ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports],
  templateUrl: './reports.html',
})
export class Reports {
  protected readonly loading = signal(false);

  protected refresh(): void {
    this.loading.set(true);
    // ...
  }
}
```

Path `templateUrl` **relatif ke file `.ts`** — jangan pakai path absolut.

### Spec file (opsional)

Generate dengan:

```bash
ng g c features/reports   # tanpa --skip-tests
```

Test minimal:

```typescript
import { TestBed } from '@angular/core/testing';
import { Reports } from './reports';

describe('Reports', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reports],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Reports);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

---

## Checklist Angular modern (`.cursor/rules`)

- [ ] Standalone component (default — jangan set `standalone: true` explicit di Angular 21+)
- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] `input()` / `output()` functions, bukan decorator
- [ ] Signals untuk local state
- [ ] Native control flow: `@if`, `@for`, `@switch`
- [ ] Reactive forms untuk form kompleks
- [ ] `inject()` untuk DI
- [ ] Spartan: semantic colors, `*Imports` const, `provideIcons` untuk `<ng-icon>`

---

## Custom schematic di masa depan (opsional)

Kalau nanti butuh generator `ng g page` yang sekaligus:

1. Generate component di `features/`
2. Append route ke `app.routes.ts`
3. Append nav item ke `app-sidebar.ts`

Opsi implementasi:

| O approach                                     | Effort                      |
| ---------------------------------------------- | --------------------------- |
| npm script + template copy                     | Rendah                      |
| `@angular-devkit/schematics` custom collection | Sedang                      |
| Nx generator                                   | Sedang (jika migrate ke Nx) |

Saat itu, extend dokumentasi ini dengan section "Custom schematic".

---

## Lihat juga

- [create-page.md](./create-page.md) — walkthrough menambah halaman
- [README.md](../README.md) — setup project & Spartan CLI
