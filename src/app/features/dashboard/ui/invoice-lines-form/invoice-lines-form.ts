import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { map } from 'rxjs';
import { appToast } from '../../../../core/components/app-toast';
import { FormShellMasterDetail } from '../../../../core/components/form-shell/form-shell-master-detail';
import type { InvoiceLineFormValue, InvoiceWithLinesFormValue } from '../../models/invoice.model';

function lineGroup(line: InvoiceLineFormValue = { description: '', qty: 1, price: 0 }) {
  return new FormGroup({
    description: new FormControl(line.description, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    qty: new FormControl(line.qty, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    price: new FormControl(line.price, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });
}

@Component({
  selector: 'app-invoice-lines-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DecimalPipe,
    NgIcon,
    FormShellMasterDetail,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputImports,
  ],
  providers: [provideIcons({ lucidePlus, lucideTrash2 })],
  templateUrl: './invoice-lines-form.html',
})
export class InvoiceLinesForm {
  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    subject: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lines: new FormArray([lineGroup()], { validators: [Validators.minLength(1)] }),
  });

  protected readonly lines = this.form.controls.lines;

  private readonly lineValues = toSignal(
    this.lines.valueChanges.pipe(map(() => this.lines.getRawValue())),
    { initialValue: this.lines.getRawValue() },
  );
  protected readonly total = computed(() =>
    this.lineValues().reduce((sum, line) => sum + line.qty * line.price, 0),
  );

  protected addLine(): void {
    this.lines.push(lineGroup());
  }

  protected removeLine(index: number): void {
    this.lines.removeAt(index);
  }

  protected cancel(): void {
    this.lines.clear();
    this.lines.push(lineGroup());
    this.form.reset();
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() satisfies InvoiceWithLinesFormValue;
    appToast({
      type: 'success',
      title: 'Invoice disimpan',
      description: `${value.lines.length} baris, total ${this.total().toLocaleString('en-US')}`,
    });
    this.cancel();
  }
}
