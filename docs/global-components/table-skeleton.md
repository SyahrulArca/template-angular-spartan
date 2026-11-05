# Table skeleton (`<spartan-skeleton-table>`)

Placeholder loading berbentuk tabel: 5 baris, masing-masing 3 kolom (lebar fleksibel, `w-24`, `w-20`).

- Lokasi: `src/app/core/components/skeleton/table-skeleton.ts`
- Class: `TableSkeleton`
- Import: `import { TableSkeleton } from '../../core/components/skeleton/table-skeleton';`

## API

Tidak punya input. Jumlah baris tetap 5.

## Contoh

```html
@if (loading()) {
  <spartan-skeleton-table />
} @else {
  <app-invoice-table [invoices]="invoices.paged()" />
}
```

## Catatan

- Belum dipakai di halaman mana pun.
- Host `max-w-xs` sementara isi `max-w-sm`, jadi skeleton jauh lebih sempit dari tabel lebar penuh. Atur lebar dari luar atau ubah kelas host kalau dipakai untuk tabel besar.
