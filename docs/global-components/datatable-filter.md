# Datatable filter (`<app-datatable-filter>`)

Bar di atas tabel. Kiri: filter tanggal (preset + date range picker) dan filter status. Kanan: slot bebas untuk tombol (Export, Filter, Tambah).

- Lokasi: `src/app/core/components/datatable-filter/datatable-filter.ts`
- Import: `import { DatatableFilter } from '../../core/components/datatable-filter/datatable-filter';`
- Isi: [date-range-filter.md](./date-range-filter.md) dan [status-filter.md](./status-filter.md)

Komponen ini **tidak memfilter data**. Ia hanya memegang nilai filter; page atau store yang memotong baris.

## API

| Nama | Jenis | Tipe | Default | Keterangan |
| --- | --- | --- | --- | --- |
| `range` | `model` | `DateRange \| null` | 7 hari terakhir | `{ start, end }`, keduanya tengah malam lokal. `null` kalau tanggal dikosongkan |
| `statuses` | `input` | `DatatableStatusOption[]` | `[]` | Pilihan status. Kosong = filter status disembunyikan |
| `status` | `model` | `string \| null` | `null` | `value` status yang aktif |
| (default) | `ng-content` | — | — | Konten kanan, rata kanan (`ms-auto`) |

`DateRange` dari `core/constanta/date-range-preset.ts`. `DatatableStatusOption` dari `status-filter/status-filter.ts`.

## Contoh

Dengan store (pola yang dipakai dashboard):

```html
<app-datatable-filter
  [statuses]="invoices.statusOptions()"
  [status]="invoices.status()"
  [range]="invoices.range()"
  (statusChange)="invoices.setStatus($event)"
  (rangeChange)="invoices.setRange($event)"
>
  <button hlmBtn variant="outline" type="button">Export</button>
  <app-invoice-filter-dialog />
</app-datatable-filter>

<app-invoice-table [invoices]="invoices.paged()" />
```

Dengan signal lokal di page:

```html
<app-datatable-filter [statuses]="statuses()" [(status)]="status" [(range)]="range" />
```

## Catatan

- Saat sempit, grup status turun ke baris berikutnya; slot kanan tetap rata kanan.
- Tabel, pagination, dan logika filter ada di feature. Contoh lengkap: `features/dashboard/` (`InvoiceStore`, `InvoiceTable`, `InvoiceFilterDialog`).
