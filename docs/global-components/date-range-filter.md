# Date range filter (`<app-date-range-filter>`)

Select preset tanggal + date range picker dalam satu komponen. Memilih preset mengisi picker; memilih tanggal manual yang tidak cocok preset membuat select menampilkan "Kustom".

- Lokasi: `src/app/core/components/datatable-filter/date-range-filter/date-range-filter.ts`
- Import: `import { DateRangeFilter } from '../../core/components/datatable-filter/date-range-filter/date-range-filter';`
- Dipakai di: [datatable-filter.md](./datatable-filter.md). Boleh dipakai sendiri.

## API

| Nama | Jenis | Tipe | Default | Keterangan |
| --- | --- | --- | --- | --- |
| `range` | `model` | `DateRange \| null` | `rangeFromPreset('7d')` | `{ start, end }`. `null` kalau picker dikosongkan |

## Preset

Didefinisikan di `src/app/core/constanta/date-range-preset.ts`:

| id | Label | Rentang (akhir = hari ini) |
| --- | --- | --- |
| `7d` | 7 hari lalu | hari ini − 7 hari |
| `14d` | 14 hari lalu | hari ini − 14 hari |
| `1m` | 1 bulan lalu | tanggal sama bulan lalu |
| `3m` | 3 bulan lalu | tanggal sama 3 bulan lalu |

Bulan yang lebih pendek dipotong ke hari terakhir (31 Mei − 3 bulan → 28/29 Feb). Helper yang diekspor: `DATE_RANGE_PRESETS`, `DEFAULT_DATE_RANGE_PRESET`, `rangeFromPreset(id, today?)`, `presetForRange(range, today?)`, `isDateRangePresetId(value)`.

## Contoh

```html
<app-date-range-filter [(range)]="range" />
```

```typescript
protected readonly range = signal<DateRange | null>(rangeFromPreset(DEFAULT_DATE_RANGE_PRESET));
```

## Catatan

- Preset aktif dihitung dari `range` (bukan state terpisah), jadi select dan picker tidak bisa beda.
- Teks picker memakai locale `id-ID`: `29 Okt - 5 Nov`. Placeholder saat kosong: "Pilih tanggal".
- Picker menutup otomatis setelah tanggal akhir dipilih.
- Test: `core/constanta/date-range-preset.spec.ts`.
