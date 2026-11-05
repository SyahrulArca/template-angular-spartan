# Empty data (`<app-empty-data>`)

Tampilan kosong vertikal: ilustrasi, judul "Empty Data", deskripsi, lalu tombol aksi dari pemakai.

- Lokasi: `src/app/core/components/empty-data/empty-data.ts`
- Class: `EmptyData`
- Import: `import { EmptyData } from '../../core/components/empty-data/empty-data';`
- Asset: `public/assets/images/empty-page-asset.svg` (lewat `NgOptimizedImage`, 662×377)

## API

| Nama | Jenis | Keterangan |
| --- | --- | --- |
| (default) | `ng-content` | Tombol aksi di baris paling bawah, rata tengah. Kalau kosong, barisnya disembunyikan |

Judul dan deskripsi tetap (belum jadi input):

- Title: `Empty Data` (`text-2xl`)
- Description: `There's no data to display. Try adjusting the filters or check back later.`

## Contoh

```html
@if (invoices.filtered().length === 0) {
  <app-empty-data>
    <button hlmBtn variant="outline" type="button" (click)="resetFilters()">Reset filter</button>
  </app-empty-data>
}
```

Tanpa aksi:

```html
<app-empty-data />
```

## Catatan

- Gambar dekoratif (`alt=""`); arti halaman dibawa oleh judul `<h2>`.
- Lebar gambar maksimal `max-w-xs`, tinggi mengikuti rasio.
- Test: `empty-data.spec.ts` (urutan elemen + slot aksi).
