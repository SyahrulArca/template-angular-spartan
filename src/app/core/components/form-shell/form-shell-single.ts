import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { FORM_SHELL_FOOTER, FORM_SHELL_HEADER, FormShellBase } from './form-shell-base';

/** One-level form: header, fields (default slot), Batal/Simpan footer. */
@Component({
  selector: 'form[appFormShellSingle]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, HlmButtonImports, HlmSpinner],
  hostDirectives: [HlmCard],
  template: `
    ${FORM_SHELL_HEADER}
    <div hlmCardContent class="flex flex-col gap-4">
      <ng-content />
    </div>
    ${FORM_SHELL_FOOTER}
  `,
})
export class FormShellSingle extends FormShellBase {}
