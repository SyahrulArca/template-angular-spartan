# Toast (`appToast`)

Notifikasi singkat di pojok layar. Panggil fungsi `appToast()`; komponen `AppToast` hanya tampilan yang dirender Sonner.

- Lokasi: `src/app/core/components/app-toast/`
- Import: `import { appToast } from '../../core/components/app-toast';`
- Syarat: `<hlm-toaster>` sudah dipasang sekali di `AppShell` (`position="bottom-right"`). Halaman di luar shell (misalnya `/login`) tidak menampilkan toast.

## API

`appToast(options: AppToastOptions): string | number` — mengembalikan id toast.

| Opsi           | Tipe                                          | Default        | Keterangan                                                                            |
| -------------- | --------------------------------------------- | -------------- | ------------------------------------------------------------------------------------- |
| `type`         | `'success' \| 'info' \| 'warning' \| 'error'` | wajib          | Label tebal ("Success:") dan warna aksen                                              |
| `title`        | `string`                                      | wajib          | Teks utama                                                                            |
| `description`  | `string`                                      | —              | Baris kedua                                                                           |
| `action`       | `Type<unknown>`                               | —              | Komponen yang dirender di bawah teks (tombol Undo, dll.)                              |
| `actionInputs` | `Record<string, unknown>`                     | `{}`           | Input untuk komponen `action`                                                         |
| `duration`     | `number` (ms)                                 | `4000`         | Lama tampil                                                                           |
| `location`     | `AppToastLocation`                            | posisi toaster | `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right` |

Tipe yang diekspor: `AppToastOptions`, `AppToastType`, `AppToastLocation`, konstanta `DEFAULT_APP_TOAST_LOCATION` (`'bottom-right'`).

## Contoh

```typescript
appToast({ type: 'success', title: 'Task created' });

appToast({
  type: 'success',
  title: 'Task will be deleted',
  description: 'You can still undo this action.',
  action: ToastDemoAction,
});

appToast({ type: 'info', title: 'Di atas', location: 'top-center' });
```

Komponen `action` menutup toast sendiri lewat `toast.dismiss()` dari `@spartan-ng/brain/sonner` (lihat `features/dashboard/ui/toast-demo-action`).

## Catatan

- Tombol X memanggil `toast.dismiss(toastId)`. Kontainer memakai `role="status"` + `aria-live="polite"`.
- Warna `warning` dan `info` masih memakai kelas Tailwind mentah (`amber`, `sky`) dan shadow `rgba(...)`, belum token semantik.
- Contoh hidup: kartu "Custom toast" di `features/dashboard/dashboard.html`.
