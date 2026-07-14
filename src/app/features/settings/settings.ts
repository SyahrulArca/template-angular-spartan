import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, HlmButtonImports],
  template: `
    <div class="flex flex-col gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">Settings</h1>
        <p class="text-muted-foreground text-sm">Configure appearance and preferences.</p>
      </div>

      <section hlmCard>
        <div hlmCardHeader>
          <h2 hlmCardTitle>Appearance</h2>
          <p hlmCardDescription>Toggle between light and dark themes.</p>
        </div>
        <div hlmCardContent>
          <p class="text-muted-foreground mb-4 text-sm">
            Current theme:
            <span class="text-foreground font-medium">{{ theme.dark() ? 'Dark' : 'Light' }}</span>
          </p>
          <button hlmBtn variant="outline" type="button" (click)="theme.toggle()">
            Switch to {{ theme.dark() ? 'light' : 'dark' }} mode
          </button>
        </div>
      </section>
    </div>
  `,
})
export class Settings {
  protected readonly theme = inject(ThemeService);
}
