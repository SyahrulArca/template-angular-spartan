import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-header-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex shrink-0 flex-wrap items-center gap-2',
  },
  template: `<ng-content />`,
})
export class AppPageHeaderActions {}
