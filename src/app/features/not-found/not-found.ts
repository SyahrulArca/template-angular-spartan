import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, HlmButtonImports, RouterLink],
  template: `
    <div class="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <img
        ngSrc="assets/images/404.svg"
        width="1376"
        height="768"
        priority
        alt="404 — page not found"
        class="h-auto w-full max-w-xl dark:invert"
      />
      <div class="flex max-w-md flex-col gap-2">
        <h1 class="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p class="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved. Check the URL, or head back
          to the dashboard to continue.
        </p>
      </div>
      <a hlmBtn routerLink="/dashboard">Back to dashboard</a>
    </div>
  `,
})
export class NotFound {}
