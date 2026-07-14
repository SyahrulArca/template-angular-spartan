import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, HlmButtonImports, RouterLink],
  template: `
    <div class="flex flex-1 items-center justify-center p-6">
      <section hlmCard class="w-full max-w-md text-center">
        <div hlmCardHeader>
          <h1 hlmCardTitle class="text-4xl">404</h1>
          <p hlmCardDescription>Page not found</p>
        </div>
        <div hlmCardContent>
          <p class="text-muted-foreground text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div hlmCardFooter class="justify-center">
          <a hlmBtn routerLink="/dashboard">Back to dashboard</a>
        </div>
      </section>
    </div>
  `,
})
export class NotFound {}
