# Status filter (`<app-status-filter>`)

Toggle group pilihan tunggal untuk status. Pilihan datang dari luar, termasuk jumlah per status.

- Lokasi: `src/app/core/components/datatable-filter/status-filter/status-filter.ts`
- Import: `import { StatusFilter, type DatatableStatusOption } from '../../core/components/datatable-filter/status-filter/status-filter';`
- Dipakai di: [datatable-filter.md](./datatable-filter.md). Boleh dipakai sendiri.

## API

| Nama | Jenis | Tipe | Default | Keterangan |
| --- | --- | --- | --- | --- |
| `options` | `input.required` | `DatatableStatusOption[]` | — | Tombol yang ditampilkan, berurutan |
| `value` | `model` | `string \| null` | `null` | `value` tombol yang aktif |

```typescript
interface DatatableStatusOption {
  value: string;
  label: string;
  count?: number; // tampil abu-abu di samping label kalau tidak null
}
```

## Contoh

```typescript
protected readonly status = signal<string | null>('all');
protected readonly options: DatatableStatusOption[] = [
  { value: 'all', label: 'All', count: 10 },
  { value: 'paid', label: 'Paid', count: 3 },
];
```

```html
<app-status-filter [options]="options" [(value)]="status" />
```

## Catatan

- Mode `single` dan `nullable=false`: tombol aktif tidak bisa di-unselect dengan diklik lagi. Sediakan opsi "All" kalau perlu "tanpa filter".
- Arti `'all'` ditentukan pemakai. Contoh: `filterInvoices` di dashboard menganggap `'all'` dan `null` sama-sama tanpa filter.
- Tampilan: Spartan `hlmToggleGroup` variant `outline`.
