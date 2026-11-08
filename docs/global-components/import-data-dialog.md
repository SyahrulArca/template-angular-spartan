# Import data dialog (`ImportDataDialogComponent`)

Dialog generik untuk unduh template Excel dan unggah satu file. Tidak ada HTTP, API, atau logika domain — semua aksi lewat callback dari parent.

- Lokasi: `src/app/core/components/import-data-dialog/`
- Import: `import { ImportDataDialogComponent } from '../../core/components/import-data-dialog';`

Render di template parent; kendalikan visibility dengan `[(open)]`.

## API

| Prop | Tipe | Default | Keterangan |
| --- | --- | --- | --- |
| `open` | `model<boolean>` | `false` | Two-way: buka/tutup dialog |
| `title` | `string` | `'Import Data'` | Judul dialog |
| `description` | `string` | teks default impor | Deskripsi di header |
| `onDownloadTemplate` | `() => void \| Promise<void>` | — | Opsional; jika tidak ada, section download disembunyikan |
| `onUploaded` | `(file: File) => void \| Promise<void>` | wajib | Dipanggil saat tombol Upload diklik |
| `accept` | `string` | `'.xlsx,.xls'` | Nilai `accept` input file + validasi ekstensi |
| `maxFileSize` | `number` | `5 * 1024 * 1024` | Batas ukuran (byte) |
| `loading` | `boolean` | `false` | Loading dari parent; mengunci tombol bersama upload internal |
| `uploadLabel` | `string` | `'Upload'` | Label tombol utama |
| `downloadLabel` | `string` | `'Download Template'` | Label tombol unduh |

Dialog tidak menutup otomatis setelah upload sukses — parent yang mengatur `open` dan `loading`.

Saat dialog ditutup, file terpilih di-reset. Validasi mencakup ekstensi, MIME Excel (atau kosong/`octet-stream`), dan ukuran maksimum.

## Contoh

```typescript
import { Component, signal } from '@angular/core';
import { ImportDataDialogComponent } from '../../core/components/import-data-dialog';

@Component({
  imports: [ImportDataDialogComponent],
  template: `
    <button hlmBtn type="button" (click)="importOpen.set(true)">Import</button>

    <app-import-data-dialog
      [(open)]="importOpen"
      [loading]="importing()"
      [onDownloadTemplate]="downloadTemplate"
      [onUploaded]="onUploaded"
    />
  `,
})
export class ExamplePage {
  readonly importOpen = signal(false);
  readonly importing = signal(false);

  protected downloadTemplate(): void {
    // trigger unduh template (blob, window.open, dll.)
  }

  protected onUploaded = async (file: File): Promise<void> => {
    this.importing.set(true);
    try {
      // kirim file ke API feature
    } finally {
      this.importing.set(false);
    }
  };
}
```

Binding callback memakai property method (bukan string template) agar `this` tetap benar.

## Catatan

- Drag & drop dan file picker; satu file per unggah.
- `validateImportDataFile` diekspor untuk tes atau reuse di luar komponen.
- Test util: `import-data-dialog.util.spec.ts`.
