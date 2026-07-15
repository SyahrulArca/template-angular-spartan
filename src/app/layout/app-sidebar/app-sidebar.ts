import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import {
  appMenuIcons,
  appMenuSidebar,
  formatAppMenuGroupLabel,
  getAppMenuItemTrackId,
  hasAppMenuChildren,
} from '../../core/config/app-menu';
import { appEnv } from '../../core/config/app-env';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmSidebarImports, NgIcon, RouterLink, RouterLinkActive],
  providers: [provideIcons(appMenuIcons)],
  template: `
    <div hlmSidebarWrapper>
      <hlm-sidebar variant="inset" collapsible="icon">
        <div hlmSidebarHeader>
          <div
            class="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <div
              class="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
            >
              S
            </div>
            <div class="grid min-w-0 flex-1 text-start group-data-[collapsible=icon]:hidden">
              <span class="truncate text-sm font-semibold">{{ appName }}</span>
              <span class="text-muted-foreground truncate text-xs">Base admin layout</span>
            </div>
          </div>
        </div>

        <div hlmSidebarContent>
          @for (menuGroup of menuGroups; track menuGroup.group) {
            <div hlmSidebarGroup>
              <div hlmSidebarGroupLabel>{{ formatGroupLabel(menuGroup) }}</div>
              <div hlmSidebarGroupContent>
                <ul hlmSidebarMenu>
                  @for (item of menuGroup.items; track getItemTrackId(item)) {
                    <li hlmSidebarMenuItem>
                      @if (hasChildren(item)) {
                        <button hlmSidebarMenuButton type="button" [tooltip]="item.title">
                          <ng-icon [name]="item.icon" />
                          <span>{{ item.title }}</span>
                        </button>

                        <ul hlmSidebarMenuSub>
                          @for (child of item.children; track getItemTrackId(child)) {
                            <li hlmSidebarMenuSubItem>
                              <a
                                hlmSidebarMenuSubButton
                                [routerLink]="child.path"
                                routerLinkActive
                                #childRla="routerLinkActive"
                                [attr.data-active]="childRla.isActive ? '' : null"
                              >
                                <span>{{ child.title }}</span>
                              </a>
                            </li>
                          }
                        </ul>
                      } @else {
                        <a
                          hlmSidebarMenuButton
                          [routerLink]="item.path"
                          routerLinkActive
                          #rla="routerLinkActive"
                          [isActive]="rla.isActive"
                          [tooltip]="item.title"
                        >
                          <ng-icon [name]="item.icon" />
                          <span>{{ item.title }}</span>
                        </a>
                      }
                    </li>
                  }
                </ul>
              </div>
            </div>
          }
        </div>

        <div hlmSidebarFooter>
          <p
            class="text-muted-foreground truncate px-2 text-xs group-data-[collapsible=icon]:hidden"
          >
            Angular 21 + spartan/ui
          </p>
        </div>
      </hlm-sidebar>

      <ng-content />
    </div>
  `,
})
export class AppSidebar {
  protected readonly appName = appEnv.name;
  protected readonly menuGroups = appMenuSidebar;
  protected readonly formatGroupLabel = formatAppMenuGroupLabel;
  protected readonly hasChildren = hasAppMenuChildren;
  protected readonly getItemTrackId = getAppMenuItemTrackId;
}
