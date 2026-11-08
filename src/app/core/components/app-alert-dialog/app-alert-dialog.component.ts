import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import {
  CircleCheckIcon,
  CircleQuestionMarkIcon,
  OctagonAlertIcon,
  TriangleAlertIcon,
} from 'ng-animated-icons';
import type { AppAlertDialogContext, AppAlertType } from './app-alert-dialog.types';

const TYPE_ICON_SHELL: Record<AppAlertType, string> = {
  success: 'border-emerald-600/40 bg-emerald-600/10',
  error: 'border-destructive/40 bg-destructive/10',
  warning: 'border-amber-500/40 bg-amber-500/10',
  info: 'border-sky-500/40 bg-sky-500/10',
};

const TYPE_ICON_COLOR: Record<AppAlertType, string> = {
  success: 'text-emerald-600',
  error: 'text-destructive',
  warning: 'text-amber-600',
  info: 'text-sky-600',
};

const TYPE_CONFIRM_BTN: Record<AppAlertType, string> = {
  success: 'bg-emerald-600 hover:bg-emerald-600/90 text-foreground',
  error: '',
  warning: '',
  info: '',
};

/** ng-animated-icons at 48px for alert variants in template. */
@Component({
  selector: 'app-alert-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmDialogImports,
    HlmButtonImports,
    CircleCheckIcon,
    OctagonAlertIcon,
    TriangleAlertIcon,
    CircleQuestionMarkIcon,
  ],
  templateUrl: './app-alert-dialog.component.html',
})
export class AppAlertDialogComponent {
  private readonly context = injectBrnDialogContext<AppAlertDialogContext>();

  protected readonly type = computed(() => this.context.type);
  protected readonly title = computed(() => this.context.title);
  protected readonly description = computed(() => this.context.description);
  protected readonly confirmLabel = computed(() => this.context.confirmLabel);

  protected readonly iconShellClass = computed(() => TYPE_ICON_SHELL[this.type()]);
  protected readonly iconClass = computed(() => TYPE_ICON_COLOR[this.type()]);
  protected readonly confirmVariant = computed(() =>
    this.type() === 'error' ? ('destructive' as const) : ('default' as const),
  );
  protected readonly confirmButtonClass = computed(() => TYPE_CONFIRM_BTN[this.type()]);

  protected dismiss(): void {
    this.context.close();
  }
}
