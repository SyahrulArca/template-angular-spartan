import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { appToast } from '../../../../core/components/app-toast';
import { FormShellSingle } from '../../../../core/components/form-shell/form-shell-single';
import type { InvoiceFormValue } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-quick-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormShellSingle, HlmFieldImports, HlmInputImports],
  templateUrl: './invoice-quick-form.html',
})
export class InvoiceQuickForm {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submitting = signal(false);
  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() satisfies InvoiceFormValue;
    this.submitting.set(true);
    // shortcut: fake latency to demo `submitting`; replace with the API call when one exists.
    const timer = setTimeout(() => {
      this.submitting.set(false);
      this.form.reset();
      appToast({ type: 'success', title: 'Draft invoice disimpan', description: value.email });
    }, 600);
    this.destroyRef.onDestroy(() => clearTimeout(timer));
  }
}
