import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { ThemeService } from '../../core/services/theme.service';
import { AppHeader } from '../app-header/app-header';
import { AppSidebar } from '../app-sidebar/app-sidebar';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppSidebar, AppHeader, RouterOutlet, HlmSidebarImports, HlmToasterImports],
  template: `
    <app-sidebar>
      <main
        hlmSidebarInset
        class="flex min-h-vh w-auto min-w-0 max-w-full flex-1 flex-col overflow-hidden"
      >
        <app-header />

        <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div class="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start p-4 md:px-6">
            <router-outlet />
          </div>
        </div>
      </main>
    </app-sidebar>

    <hlm-toaster [theme]="theme.dark() ? 'dark' : 'light'" position="bottom-right" />
  `,
})
export class AppShell {
  protected readonly theme = inject(ThemeService);
}
