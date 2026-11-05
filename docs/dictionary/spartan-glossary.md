# Kamus Istilah Lengkap Angular 21 & Spartan UI Ecosystem (Final Edition)

Dokumen ini berisi panduan lengkap istilah, konsep arsitektur, dan fitur kunci pada **Angular 21** serta **spartan/ui** (`@spartan-ng/brain` v1.1.0+) beserta ekosistem UI & utility pendukungnya.

---

## 📌 Rekomendasi & Struktur Kolom

Untuk mempermudah navigasi dan implementasi praktis di proyek nyata, tabel kamus ini dibagi ke dalam 7 kolom utama:

1. **Istilah / Konsep**: Nama istilah, directive, atau nama library.
2. **Kategori / Layer**: Asal ekosistem (_Angular 21 Core_, _spartan/brain_, _spartan/helm_, _Styling/Icons_, _Utility_).
3. **Deskripsi**: Penjelasan fungsional dan arsitektur dari istilah tersebut.
4. **Contoh Kasus Penggunaan**: Skenario pembuatan fitur di dunia nyata.
5. **Fitur & Import Terkait**: Paket npm, selector, atau directive yang relevan sesuai `package.json`.
6. **Tingkat Kesulitan**: _Basic_, _Intermediate_, atau _Advanced_.
7. **Best Practice / Catatan Spartan**: Tips optimasi dan integrasi khas Angular 21 & Spartan UI.

---

## 📘 Tabel Kamus Istilah Angular 21 & Spartan UI

| Istilah / Konsep                            | Kategori          | Deskripsi                                                                                                                                                   | Contoh Kasus Penggunaan                                                                                                      | Fitur & Import Terkait                                                             | Tingkat Kesulitan       | Best Practice / Catatan Spartan                                                                                                                            |
| :------------------------------------------ | :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **spartan/ui/brain (`brn`)**                | spartan/brain     | Layer komponen _unstyled_ (tanpa CSS) berbasis Angular CDK yang menangani logika perilaku, aksesibilitas (ARIA), navigasi keyboard, dan _focus management_. | Menangani event keyboard saat user menekan `Esc` pada Modal Dialog atau `ArrowDown` pada Dropdown.                           | `@spartan-ng/brain/*` (misal: `BrnDialogComponent`, `BrnMenuDirective`)            | Intermediate            | Dipasang via npm (`^1.1.0`). Jangan ubah kode internal `brain` agar kemudahan update aksesibilitas tetap terjaga.                                          |
| **spartan/ui/helm (`hlm`)**                 | spartan/helm      | Layer komponen ber-style berbasis **Tailwind CSS** dengan estetika shadcn/ui. Komponen ini di-_copy-paste_ langsung ke dalam codebase proyek.               | Mengatur desain visual tombol, dialog alert, badge status, atau avatar user sesuai theme aplikasi.                           | `@spartan-ng/ui-*-helm` (misal: `HlmButtonDirective`, `HlmDialogComponent`)        | Basic - Intermediate    | Kode Helm sepenuhnya **milik Anda**. Edit class Tailwind di file `.ts` atau `.html` komponen helm sesuai kebutuhan branding proyek.                        |
| **spartan CLI**                             | Tools             | Command Line Interface berbasis Angular Schematics untuk meng-generate komponen Helm ke dalam folder proyek Angular.                                        | Menambahkan komponen Button dan Dialog baru ke proyek tanpa harus _copy-paste_ manual dari dokumen website.                  | `npx spartan add button`, `npx spartan add dialog`                                 | Basic                   | Gunakan CLI untuk mempercepat instalasi dependency `@spartan-ng/brain` sekaligus menyalin template Helm.                                                   |
| **Signals API**                             | Angular 21 Core   | Sistem reaktivitas bawaan Angular modern untuk mengelola _state_ secara granular tanpa bergantung pada Zone.js overhead.                                    | Memantau status `isOpen` pada sheet/modal, state form, atau memperbarui item aktif pada combobox.                            | `signal()`, `computed()`, `effect()`, `input()`, `output()`                        | Basic - Intermediate    | Spartan UI dirancang _Signals-first_. Gunakan `input()` dan `output()` modern pengganti `@Input()` dan `@Output()` tradisional.                            |
| **Signal-based State (Service)**            | Angular 21 State  | Pola pengelolaan _state_ aplikasi yang enteng dan rapi dengan membungkus `signal()` di dalam Injectable Service tanpa butuh Redux berlebih.                 | Mengelola data user session, cart/keranjang belanja, atau filter global di seluruh aplikasi.                                 | `@Injectable({ providedIn: 'root' })`, `signal.asReadonly()`, `computed()`         | Basic - Intermediate    | Pilihan paling enteng & _proper_ untuk mayoritas aplikasi Angular 21. Gabungkan dengan `@ngrx/signals` jika butuh manajemen entity/list API yang kompleks. |
| **`hlm()` Helper Function**                 | Utility / Styling | Fungsi utilitas penggabung class Tailwind (kombinasi `clsx` + `tailwind-merge`) untuk mencegah konflik styling pada komponen Helm.                          | Menggabungkan class bawaan Helm dengan class tambahan yang dikirim pengembang dari komponen luar.                            | `hlm('inline-flex items-center', userClass)` via `clsx` & `tailwind-merge`         | Intermediate            | Selalu balut gabungan class Tailwind di setter/getter class Helm menggunakan `hlm()` agar kelas CSS eksternal dapat melakukan _override_ dengan aman.      |
| **Class Variance Authority (`cva`)**        | Styling Utility   | Library untuk membuat variasi komponen (variants, sizes, defaultProps) secara terstruktur menggunakan class Tailwind.                                       | Mengatur variant `HlmButtonDirective` seperti `default`, `destructive`, `outline`, `ghost`, serta ukuran `sm`, `lg`, `icon`. | `cva()`, `VariantProps` (`class-variance-authority`)                               | Intermediate            | Memudahkan pembuatan UI System yang terstandarisasi untuk tombol, badge, dan komponen Spartan lainnya.                                                     |
| **Angular CDK (`@angular/cdk`)**            | Angular Core      | Set primitives/building blocks dari tim Angular untuk membuat UI berstandar tinggi (Overlay, A11y, Focus Trap, Portal, Bidi).                               | Menampilkan dropdown overlay melayang di atas elemen lain tanpa terpotong `overflow: hidden` pada parent CSS.                | `@angular/cdk/overlay`, `@angular/cdk/a11y`, `@angular/cdk/portal`                 | Intermediate - Advanced | `@spartan-ng/brain` memanfaatkan CDK v21 secara internal. Gunakan CDK primitives langsung jika Anda membuat komponen _custom headless_ sendiri.            |
| **Ng Icons (`@ng-icons`)**                  | Icons             | Library icon universal untuk Angular yang efisien dan mendukung _tree-shaking_ penuh.                                                                       | Menampilkan icon Lucide seperti `lucideSearch`, `lucideCheck`, `lucideChevronDown` pada tombol dan input Spartan.            | `@ng-icons/core`, `@ng-icons/lucide`, `provideIcons()`                             | Basic                   | Daftarkan icon spesifik menggunakan `provideIcons({ lucideSearch })` di level komponen/route agar bundel JS tetap hemat.                                   |
| **ngx-scrollbar**                           | UI Utility        | Custom scrollbar berkinerja tinggi berbasis Angular yang fleksibel dan mendukung styling Tailwind CSS.                                                      | Mengganti scrollbar native browser yang kaku pada area sidebar navigation, dropdown menu, atau dialog long-content.          | `NgxScrollbarModule`, `<ngx-scrollbar>`                                            | Basic - Intermediate    | Sangat cocok dipadukan dengan layout Spartan UI dan font Geist agar tampilan aplikasi konsisten di semua browser/OS.                                       |
| **Geist Fonts (`@fontsource-variable`)**    | UI Styling        | Font variabel modern (Geist Sans & Geist Mono) dengan keterbacaan tinggi untuk interface SaaS/Dashboard.                                                    | Menampilkan teks antarmuka yang presisi, serta kode/data numerik dengan font monospace.                                      | `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`                    | Basic                   | Konfigurasikan `font-sans` dan `font-mono` di file config Tailwind CSS proyek Anda untuk menyerasikan estetika Vercel/Spartan.                             |
| **Standalone Components**                   | Angular 21 Core   | Arsitektur komponen independen tanpa butuh `NgModule`. Semua komponen Spartan UI dibuat sebagai Standalone.                                                 | Mengimpor komponen dialog Spartan langsung di komponen halaman target.                                                       | `@Component({ standalone: true, imports: [HlmButtonDirective, NgIconComponent] })` | Basic                   | Daftarkan hanya directive/komponen Spartan dan icon yang benar-benar dipakai di array `imports` komponen tersebut.                                         |
| **Control Flow (`@if`, `@for`, `@switch`)** | Angular 21 Core   | Sintaks kontrol bawaan Angular 17+ untuk kondisi dan perulangan di HTML template tanpa `NgIf` atau `NgFor`.                                                 | Menampilkan loader pada button atau melakukan perulangan item list pada dropdown menu.                                       | `@if (isLoading()) { ... } @for (item of items(); track item.id)`                  | Basic                   | Selalu cantumkan `track` wajib pada `@for` untuk performa render list yang optimal pada komponen Spartan UI.                                               |
| **Deferrable Views (`@defer`)**             | Angular 21 Core   | Mekanisme _lazy-loading_ bagian UI di tingkat HTML template berdasarkan kondisi/trigger tertentu.                                                           | Memuat komponen dialog kompleks, chart, atau tabel data Spartan hanya saat elemen scroll mendekati viewport.                 | `@defer (on viewport) { <app-complex-dialog /> } @placeholder { ... }`             | Intermediate            | Hemat ukuran bundel awal (_initial bundle_) aplikasi Anda dengan membungkus modal/widget berat menggunakan `@defer`.                                       |
| **Zoneless Angular**                        | Angular 21 Engine | Mode eksekusi Angular tanpa pembungkus `Zone.js` untuk meningkatkan efisiensi render dan memperkecil ukuran bundel.                                         | Menjalankan aplikasi Angular 21 berkecepatan tinggi dengan responsivitas berbasis Signals.                                   | `provideExperimentalZonelessChangeDetection()`                                     | Advanced                | Spartan UI sudah _Zoneless-ready_ karena menggunakan Signals API untuk perubahan UI (_change detection_).                                                  |

---

## 🚀 Panduan Ringkas Integrasi (Quickstart Checklist)

1. **Konfigurasi Utility Tailwind**:
   Pastikan fungsi `hlm()` sudah tersedia di proyek Anda (biasanya di `src/app/utils/hlm.ts`):

   ```typescript
   import { ClassValue, clsx } from 'clsx';
   import { twMerge } from 'tailwind-merge';

   export function hlm(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

2. **Menambahkan Komponen Spartan**:
   Gunakan CLI untuk memasang komponen Helm:

   ```bash
   npx spartan add button
   npx spartan add dialog
   ```

3. **Registrasi Icon (`@ng-icons/lucide`)**:
   Daftarkan icon pada komponen yang membutuhkan:
   ```typescript
   import { Component } from '@angular/core';
   import { NgIconComponent, provideIcons } from '@ng-icons/core';
   import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
   import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

   @Component({
     selector: 'app-example',
     standalone: true,
     imports: [HlmButtonDirective, NgIconComponent],
     providers: [provideIcons({ lucideCheck, lucideChevronDown })],
     template: `
       <button hlmBtn>
         <ng-icon name="lucideCheck" class="mr-2"></ng-icon>
         Simpan Data
       </button>
     `,
   })
   export class ExampleComponent {}
   ```
