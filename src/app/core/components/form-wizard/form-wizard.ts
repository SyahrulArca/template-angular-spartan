import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  model,
} from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { FormShellBase } from '../form-shell/form-shell-base';
import { FormWizardStepPanel } from './form-wizard-step';
import type { FormWizardStepMeta } from './form-wizard.types';

/**
 * Multi-step form shell: step nav, panel slots (`[formWizardStep]="index"`), footer Back/Next/Submit.
 * The feature owns `FormGroup`, validation, and `(ngSubmit)`.
 */
@Component({
  selector: 'form[appFormWizard]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, HlmButtonImports, HlmSpinner],
  hostDirectives: [HlmCard],
  templateUrl: './form-wizard.html',
})
export class FormWizard extends FormShellBase {
  readonly steps = input.required<FormWizardStepMeta[]>();
  readonly step = model(0);
  readonly nextLabel = input('Lanjut');
  readonly backLabel = input('Kembali');
  readonly linear = input(true, { transform: booleanAttribute });
  /** Return false to block Next (e.g. invalid step). */
  readonly canAdvance = input<((stepIndex: number) => boolean | Promise<boolean>) | undefined>();

  private readonly panels = contentChildren(FormWizardStepPanel);

  protected readonly isFirst = computed(() => this.step() === 0);
  protected readonly isLast = computed(() => this.step() === Math.max(0, this.steps().length - 1));

  constructor() {
    super();

    effect(() => {
      const current = this.step();
      for (const panel of this.panels()) {
        panel.active.set(panel.index() === current);
      }
    });
  }

  protected goToStep(index: number): void {
    if (index < 0 || index >= this.steps().length || this.submitting()) return;
    if (this.linear() && index > this.step()) return;
    this.step.set(index);
  }

  protected back(): void {
    if (this.isFirst() || this.submitting()) return;
    this.step.update((value) => Math.max(0, value - 1));
  }

  protected async next(): Promise<void> {
    if (this.isLast() || this.submitting()) return;

    const guard = this.canAdvance();
    if (guard) {
      const ok = await guard(this.step());
      if (!ok) return;
    }

    this.step.update((value) => Math.min(value + 1, this.steps().length - 1));
  }
}
