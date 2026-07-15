import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideCheckCheck } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import {
  appHeaderNotifications,
  getUnreadNotificationCount,
  type AppHeaderNotificationItem,
} from '../../../../core/config/app-header';

@Component({
  selector: 'app-header-notification',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports, HlmDropdownMenuImports, HlmBadgeImports, NgIcon],
  providers: [
    provideIcons({
      lucideBell,
      lucideCheckCheck,
    }),
  ],
  template: `
    <button
      hlmBtn
      variant="ghost"
      size="icon-sm"
      type="button"
      class="relative"
      [hlmDropdownMenuTrigger]="notificationMenu"
      aria-label="Notifications"
    >
      <ng-icon name="lucideBell" />
      @if (unreadCount() > 0) {
        <span
          hlmBadge
          variant="destructive"
          class="absolute -end-0.5 -top-0.5 size-4 min-w-4 justify-center rounded-full p-0 text-[10px]"
        >
          {{ unreadCount() }}
        </span>
      }
    </button>

    <ng-template #notificationMenu>
      <div hlmDropdownMenu class="w-80">
        <div class="flex items-center justify-between px-2 py-1.5">
          <span hlmDropdownMenuLabel class="p-0">Notifications</span>
          @if (unreadCount() > 0) {
            <button
              hlmBtn
              variant="ghost"
              size="xs"
              type="button"
              class="h-7"
              (click)="markAllAsRead()"
            >
              <ng-icon name="lucideCheckCheck" />
              Mark all read
            </button>
          }
        </div>
        <div hlmDropdownMenuSeparator></div>

        @if (notifications().length === 0) {
          <div class="text-muted-foreground px-2 py-6 text-center text-sm">
            No notifications yet.
          </div>
        } @else {
          @for (notification of notifications(); track notification.id) {
            <button
              hlmDropdownMenuItem
              type="button"
              class="items-start gap-2 mb-2 px-4 py-2"
              (click)="markAsRead(notification.id)"
            >
              <span
                class="mt-1.5 size-2 shrink-0 rounded-full"
                [class.bg-primary]="!notification.read"
                [class.bg-transparent]="notification.read"
              ></span>
              <div class="flex min-w-0 flex-1 flex-col gap-0.5 text-start">
                <span class="truncate text-sm font-medium">{{ notification.title }}</span>
                <span class="text-muted-foreground line-clamp-2 text-xs">{{
                  notification.message
                }}</span>
                <span class="text-muted-foreground text-[11px]">{{ notification.time }}</span>
              </div>
            </button>
          }
        }
      </div>
    </ng-template>
  `,
})
export class AppHeaderNotification {
  protected readonly notifications = signal<AppHeaderNotificationItem[]>(appHeaderNotifications);
  protected readonly unreadCount = computed(() => getUnreadNotificationCount(this.notifications()));

  protected markAsRead(id: string): void {
    this.notifications.update((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }

  protected markAllAsRead(): void {
    this.notifications.update((items) => items.map((item) => ({ ...item, read: true })));
  }
}
