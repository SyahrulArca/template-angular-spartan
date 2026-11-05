# Global components

Komponen di `src/app/core/components/`. Boleh dipakai feature mana pun, dan tidak tahu domain feature apa pun. Satu file di folder ini menjelaskan satu komponen.

| Komponen | Selector / API | Dokumen |
| --- | --- | --- |
| Toast | `appToast()` → `AppToast` | [app-toast.md](./app-toast.md) |
| Confirm dialog | `ConfirmService.open()` → `ConfirmDialogComponent` | [confirm-dialog.md](./confirm-dialog.md) |
| Datatable filter | `<app-datatable-filter>` | [datatable-filter.md](./datatable-filter.md) |
| Date range filter | `<app-date-range-filter>` | [date-range-filter.md](./date-range-filter.md) |
| Status filter | `<app-status-filter>` | [status-filter.md](./status-filter.md) |
| Empty data | `<app-empty-data>` | [empty-data.md](./empty-data.md) |
| Form shell single | `form[appFormShellSingle]` | [form-shell-single.md](./form-shell-single.md) |
| Form shell master-detail | `form[appFormShellMasterDetail]` | [form-shell-master-detail.md](./form-shell-master-detail.md) |
| Number format | `<app-number-format>` | [number-format.md](./number-format.md) |
| Search input | `<app-search-input>` | [search-input.md](./search-input.md) |
| Setting format angka | `<app-setting>` | [app-setting.md](./app-setting.md) |
| Number format toggle | `<app-number-format-toggle>` | [number-format-toggle.md](./number-format-toggle.md) |
| Card skeleton | `<spartan-skeleton-card>` | [card-skeleton.md](./card-skeleton.md) |
| Form skeleton | `<spartan-skeleton-form>` | [form-skeleton.md](./form-skeleton.md) |
| Table skeleton | `<spartan-skeleton-table>` | [table-skeleton.md](./table-skeleton.md) |
| Text skeleton | `<spartan-skeleton-text>` | [text-skeleton.md](./text-skeleton.md) |

## Aturan main

- Komponen baru masuk sini hanya kalau dipakai lebih dari satu feature, atau memang bagian shared kernel (toast, dialog, format angka). Konsep milik satu feature tetap di `features/<nama>/ui/`. Lihat [architecture/ddd.md](../architecture/ddd.md).
- Pola komponen sama dengan feature: standalone, `OnPush`, `input()` / `output()` / `model()`, Spartan Helm via `*Imports`.
- Menambah komponen di `core/components/` = menambah satu file di folder ini dan satu baris di tabel atas.
