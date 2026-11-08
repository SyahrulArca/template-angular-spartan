import { Component, model } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormWizard } from './form-wizard';
import { FormWizardStepPanel } from './form-wizard-step';
import type { FormWizardStepMeta } from './form-wizard.types';

@Component({
  imports: [ReactiveFormsModule, FormWizard, FormWizardStepPanel],
  template: `
    <form
      appFormWizard
      title="Wizard"
      [steps]="steps"
      [(step)]="step"
      [formGroup]="form"
      [canAdvance]="canAdvance"
      (ngSubmit)="submits = submits + 1"
      (cancelled)="cancels = cancels + 1"
    >
      <div [formWizardStep]="0">
        <input formControlName="name" />
      </div>
      <div [formWizardStep]="1">
        <input formControlName="note" />
      </div>
    </form>
  `,
})
class Host {
  readonly steps: FormWizardStepMeta[] = [
    { label: 'Basic' },
    { label: 'Review' },
  ];
  readonly step = model(0);
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    note: new FormControl('', { nonNullable: true }),
  });

  submits = 0;
  cancels = 0;

  protected canAdvance = (): boolean => this.form.controls.name.valid;
}

describe('FormWizard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
  });

  it('blocks next when canAdvance is false', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const next = [...fixture.nativeElement.querySelectorAll('button')].find(
      (b: HTMLButtonElement) => b.textContent?.trim() === 'Lanjut',
    ) as HTMLButtonElement;

    expect(fixture.componentInstance.step()).toBe(0);
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.step()).toBe(0);

    fixture.componentInstance.form.controls.name.setValue('ok');
    fixture.detectChanges();
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.step()).toBe(1);
  });
});
