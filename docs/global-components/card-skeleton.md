# Card skeleton (`<spartan-skeleton-card>`)

Placeholder loading berbentuk kartu: dua baris judul dan area gambar 16:9.

- Lokasi: `src/app/core/components/skeleton/card-skeleton.ts`
- Class: `CardSkeleton`
- Import: `import { CardSkeleton } from '../../core/components/skeleton/card-skeleton';`

## API

Tidak punya input. Lebar host `w-full max-w-xs`.

## Contoh

```html
@if (loading()) {
  <spartan-skeleton-card />
} @else {
  <!-- kartu asli -->
}
```

## Catatan

- Belum dipakai di halaman mana pun.
- Selector berawalan `spartan-`, beda dengan komponen app lain (`app-`).
- Dibangun dari Spartan `hlm-card` + `hlm-skeleton`.
