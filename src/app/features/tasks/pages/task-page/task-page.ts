import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { appToast } from '../../../../core/components/app-toast';
import { TaskStore } from '../../data/task.store';
import { TaskDeleteDialog } from '../../ui/task-delete-dialog/task-delete-dialog';
import { TaskFormSheet } from '../../ui/task-form-sheet/task-form-sheet';
import { TaskTable } from '../../ui/task-table/task-table';
import { TaskToolbar } from '../../ui/task-toolbar/task-toolbar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskStore],
  imports: [TaskToolbar, TaskTable, TaskFormSheet, TaskDeleteDialog],
  templateUrl: './task-page.html',
})
export class TaskPage {
  private readonly store = inject(TaskStore);

  protected readonly tasks = this.store.tasks;
  protected readonly total = this.store.total;
  protected readonly completedCount = this.store.completedCount;

  protected readonly formTaskId = signal<string | null>(null);
  protected readonly formOpen = signal(false);
  private readonly pendingDeleteId = signal<string | null>(null);

  protected readonly deleteDialogOpen = computed(() => this.pendingDeleteId() !== null);

  protected readonly deleteTarget = computed(() => {
    const id = this.pendingDeleteId();
    return id ? this.store.getById(id) ?? null : null;
  });

  protected openCreateForm(): void {
    this.formTaskId.set(null);
    this.formOpen.set(true);
  }

  protected openEditForm(taskId: string): void {
    this.formTaskId.set(taskId);
    this.formOpen.set(true);
  }

  protected closeForm(): void {
    this.formOpen.set(false);
    this.formTaskId.set(null);
  }

  protected onFormSaved(): void {
    const isEdit = this.formTaskId() !== null;
    this.closeForm();
    appToast({
      type: 'success',
      title: isEdit ? 'Task updated' : 'Task created',
      description: 'Changes are stored in memory only.',
    });
  }

  protected openDeleteDialog(taskId: string): void {
    this.pendingDeleteId.set(taskId);
  }

  protected closeDeleteDialog(): void {
    this.pendingDeleteId.set(null);
  }

  protected confirmDelete(): void {
    const id = this.pendingDeleteId();
    if (!id) {
      return;
    }

    const task = this.store.getById(id);
    const deleted = this.store.delete(id);
    this.closeDeleteDialog();

    if (deleted && task) {
      appToast({
        type: 'success',
        title: 'Task deleted',
        description: `"${task.title}" was removed.`,
      });
    }
  }
}
