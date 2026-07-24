import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLayoutGrid } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import {
  appHeaderProductIcons,
  appHeaderProducts,
  type AppHeaderProductItem,
} from '../../../../core/config/app-header';

@Component({
  selector: 'app-header-product',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports, HlmDropdownMenuImports, NgIcon, RouterLink],
  providers: [
    provideIcons({
      lucideLayoutGrid,
      ...appHeaderProductIcons,
    }),
  ],
  template: `
    <button
      hlmBtn
      variant="ghost"
      size="icon-sm"
      type="button"
      [hlmDropdownMenuTrigger]="productMenu"
      aria-label="Product list"
    >
      <ng-icon name="lucideLayoutGrid" />
    </button>

    <ng-template #productMenu>
      <div hlmDropdownMenu class="">
        <div hlmDropdownMenuLabel>Products</div>
        <div hlmDropdownMenuSeparator></div>
        <div hlmDropdownMenuGroup class="grid grid-cols-3 gap-2">
          @for (product of products(); track product.id) {
            <a
              [routerLink]="product.path"
              class="p-2 border rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <ng-icon [name]="product.icon" />
              <div class="flex min-w-0 flex-col gap-0.5">
                <span class="truncate text-sm font-medium">{{ product.name }}</span>
                <span class="text-muted-foreground truncate text-xs">{{
                  product.description
                }}</span>
              </div>
            </a>
          }
        </div>
      </div>
    </ng-template>
  `,
})
export class AppHeaderProduct {
  protected readonly products = signal<AppHeaderProductItem[]>(appHeaderProducts);
}
