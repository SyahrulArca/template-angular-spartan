import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideTrash2 } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import type { Task } from '../../models/task.model';
import { TaskStatusBadge } from '../task-status-badge/task-status-badge';

@Component({
  selector: 'app-task-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmCardImports,
    HlmButtonImports,
    NgIcon,
    TaskStatusBadge,
    DatePipe,
  ],
  providers: [provideIcons({ lucidePencil, lucideTrash2 })],
  templateUrl: './task-table.html',
})
export class TaskTable {
  readonly tasks = input<Task[]>([]);

  readonly editTask = output<string>();
  readonly deleteTask = output<string>();
}
