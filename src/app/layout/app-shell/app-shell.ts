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
  imports: [
    AppSidebar,
    AppHeader,
    RouterOutlet,
    HlmSidebarImports,
    HlmToasterImports,
  ],
  template: `
    <app-sidebar>
      <main hlmSidebarInset class="flex min-h-svh flex-col">
        <app-header />
        <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
          <router-outlet />
        </div>
      </main>
    </app-sidebar>

    <hlm-toaster
      [theme]="theme.dark() ? 'dark' : 'light'"
      richColors
      closeButton
      position="bottom-right"
    />
  `,
})
export class AppShell {
  protected readonly theme = inject(ThemeService);
}
