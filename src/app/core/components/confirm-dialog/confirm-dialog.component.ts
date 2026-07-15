import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import type { ConfirmDialogContext, ConfirmVariant } from './confirm-dialog.types';

@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmDialogImports, HlmButtonImports],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  private readonly context = injectBrnDialogContext<ConfirmDialogContext>();

  protected readonly title = computed(() => this.context.title);
  protected readonly description = computed(() => this.context.description);
  protected readonly confirmLabel = computed(() => this.context.confirmLabel);
  protected readonly cancelLabel = computed(() => this.context.cancelLabel);
  protected readonly confirmVariant = computed<ConfirmVariant>(() => this.context.variant);

  protected confirm(): void {
    this.context.close(true);
  }

  protected cancel(): void {
    this.context.close(false);
  }
}
