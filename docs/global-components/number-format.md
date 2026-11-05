# Number format (`<app-number-format>`)

Menampilkan angka sesuai format global yang dipilih user (pemisah ribuan/desimal dan cara menampilkan angka negatif).

- Lokasi: `src/app/core/components/formatter/number-format/number-format.ts`
- Import: `import { NumberFormat } from '../../core/components/formatter/number-format/number-format';`
- Sumber format: `NumberFormatContextService` (`core/services/number.service.ts`), disimpan di `localStorage`. Diubah lewat [app-setting.md](./app-setting.md).

## API

Masih memakai `@Input()` (belum `input()`).

| Input | Tipe | Default | Keterangan |
| --- | --- | --- | --- |
| `value` | `number` | `0` | Angka yang ditampilkan. `null` / `NaN` → `-` |
| `withDecimal` | `boolean` | `false` | `true` = pakai `decimal_places` dari format (2) |
| `format` | `string \| TemplateFormatNumber` | format global | Override per komponen: `'us-format'`, `'uk-format'`, atau objek |
| `negativeBehavior` | `string` | behavior global | Override: `'default'`, `'danger'`, `'danger-brackets'` |
| `prefix` | `string` | `''` | Ditempel di depan, misalnya `'Rp '` |
| `suffix` | `string` | `''` | Ditempel di belakang, misalnya `' USD'` |
| `class` | `string` | `''` | Kelas tambahan di `<span>` |
| `isFontMono` | `boolean` | `true` | Tambah `font-mono` |

## Format yang ada

Dari `core/constanta/number-template.ts`:

| Key | Contoh `1234567.5` dengan desimal |
| --- | --- |
| `us-format` | `1,234,567.50` |
| `uk-format` | `1.234.567,50` |

| Negative key | Contoh `-1000` |
| --- | --- |
| `default` | `-1,000` |
| `danger` | `-1,000` merah (`text-destructive`) |
| `danger-brackets` | `(1,000)` merah |

## Contoh

```html
<app-number-format [value]="123456.375" [withDecimal]="true" prefix="Rp " />
<app-number-format [value]="invoice.amount" [suffix]="' ' + invoice.currency" />
```

## Catatan

- Nilai dihitung di `computed()` dari properti `@Input` biasa. `computed` hanya ikut berubah saat format global berubah, **bukan** saat `value` berubah setelah render pertama. Aman untuk baris yang di-render ulang lewat `@for` (komponen dibuat baru), tapi tidak untuk angka yang berubah di tempat. Upgrade ke `input()` kalau butuh itu.
- Komponen masih menulis `standalone: true` eksplisit; aturan project (Angular 21) melarangnya.
- Contoh hidup: kartu "Number Format" di dashboard dan kolom Amount di `features/dashboard/ui/invoice-table`.
