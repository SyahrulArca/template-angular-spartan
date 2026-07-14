import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { hlmP } from '@spartan-ng/helm/typography';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, HlmButtonImports, HlmSpinner],
  template: `
    <div class="flex flex-col gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p class="text-muted-foreground text-sm">
          Welcome to the Spartan base template. Start building from here.
        </p>
      </div>

      <section hlmCard>
        <div hlmCardHeader>
          <h2 hlmCardTitle>Getting started</h2>
          <p hlmCardDescription>
            This layout includes sidebar navigation, breadcrumbs, dark mode, and toast
            notifications.
          </p>
        </div>
        <div hlmCardContent>
          <div class="flex flex-wrap items-center gap-3">
            <button hlmBtn type="button" (click)="showToast()">Show toast</button>
            <button hlmBtn variant="outline" type="button" disabled>
              <hlm-spinner />
              Loading example
            </button>
          </div>
          <div class="mt-4">
            <p hlmP class="text-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class Dashboard {
  protected showToast(): void {
    toast.success('Template is ready', {
      description: 'Spartan components are wired and working.',
    });
  }
}
