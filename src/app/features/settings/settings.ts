import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ThemeService } from '../../core/services/theme.service';
import { AppPageHeader } from '../../layout/app-page-header/app-page-header';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppPageHeader, HlmCardImports, HlmButtonImports],
  template: `
    <div class="flex flex-col gap-4">
      <app-app-page-header
        title="Settings"
        description="Configure appearance and preferences."
      />

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
