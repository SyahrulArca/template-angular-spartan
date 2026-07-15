# Saran deployment (SPA + Nginx)

Panduan deploy template ini sebagai **full SPA** (tanpa SSR) ke production dengan Nginx.

## Ringkasan

```
ng build  →  upload isi dist/template-angular-spartan/browser/  →  Nginx root ke folder itu
```

Yang dibawa ke server **hanya output build**, bukan seluruh repo (`src/`, `node_modules/`, dll.).


| Yang di-deploy  | Keterangan                                                     |
| --------------- | -------------------------------------------------------------- |
| `index.html`    | Entry point SPA                                                |
| `*.js`, `*.css` | Bundle sudah di-hash (`outputHashing: all`)                    |
| `media/`        | Font woff2 (Geist, Geist Mono, Lora) — di-bundle Angular build |
| Asset `public/` | Favicon, gambar statis, dll.                                   |


### Struktur output build (Angular 21)

Builder `@angular/build:application` menghasilkan folder `**browser/**` di dalam dist. Itu yang di-deploy — bukan root dist-nya.

```
dist/template-angular-spartan/
├── browser/                    ← DEPLOY INI ke Nginx
│   ├── index.html
│   ├── main-O7T7J45K.js
│   ├── styles-VF2KTAZV.css
│   ├── chunk-*.js
│   ├── favicon.svg
│   ├── favicon.ico
│   └── media/                  ← font .woff2
├── 3rdpartylicenses.txt        ← tidak perlu di-deploy
└── prerendered-routes.json     ← metadata build, tidak perlu di-deploy
```

`prerendered-routes.json` berisi `{ "routes": {} }` — konfirmasi ini **full SPA**, bukan prerender/SSR.

---

## 1. Build production

```bash
npm ci
ng build
```

### Environment variables

Project ini memakai `@ngx-env/builder` dengan prefix `NG_APP_`. Nilai env **terbake saat build**, bukan di runtime.

Pastikan `.env.production` sudah benar sebelum build:

```env
NG_APP_ENV=production
NG_APP_NAME=Spartan Template
NG_APP_API_URL=https://api.example.com
NG_APP_ENABLE_DEBUG=false
```

> Setelah ganti env, **wajib build ulang** sebelum deploy.

### Base href (opsional)

Deploy di root domain (`https://app.example.com/`) → default `/`, tidak perlu flag tambahan.

Deploy di subpath (`https://example.com/admin/`) → build dengan base href:

```bash
ng build --base-href /admin/
```

---

## 2. Konfigurasi Nginx

### Minimal (wajib ada SPA fallback)

Tanpa `try_files ... /index.html`, refresh di `/dashboard`, `/tasks`, atau `/settings` akan **404** karena route itu hanya dikenal client-side.

```nginx
server {
    listen 80;
    server_name app.example.com;

    root /var/www/template-angular-spartan;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Ganti `root` dengan path absolut ke isi folder `dist/template-angular-spartan/browser/` di server.

### Recommended (cache policy)

Masalah paling umum setelah deploy: **user tidak dapat update** kecuali Ctrl+F5.

Penyebab utama: `**index.html` di-cache** browser/CDN, sehingga masih memuat bundle JS/CSS lama.

```nginx
server {
    listen 80;
    server_name app.example.com;

    root /var/www/template-angular-spartan;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # index.html: selalu ambil versi terbaru dari server
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Asset hashed: boleh cache agresif (nama file berubah tiap build)
    location ~* \.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```


| File                        | Cache                  | Alasan                                       |
| --------------------------- | ---------------------- | -------------------------------------------- |
| `index.html`                | **no-cache**           | Pointer ke bundle; harus selalu fresh        |
| `main-*.js`, `styles-*.css` | **1 tahun, immutable** | Nama file berubah setiap build               |
| Font / gambar statis        | **long cache**         | Aman selama nama/URL berubah saat ganti file |


### HTTPS (production)

Tambahkan TLS (mis. Certbot / Let's Encrypt) di depan config di atas. SPA tidak butuh Node.js di server — Nginx serve file statis saja.

---

## 3. Alur deploy

1. Build di CI atau mesin lokal dengan env production yang benar.
2. Upload **seluruh isi** `dist/template-angular-spartan/browser/` ke server (rsync, scp, CI artifact).
3. **Replace** folder lama — jangan merge manual file per file.
4. Reload Nginx: `sudo nginx -t && sudo systemctl reload nginx`
5. (Opsional) Purge cache CDN jika pakai Cloudflare/dll.

```bash
# Contoh rsync
rsync -avz --delete dist/template-angular-spartan/browser/ user@server:/var/www/template-angular-spartan/
```

Flag `--delete` menghapus bundle lama yang sudah tidak direferensikan `index.html` baru.

---

## 4. User tidak dapat update setelah deploy

### Gejala

- Deploy sukses, tapi user masih lihat UI lama.
- Hard refresh (Ctrl+F5 / Cmd+Shift+R) baru menampilkan versi baru.

### Penyebab

1. `index.html` di-cache (paling sering).
2. CDN/proxy cache tanpa purge.
3. Service Worker lama (jika nanti pakai PWA tanpa update flow).

### Solusi (urut prioritas)

#### A. Nginx cache header (wajib)

Lihat bagian **Recommended** di atas — ini menyelesaikan mayoritas kasus.

#### B. Pastikan `outputHashing: all`

Sudah diset di `angular.json` production. Jangan dimatikan — hashing membuat setiap build menghasilkan nama file JS/CSS baru.

#### C. CDN rules (jika pakai Cloudflare, dll.)

- **Bypass cache** untuk `/` dan `/index.html`
- **Cache agresif** untuk `*.js` dan `*.css`
- **Purge cache** setelah setiap deploy

#### D. Version check di app (opsional, nice-to-have)

Tambah mekanisme deteksi versi baru di runtime:

1. Saat build, generate `public/version.json`:
  ```json
   { "version": "1.0.0", "builtAt": "2026-07-15T10:00:00.000Z" }
  ```
2. Di app, cek file itu dengan `cache: 'no-store'` saat:
  - tab kembali fokus (`document.visibilitychange`), atau
  - interval berkala (mis. tiap 5 menit).
3. Jika `version` beda dari yang sedang berjalan → tampilkan toast: *"Versi baru tersedia. Muat ulang?"*

Contoh pseudo-code:

```typescript
const BUILD_VERSION = import.meta.env.NG_APP_VERSION ?? 'dev';

async function checkForUpdate(): Promise<void> {
  const res = await fetch('/version.json', { cache: 'no-store' });
  const { version } = await res.json();
  if (version !== BUILD_VERSION) {
    // tampilkan prompt reload (toast / confirm dialog)
  }
}
```

Ini belum diimplementasikan di template — tambahkan jika butuh UX reload yang eksplisit.

#### E. Hindari Service Worker dulu

PWA / `@angular/service-worker` bisa **memperparah** stale cache jika update flow belum diatur. Untuk admin SPA, skip dulu kecuali memang butuh offline.

---

## 5. Checklist sebelum go-live

- [ ] `ng build` sukses tanpa error
- [ ] `.env.production` / `NG_APP_*` sudah benar
- [ ] Upload isi `dist/template-angular-spartan/browser/` (bukan repo penuh, bukan root dist)
- [ ] Nginx `try_files $uri $uri/ /index.html` aktif
- [ ] `index.html` → `Cache-Control: no-cache`
- [ ] Asset `*.js` / `*.css` → long cache + immutable
- [ ] Deep link `/dashboard`, `/tasks` bisa di-refresh tanpa 404
- [ ] HTTPS aktif
- [ ] (CDN) purge / bypass cache untuk `index.html`

---

## 6. Yang tidak perlu di production


| Item                               | Keterangan                |
| ---------------------------------- | ------------------------- |
| `ng serve`                         | Hanya development         |
| Node.js runtime                    | SPA statis tidak butuh    |
| `@angular/ssr` / `platform-server` | Template ini full SPA     |
| Seluruh `node_modules/`            | Hanya butuh hasil `dist/` |


---

## Referensi terkait

- [README.md](../README.md) — stack & scripts project
- [create-page.md](./create-page.md) — menambah route (ingat SPA fallback untuk route baru)

