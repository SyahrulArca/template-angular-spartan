import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header-naration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'text-muted-foreground text-sm',
  },
  template: `<ng-content />`,
})
export class AppPageHeaderNaration {
  readonly title = input<string>();
  readonly description = input<string>();
}
