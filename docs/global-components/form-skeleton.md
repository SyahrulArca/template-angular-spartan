# Form skeleton (`<spartan-skeleton-form>`)

Placeholder loading berbentuk form: dua pasang label + input dan satu tombol.

- Lokasi: `src/app/core/components/skeleton/form-skeleton.ts`
- Class: `FormSkeleton`
- Import: `import { FormSkeleton } from '../../core/components/skeleton/form-skeleton';`

## API

Tidak punya input. Lebar host `w-full max-w-xs`.

## Contoh

```html
@if (loading()) {
  <spartan-skeleton-form />
} @else {
  <form [formGroup]="form">...</form>
}
```

## Catatan

- Belum dipakai di halaman mana pun.
- Jumlah field tetap dua; kalau form asli jauh lebih panjang, buat skeleton di `ui/` feature itu.
