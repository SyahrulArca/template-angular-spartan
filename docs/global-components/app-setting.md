# Setting format angka (`<app-setting>`)

Dua select untuk memilih format angka global: format pemisah dan perilaku angka negatif. Pilihan langsung berlaku ke semua [`<app-number-format>`](./number-format.md) dan tersimpan di `localStorage`.

- Lokasi: `src/app/core/components/setting/app-setting/app-setting.ts`
- Class: `SettingComponent`
- Import: `import { SettingComponent } from '../../core/components/setting/app-setting/app-setting';`

## API

Tidak punya input / output. Membaca dan menulis `NumberFormatContextService`:

| Select | Opsi | Method service | Key `localStorage` |
| --- | --- | --- | --- |
| Number Format | `templateFormatNumber` (`us-format`, `uk-format`) | `setFormat(key)` | `number_format_key` |
| Negative Number Behavior | `negativeNumberBehavior` (`default`, `danger`, `danger-brackets`) | `setNegativeBehavior(key)` | `number_negative_key` |

## Contoh

```html
<app-setting />
```

## Catatan

- Template inline dan masih menulis `standalone: true` eksplisit (aturan project melarangnya di Angular 21).
- Lebar tiap select tetap `w-64`; di layar sempit dua select bisa melebihi kartu.
- Contoh hidup: kartu "Number Format" di `features/dashboard/dashboard.html`.
