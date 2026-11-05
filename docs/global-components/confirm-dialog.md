# Confirm dialog (`ConfirmService`)

Dialog "Ya / Batal" yang dibuka secara imperative dan mengembalikan `Observable<boolean>`.

- Komponen: `src/app/core/components/confirm-dialog/` (`ConfirmDialogComponent`)
- Service: `src/app/core/services/confirm/confirm.service.ts` (`providedIn: 'root'`)
- Import: `import { ConfirmService } from '../../core/services/confirm';`

Jangan render `ConfirmDialogComponent` di template. Buka lewat service; service yang memanggil `HlmDialogService.open()` dan mengisi context.

## API

`ConfirmService.open(options: ConfirmOptions): Observable<boolean>` — `true` kalau tombol konfirmasi diklik, `false` kalau batal, klik di luar dialog, atau `Esc`.

| Opsi | Tipe | Default | Keterangan |
| --- | --- | --- | --- |
| `title` | `string` | wajib | Judul dialog (`hlmDialogTitle`) |
| `description` | `string` | — | Teks di bawah judul |
| `confirmLabel` | `string` | `'Konfirmasi'` | Label tombol kanan |
| `cancelLabel` | `string` | `'Batal'` | Label tombol kiri (outline) |
| `variant` | `'default' \| 'destructive'` | `'default'` | Variant tombol konfirmasi |

## Contoh

```typescript
private readonly confirm = inject(ConfirmService);

protected deleteItem(): void {
  this.confirm
    .open({
      title: 'Hapus item?',
      description: 'Tindakan ini tidak dapat dibatalkan.',
      confirmLabel: 'Hapus',
      variant: 'destructive',
    })
    .subscribe((confirmed) => {
      if (confirmed) appToast({ type: 'success', title: 'Item dihapus.' });
    });
}
```

## Catatan

- Observable selesai setelah satu nilai (`take(1)`), jadi tidak perlu unsubscribe.
- Dialog tanpa tombol X (`showCloseButton: false`) dan menutup saat klik di luar.
- Contoh hidup: kartu "Confirm dialog" di `features/dashboard/dashboard.ts`.
