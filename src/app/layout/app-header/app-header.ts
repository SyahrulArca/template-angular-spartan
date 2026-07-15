import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogOut, lucideMoon, lucideSun, lucideUser } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { filter, map } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmSidebarImports,
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmAvatarImports,
    HlmSeparatorImports,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideSun,
      lucideMoon,
      lucideUser,
      lucideLogOut,
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

        <button
          hlmBtn
          variant="ghost"
          size="icon-sm"
          type="button"
          [hlmDropdownMenuTrigger]="userMenu"
          aria-label="User menu"
        >
          <hlm-avatar class="size-8">
            <span hlmAvatarFallback>ST</span>
          </hlm-avatar>
        </button>

        <ng-template #userMenu>
          <div hlmDropdownMenu class="w-56">
            <div class="flex items-center gap-2 px-2 py-1.5">
              <hlm-avatar class="size-8">
                <span hlmAvatarFallback>ST</span>
              </hlm-avatar>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-medium">Template User</span>
                <span class="text-muted-foreground truncate text-xs">user@example.com</span>
              </div>
            </div>
            <div hlmDropdownMenuSeparator></div>
            <button hlmDropdownMenuItem type="button">
              <ng-icon name="lucideUser" />
              Profile
            </button>
            <button hlmDropdownMenuItem type="button" variant="destructive">
              <ng-icon name="lucideLogOut" />
              Log out
            </button>
          </div>
        </ng-template>
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
