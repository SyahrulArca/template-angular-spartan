import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutDashboard, lucideSettings } from '@ng-icons/lucide';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

type NavItem = {
  title: string;
  path: string;
  icon: string;
};

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmSidebarImports, NgIcon, RouterLink, RouterLinkActive],
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideSettings,
    }),
  ],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar collapsible="icon">
        <div hlmSidebarHeader class="border-b border-sidebar-border p-2">
          <div class="flex items-center gap-2 px-2 py-1">
            <div
              class="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
            >
              S
            </div>
            <div class="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
              <span class="truncate text-sm font-semibold">Spartan Template</span>
              <span class="text-muted-foreground truncate text-xs">Base admin layout</span>
            </div>
          </div>
        </div>

        <div hlmSidebarContent>
          <div hlmSidebarGroup>
            <div hlmSidebarGroupLabel>Navigation</div>
            <div hlmSidebarGroupContent>
              <ul hlmSidebarMenu>
                @for (item of navItems; track item.path) {
                  <li hlmSidebarMenuItem>
                    <a
                      hlmSidebarMenuButton
                      [routerLink]="item.path"
                      routerLinkActive
                      #rla="routerLinkActive"
                      [isActive]="rla.isActive"
                    >
                      <ng-icon [name]="item.icon" />
                      <span>{{ item.title }}</span>
                    </a>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>

        <div hlmSidebarFooter class="border-t border-sidebar-border p-2">
          <p class="text-muted-foreground px-2 text-xs group-data-[collapsible=icon]:hidden">
            Angular 21 + spartan/ui
          </p>
        </div>
      </hlm-sidebar>

      <ng-content />
    </div>
  `,
})
export class AppSidebar {
  protected readonly navItems: NavItem[] = [
    { title: 'Dashboard', path: '/dashboard', icon: 'lucideLayoutDashboard' },
    { title: 'Settings', path: '/settings', icon: 'lucideSettings' },
  ];
}
