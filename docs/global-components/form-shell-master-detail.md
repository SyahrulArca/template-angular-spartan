# Form shell master-detail (`form[appFormShellMasterDetail]`)

Kerangka form parent-child: field master di atas, section detail (tabel/grid baris) di bawah, satu footer Batal/Simpan untuk semuanya.

- Lokasi: `src/app/core/components/form-shell/form-shell-master-detail.ts`
- Class: `FormShellMasterDetail` (extends `FormShellBase`)
- Import: `import { FormShellMasterDetail } from '../../core/components/form-shell/form-shell-master-detail';`
- API dasar (`title`, `description`, `submitLabel`, `cancelLabel`, `submitting`, `cancelled`, slot `[formShellFooter]`) sama dengan [form-shell-single.md](./form-shell-single.md)

## API tambahan

| Nama | Jenis | Default | Keterangan |
| --- | --- | --- | --- |
| `detailTitle` | `input<string>` | `'Detail'` | Judul section detail (`<h3>`, jadi label section) |
| `detailDescription` | `input<string>` | `''` | Teks di bawah judul detail |

| Slot | Isi |
| --- | --- |
| (default) | Field master/header |
| `[formShellDetailActions]` | Aksi di kanan judul detail, mis. "Tambah baris" |
| `[formShellDetail]` | Tabel/grid baris detail |

## Contoh

```html
<form
  appFormShellMasterDetail
  title="Invoice"
  detailTitle="Item invoice"
  [formGroup]="form"
  (ngSubmit)="submit()"
  (cancelled)="cancel()"
>
  <!-- master -->
  <div hlmField>
    <label hlmFieldLabel required for="email">Email</label>
    <input hlmInput id="email" formControlName="email" />
  </div>

  <button formShellDetailActions hlmBtn variant="outline" size="sm" type="button" (click)="addLine()">
    Tambah baris
  </button>

  <div formShellDetail formArrayName="lines">
    @for (line of form.controls.lines.controls; track line; let i = $index) {
      <div [formGroupName]="i">
        <input hlmInput formControlName="description" [attr.aria-label]="'Deskripsi baris ' + (i + 1)" />
      </div>
    }
  </div>
</form>
```

Detail memakai `FormArray` di `FormGroup` yang sama, jadi satu `submit()` memvalidasi master dan semua baris. Tipe nilainya di `models/` feature, contoh:

```ts
export interface InvoiceLineFormValue { description: string; qty: number; price: number; }
export interface InvoiceWithLinesFormValue extends InvoiceFormValue { lines: InvoiceLineFormValue[]; }
```

## Catatan

- Contoh hidup: `features/dashboard/ui/invoice-lines-form/` (tambah/hapus baris, subtotal, total via `toSignal(valueChanges)`).
- Tombol di slot detail wajib `type="button"`, kalau tidak ikut men-submit form.
- Test: `form-shell.spec.ts`.
