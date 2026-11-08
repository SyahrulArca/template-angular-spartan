import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { injectTableCellContext } from '@tanstack/angular-table';
import type { Task } from '../../models/task.model';
import { TaskStatusBadge } from '../task-status-badge/task-status-badge';
import type { TaskTableFeatures } from './task-data-table.features';

@Component({
  selector: 'app-task-table-status-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskStatusBadge],
  template: `<app-task-status-badge [status]="task().status" />`,
})
export class TaskTableStatusCell {
  private readonly _cell = injectTableCellContext<TaskTableFeatures, Task, string>();
  protected readonly task = computed(() => this._cell().row.original);
}
