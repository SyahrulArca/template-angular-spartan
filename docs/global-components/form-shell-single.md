# Form shell single (`form[appFormShellSingle]`)

Kerangka form satu level: header (judul + deskripsi), body field, dan footer Batal/Simpan. Tampil sebagai card Spartan.

- Lokasi: `src/app/core/components/form-shell/form-shell-single.ts`
- Class: `FormShellSingle` (extends `FormShellBase` di `form-shell-base.ts`)
- Import: `import { FormShellSingle } from '../../core/components/form-shell/form-shell-single';`
- Pasangannya: [form-shell-master-detail.md](./form-shell-master-detail.md)

## Kenapa attribute di `<form>`?

`FormGroup` tetap milik feature, sesuai pola reactive form di `TaskFormSheet` dan `Login`. Shell dipasang di elemen `<form [formGroup]>` yang sama, jadi `formControlName` di dalam slot tetap menemukan form-nya, dan tombol Simpan (`type="submit"`) memicu `(ngSubmit)` milik feature. Shell tidak tahu bentuk data.

## API

| Nama | Jenis | Default | Keterangan |
| --- | --- | --- | --- |
| `title` | `input.required<string>` | — | Judul card; juga jadi `aria-labelledby` form |
| `description` | `input<string>` | `''` | Teks di bawah judul |
| `submitLabel` | `input<string>` | `'Simpan'` | Label tombol submit |
| `cancelLabel` | `input<string>` | `'Batal'` | Label tombol batal |
| `submitting` | `input<boolean>` | `false` | Men-disable kedua tombol, menampilkan spinner, set `aria-busy` |
| `cancelled` | `output<void>` | — | Klik Batal. Submit pakai `(ngSubmit)` bawaan Angular |

| Slot | Isi |
| --- | --- |
| (default) | Field form |
| `[formShellFooter]` | Tombol tambahan di footer, sebelum Batal/Simpan |

## Contoh

```html
<form
  appFormShellSingle
  title="Draft invoice"
  submitLabel="Simpan draft"
  [formGroup]="form"
  [submitting]="submitting()"
  (ngSubmit)="submit()"
  (cancelled)="form.reset()"
>
  <div hlmField>
    <label hlmFieldLabel required for="email">Email</label>
    <input hlmInput id="email" formControlName="email" />
  </div>
</form>
```

Component pemakai wajib meng-import `ReactiveFormsModule` dan `FormShellSingle`. Tipe nilai form tetap di `models/` feature (contoh: `InvoiceFormValue`).

## Catatan

- Contoh hidup: `features/dashboard/ui/invoice-quick-form/`.
- Validasi dan `markAllAsTouched()` tetap di `submit()` feature; shell tidak memblokir submit saat form invalid.
- Test: `form-shell.spec.ts`.
