# Search input (`<app-search-input>`)

Kolom pencarian dengan ikon, tombol hapus, dan debounce. Nilai baru dikirim setelah user berhenti mengetik.

- Lokasi: `src/app/core/components/search-input/search-input.ts`
- Class: `SearchInput`
- Import: `import { SearchInput } from '../../core/components/search-input/search-input';`
- Dibangun di atas `HlmInputGroupImports` (`@spartan-ng/helm/input-group`)

## API

| Nama          | Jenis                   | Default     | Keterangan                                                                                  |
| ------------- | ----------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `value`       | `model<string>`         | `''`        | Nilai pencarian. `valueChange` keluar setelah debounce; tombol hapus langsung mengirim `''` |
| `debounceMs`  | `input<number>`         | `300`       | Jeda setelah ketikan terakhir                                                               |
| `placeholder` | `input<string>`         | `'Cari...'` | Placeholder input                                                                           |
| `label`       | `input<string>`         | `'Cari'`    | `aria-label` input                                                                          |
| `inputId`     | `input<string \| null>` | `null`      | `id` input, untuk dipasangkan dengan `<label for>`                                          |

## Contoh

Dengan store (state milik feature, bukan komponen):

```html
<app-search-input
  class="w-full sm:w-64"
  placeholder="Cari invoice, email, subject..."
  [value]="invoices.search()"
  (valueChange)="invoices.setSearch($event)"
/>
```

Dengan signal lokal:

```html
<app-search-input [(value)]="query" />
```

## Catatan

- Nilai dari luar (mis. tombol Reset yang memanggil `setSearch('')`) langsung tampil di input tanpa memicu emit ulang.
- Pemakaian: toolbar tabel invoice di dashboard dan `InvoiceFilterDialog`; keduanya menulis ke `InvoiceStore.search`, jadi selalu sinkron.
- Test: `search-input.spec.ts` (debounce, tombol hapus, sinkron dari luar).
