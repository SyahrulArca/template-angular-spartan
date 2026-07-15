import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { TASK_STATUS_LABELS, type TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBadgeImports],
  templateUrl: './task-status-badge.html',
})
export class TaskStatusBadge {
  readonly status = input.required<TaskStatus>();

  protected readonly label = computed(() => TASK_STATUS_LABELS[this.status()]);
  protected readonly variant = computed(() => {
    switch (this.status()) {
      case 'done':
        return 'secondary' as const;
      case 'in_progress':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  });
}
