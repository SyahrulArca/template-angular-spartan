# Text skeleton (`<spartan-skeleton-text>`)

Placeholder loading untuk paragraf: tiga baris, baris terakhir 3/4 lebar.

- Lokasi: `src/app/core/components/skeleton/text.skeleton.ts`
- Class: `TextSkeleton`
- Import: `import { TextSkeleton } from '../../core/components/skeleton/text.skeleton';`

## API

Tidak punya input. Lebar host `w-full max-w-xs`.

## Contoh

```html
@if (loading()) {
  <spartan-skeleton-text />
} @else {
  <p>{{ description() }}</p>
}
```

## Catatan

- Belum dipakai di halaman mana pun.
- Nama file memakai titik (`text.skeleton.ts`), beda dengan tiga skeleton lain (`*-skeleton.ts`).
