import { Directive, input, signal } from '@angular/core';

/** Step panel; visibility controlled by `FormWizard`. */
@Directive({
  selector: '[formWizardStep]',
  host: {
    class: 'flex flex-col gap-4',
    '[class.hidden]': '!active()',
    '[attr.aria-hidden]': 'active() ? null : true',
  },
})
export class FormWizardStepPanel {
  readonly index = input.required<number>({ alias: 'formWizardStep' });

  /** Written by the wizard shell — do not set from the feature. */
  readonly active = signal(false);
}
