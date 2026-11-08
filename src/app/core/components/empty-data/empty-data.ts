import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-data',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    <div class="flex flex-col items-center gap-4 px-4 py-10 text-center bg-secondary">
      <img
        ngSrc="assets/images/empty-page-asset.svg"
        width="662"
        height="377"
        alt=""
        class="h-auto w-full max-w-xs dark:invert"
      />
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl font-semibold tracking-tight">Empty Data</h2>
        <p class="text-muted-foreground max-w-sm text-sm">
          There's no data to display. Try adjusting the filters or check back later.
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-2 empty:hidden">
        <ng-content />
      </div>
    </div>
  `,
})
export class EmptyData {}
