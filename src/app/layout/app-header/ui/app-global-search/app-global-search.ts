import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { BrnCommand, BrnCommandInput } from '@spartan-ng/brain/command';
import type { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group';
import {
  appGlobalSearchCategories,
  appGlobalSearchIcons,
  appGlobalSearchItems,
  filterAppGlobalSearch,
  highlightAppGlobalSearch,
  type AppGlobalSearchCategory,
  type AppGlobalSearchItem,
} from '../../../../core/config/app-global-search';
import { ThemeService } from '../../../../core/services/theme.service';

type CategoryFilter = AppGlobalSearchCategory | 'all';

@Component({
  selector: 'app-global-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    BrnCommandInput,
    HlmCommandImports,
    HlmInputGroupImports,
    HlmToggleGroupImports,
    HlmBadgeImports,
    HlmButtonImports,
  ],
  providers: [provideIcons({ ...appGlobalSearchIcons, lucideSearch, lucideX })],
  host: {
    '(document:keydown.control.k)': 'toggle($event)',
    '(document:keydown.meta.k)': 'toggle($event)',
  },
  templateUrl: './app-global-search.html',
})
export class AppGlobalSearch {
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  private readonly injector = inject(Injector);
  private readonly command = viewChild(BrnCommand);

  protected readonly open = signal(false);
  protected readonly query = signal('');
  protected readonly category = signal<CategoryFilter>('all');

  protected readonly highlight = highlightAppGlobalSearch;
  protected readonly matchAll = () => true;
  protected readonly dialogState = computed<BrnDialogState>(() =>
    this.open() ? 'open' : 'closed',
  );

  private readonly matches = computed(() =>
    filterAppGlobalSearch(appGlobalSearchItems, this.query()),
  );

  protected readonly filters = computed(() => {
    const matches = this.matches();
    return [
      { value: 'all' as CategoryFilter, label: 'All', count: matches.length },
      ...appGlobalSearchCategories.map((c) => ({
        value: c.value as CategoryFilter,
        label: c.label,
        count: matches.filter((item) => item.category === c.value).length,
      })),
    ];
  });

  protected readonly groups = computed(() => {
    const category = this.category();
    return appGlobalSearchCategories
      .filter((c) => category === 'all' || c.value === category)
      .map((c) => ({ ...c, items: this.matches().filter((item) => item.category === c.value) }))
      .filter((group) => group.items.length);
  });

  protected readonly shownCount = computed(() =>
    this.groups().reduce((sum, group) => sum + group.items.length, 0),
  );
  protected readonly totalCount = appGlobalSearchItems.length;

  protected toggle(event: Event): void {
    event.preventDefault();
    if (this.open()) this.close();
    else this.show();
  }

  protected show(): void {
    this.query.set('');
    this.category.set('all');
    this.open.set(true);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected onStateChange(state: BrnDialogState): void {
    this.open.set(state === 'open');
  }

  protected setQuery(value: string): void {
    this.query.set(value);
    this.activateFirst();
  }

  protected setCategory(value: CategoryFilter | CategoryFilter[] | null | undefined): void {
    if (typeof value !== 'string') return;
    this.category.set(value);
    this.activateFirst();
  }

  /** We filter rows ourselves, so the previously active row may be destroyed; re-pick after render. */
  private activateFirst(): void {
    afterNextRender(() => this.command()?.keyManager.setFirstItemActive(), {
      injector: this.injector,
    });
  }

  protected cycleCategory(event: Event, step: 1 | -1): void {
    event.preventDefault();
    const values = this.filters().map((f) => f.value);
    const next = (values.indexOf(this.category()) + step + values.length) % values.length;
    this.setCategory(values[next]);
  }

  protected run(item: AppGlobalSearchItem): void {
    this.close();
    if (item.path) void this.router.navigateByUrl(item.path);
    else if (item.action === 'toggle-theme') this.theme.toggle();
  }
}
