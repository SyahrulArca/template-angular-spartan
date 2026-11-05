import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCard, HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { FORM_SHELL_FOOTER, FORM_SHELL_HEADER, FormShellBase } from './form-shell-base';

/** Master fields (default slot) on top, a detail section (`[formShellDetail]`) below, one footer. */
@Component({
  selector: 'form[appFormShellMasterDetail]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, HlmButtonImports, HlmSpinner],
  hostDirectives: [HlmCard],
  template: `
    ${FORM_SHELL_HEADER}
    <div hlmCardContent class="flex flex-col gap-4">
      <ng-content />
    </div>
    <section
      class="flex flex-col gap-3 border-t px-(--card-spacing) pt-(--card-spacing)"
      [attr.aria-labelledby]="detailTitleId"
    >
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="flex flex-col gap-1">
          <h3 class="text-sm font-medium" [id]="detailTitleId">{{ detailTitle() }}</h3>
          @if (detailDescription()) {
            <p class="text-muted-foreground text-xs">{{ detailDescription() }}</p>
          }
        </div>
        <ng-content select="[formShellDetailActions]" />
      </div>
      <ng-content select="[formShellDetail]" />
    </section>
    ${FORM_SHELL_FOOTER}
  `,
})
export class FormShellMasterDetail extends FormShellBase {
  readonly detailTitle = input('Detail');
  readonly detailDescription = input('');

  protected readonly detailTitleId = `${this.titleId}-detail`;
}
