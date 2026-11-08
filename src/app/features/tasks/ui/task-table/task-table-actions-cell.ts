import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash2 } from '@ng-icons/lucide';
import { injectTableCellContext } from '@tanstack/angular-table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import type { Task } from '../../models/task.model';
import { TASK_TABLE_ROW_ACTIONS } from './task-table-row-actions.token';
import type { TaskTableFeatures } from './task-data-table.features';

@Component({
  selector: 'app-task-table-actions-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucidePencil, lucideTrash2 })],
  template: `
    <div class="flex justify-end gap-1">
      <button
        hlmBtn
        variant="ghost"
        size="icon-sm"
        type="button"
        (click)="actions.edit(task().id)"
        [attr.aria-label]="'Edit ' + task().title"
      >
        <ng-icon name="lucidePencil" />
      </button>
      <button
        hlmBtn
        variant="ghost"
        size="icon-sm"
        type="button"
        (click)="actions.remove(task().id)"
        [attr.aria-label]="'Delete ' + task().title"
      >
        <ng-icon name="lucideTrash2" />
      </button>
    </div>
  `,
})
export class TaskTableActionsCell {
  private readonly _cell = injectTableCellContext<TaskTableFeatures, Task, unknown>();
  protected readonly task = computed(() => this._cell().row.original);
  protected readonly actions = inject(TASK_TABLE_ROW_ACTIONS);
}
