# Form wizard (`form[appFormWizard]`)

Kerangka form multi-step: navigasi langkah, satu panel aktif, footer Batal / Kembali / Lanjut / Simpan. Mirip [form-shell-single.md](./form-shell-single.md), tapi alur bertahap.

- Lokasi: `src/app/core/components/form-wizard/`
- Import: `FormWizard`, `FormWizardStepPanel`, `FormWizardStepMeta` dari `../../core/components/form-wizard` (keduanya `FormWizard` + `FormWizardStepPanel` wajib di array `imports` component feature).
- `FormGroup` dan validasi tetap milik feature; shell tidak mengirim HTTP.

## Kenapa attribute di `<form>`?

Sama seperti form shell: `formControlName` di dalam step tetap pada `FormGroup` feature, dan `type="submit"` di langkah terakhir memicu `(ngSubmit)`.

## API

| Nama | Jenis | Default | Keterangan |
| --- | --- | --- | --- |
| `title` | `input.required` | — | Judul wizard (`aria-labelledby`) |
| `description` | `input` | `''` | Teks di bawah judul |
| `steps` | `input.required` | — | Metadata label (dan opsional deskripsi) per langkah |
| `step` | `model` | `0` | Indeks langkah aktif (two-way) |
| `nextLabel` | `input` | `'Lanjut'` | Tombol maju |
| `backLabel` | `input` | `'Kembali'` | Tombol mundur |
| `submitLabel` | `input` | `'Simpan'` | Tombol submit di langkah terakhir |
| `cancelLabel` | `input` | `'Batal'` | Tombol batal |
| `submitting` | `input` | `false` | Disable aksi + spinner di submit |
| `linear` | `input` | `true` | Langkah di kanan tidak bisa diklik sebelum tercapai |
| `canAdvance` | `input` | — | `(stepIndex) => boolean \| Promise<boolean>`; `false` menahan Lanjut |
| `cancelled` | `output` | — | Klik Batal |

| Slot / atribut | Isi |
| --- | --- |
| `[formWizardStep]="n"` | Panel langkah ke-`n` (0-based); satu panel tampil |
| `[formWizardFooter]` | Tombol tambahan di footer kanan (sebelum Kembali/Lanjut) |

## Contoh

```typescript
protected readonly wizardStep = signal(0);
protected readonly wizardSteps: FormWizardStepMeta[] = [
  { label: 'Account', description: 'Email & nama' },
  { label: 'Review', description: 'Konfirmasi' },
];

protected canLeaveStep = (index: number): boolean => {
  if (index === 0) {
    const ok = this.form.controls.email.valid;
    if (!ok) this.form.controls.email.markAsTouched();
    return ok;
  }
  return true;
};
```

```html
<form
  appFormWizard
  title="Onboarding"
  [steps]="wizardSteps"
  [(step)]="wizardStep"
  [formGroup]="form"
  [submitting]="submitting()"
  [canAdvance]="canLeaveStep"
  (ngSubmit)="submit()"
  (cancelled)="wizardStep.set(0); form.reset()"
>
  <div [formWizardStep]="0">
    <div hlmField>
      <label hlmFieldLabel for="email">Email</label>
      <input hlmInput id="email" formControlName="email" />
    </div>
  </div>

  <div [formWizardStep]="1">
    <p class="text-muted-foreground text-sm">Cek data sebelum simpan.</p>
  </div>
</form>
```

## Catatan

- Semua panel tetap di DOM (hanya `hidden`) agar nilai form tidak hilang saat pindah langkah.
- Validasi akhir tetap di handler `(ngSubmit)` feature.
- Test: `form-wizard.spec.ts`.
