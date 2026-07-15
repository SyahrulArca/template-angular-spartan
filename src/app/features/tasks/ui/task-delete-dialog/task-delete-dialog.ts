import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-delete-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmAlertDialogImports, HlmButtonImports],
  templateUrl: './task-delete-dialog.html',
})
export class TaskDeleteDialog {
  readonly open = input(false);
  readonly task = input<Task | null>(null);

  readonly confirmed = output<void>();
  readonly dismissed = output<void>();

  protected readonly dialogState = computed(() => (this.open() ? 'open' : 'closed') as 'open' | 'closed');
  protected readonly taskTitle = computed(() => this.task()?.title ?? 'this task');

  protected onDialogStateChanged(state: 'open' | 'closed'): void {
    if (state === 'closed') {
      this.dismissed.emit();
    }
  }

  protected confirmDelete(): void {
    this.confirmed.emit();
  }
}
