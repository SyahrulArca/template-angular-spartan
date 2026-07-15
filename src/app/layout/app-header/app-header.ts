import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { filter, map } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';
import { AppHeaderNotification } from './ui/app-header-notification/app-header-notification';
import { AppHeaderProduct } from './ui/app-header-product/app-header-product';
import { AppHeaderUser } from './ui/app-header-user/app-header-user';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmSidebarImports,
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmSeparatorImports,
    NgIcon,
    AppHeaderProduct,
    AppHeaderNotification,
    AppHeaderUser,
  ],
  providers: [
    provideIcons({
      lucideSun,
      lucideMoon,
    }),
  ],
  template: `
    <header
      class="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b px-4 md:px-6 backdrop-blur"
    >
      <button hlmSidebarTrigger variant="ghost" size="icon-sm" type="button">
        <span class="sr-only">Toggle sidebar</span>
      </button>

      <div hlmSeparator orientation="vertical" class="hidden h-4! sm:block"></div>

      <nav hlmBreadcrumb class="min-w-0 flex-1">
        <ol hlmBreadcrumbList>
          <li hlmBreadcrumbItem>
            <a hlmBreadcrumbLink link="/dashboard">Home</a>
          </li>
          @if (breadcrumb() !== 'Home') {
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>{{ breadcrumb() }}</span>
            </li>
          }
        </ol>
      </nav>

      <div class="flex shrink-0 items-center gap-4">
        <!-- navbar theme -->
        <button
          hlmBtn
          variant="ghost"
          size="icon-sm"
          type="button"
          (click)="theme.toggle()"
          [attr.aria-label]="theme.dark() ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          @if (theme.dark()) {
            <ng-icon name="lucideSun" />
          } @else {
            <ng-icon name="lucideMoon" />
          }
        </button>

        <!-- navbar list product -->
        <app-header-product />

        <!-- navbar notification -->
        <app-header-notification />

        <!-- navbar user -->
        <app-header-user />
      </div>
    </header>
  `,
})
export class AppHeader {
  protected readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.routerState.snapshot.root),
    ),
    { initialValue: this.router.routerState.snapshot.root },
  );

  protected readonly breadcrumb = computed(() => {
    let route = this.navigationEnd();
    while (route.firstChild) {
      route = route.firstChild;
    }
    const label = route.data['breadcrumb'];
    return typeof label === 'string' ? label : 'Home';
  });
}
