import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmScrollArea } from '@spartan-ng/helm/scroll-area';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
  selector: 'app-page-header-naration-viewport',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmScrollArea, NgScrollbar],
  template: `
    <ng-scrollbar hlm class="max-h-[min(18rem,50dvh)] min-h-0" appearance="compact">
      <div class="pe-1">
        <ng-content />
      </div>
    </ng-scrollbar>
  `,
})
export class AppPageHeaderNarationViewport {}
