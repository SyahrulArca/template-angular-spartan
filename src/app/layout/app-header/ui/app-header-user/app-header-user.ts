import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogOut, lucideUser } from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
  selector: 'app-header-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports, HlmDropdownMenuImports, HlmAvatarImports, NgIcon],
  providers: [
    provideIcons({
      lucideUser,
      lucideLogOut,
    }),
  ],
  template: `
    <button
      hlmBtn
      variant="ghost"
      size="icon-sm"
      type="button"
      [hlmDropdownMenuTrigger]="userMenu"
      aria-label="User menu"
    >
      <hlm-avatar class="size-8">
        <span hlmAvatarFallback>{{ avatarFallback }}</span>
      </hlm-avatar>
    </button>

    <ng-template #userMenu>
      <div hlmDropdownMenu class="w-56">
        <div class="flex items-center gap-2 px-2 py-1.5">
          <hlm-avatar class="size-8">
            <span hlmAvatarFallback>{{ avatarFallback }}</span>
          </hlm-avatar>
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-sm font-medium">{{ name }}</span>
            <span class="text-muted-foreground truncate text-xs">{{ email }}</span>
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
  `,
})
export class AppHeaderUser {
  protected readonly name = 'Template User';
  protected readonly email = 'user@example.com';
  protected readonly avatarFallback = 'ST';
}
