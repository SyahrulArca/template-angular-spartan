import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  input,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { AppPageHeaderNaration } from './ui/app-page-header-naration/app-page-header-naration';
import { AppPageHeaderNarationViewport } from './ui/app-page-header-naration-viewport/app-page-header-naration-viewport';

@Component({
  selector: 'app-app-page-header',
  imports: [NgIcon, HlmDialogImports, HlmButtonImports, AppPageHeaderNarationViewport],
  providers: [provideIcons({ lucideInfo })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-semibold tracking-tight">{{ title() }}</h1>

          @if (withNaration() && hasNaration()) {
            <hlm-dialog>
              <button
                hlmBtn
                hlmDialogTrigger
                variant="ghost"
                size="icon-sm"
                type="button"
                [attr.aria-label]="'More information about ' + title()"
              >
                <ng-icon name="lucideInfo" class="size-4 text-muted-foreground" />
              </button>

              <hlm-dialog-content *hlmDialogPortal class="sm:max-w-lg">
                <hlm-dialog-header>
                  <h2 hlmDialogTitle>{{ narationTitle() }}</h2>
                  @if (narationDescription()) {
                    <p hlmDialogDescription>{{ narationDescription() }}</p>
                  }
                </hlm-dialog-header>

                <app-page-header-naration-viewport>
                  <ng-content select="app-page-header-naration" />
                </app-page-header-naration-viewport>

                <hlm-dialog-footer>
                  <button hlmBtn hlmDialogClose type="button">Close</button>
                </hlm-dialog-footer>
              </hlm-dialog-content>
            </hlm-dialog>
          }
        </div>

        @if (description()) {
          <p class="text-muted-foreground text-sm">{{ description() }}</p>
        }
      </div>

      <ng-content select="app-page-header-actions" />
    </div>
  `,
})
export class AppPageHeader {
  readonly title = input('');
  readonly description = input('');
  readonly withNaration = input(false, { transform: booleanAttribute });

  private readonly naration = contentChild(AppPageHeaderNaration);

  protected readonly hasNaration = computed(() => this.naration() !== undefined);
  protected readonly narationTitle = computed(() => this.naration()?.title() ?? this.title());
  protected readonly narationDescription = computed(() => this.naration()?.description());

  constructor() {
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      effect(() => {
        if (this.withNaration() && !this.hasNaration()) {
          console.warn(
            '[AppPageHeader] withNaration is true but <app-page-header-naration> is missing.',
          );
        }
      });
    }
  }
}
