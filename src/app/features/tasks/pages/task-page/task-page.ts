import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { appToast } from '../../../../core/components/app-toast';
import { AppPageHeader } from '../../../../layout/app-page-header/app-page-header';
import { AppPageHeaderActions } from '../../../../layout/app-page-header/ui/app-page-header-actions/app-page-header-actions';
import { AppPageHeaderNaration } from '../../../../layout/app-page-header/ui/app-page-header-naration/app-page-header-naration';
import { TaskStore } from '../../data/task.store';
import { TaskDeleteDialog } from '../../ui/task-delete-dialog/task-delete-dialog';
import { TaskFormSheet } from '../../ui/task-form-sheet/task-form-sheet';
import { TaskTable } from '../../ui/task-table/task-table';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskStore, provideIcons({ lucidePlus })],
  imports: [
    AppPageHeader,
    AppPageHeaderActions,
    AppPageHeaderNaration,
    HlmButtonImports,
    NgIcon,
    TaskTable,
    TaskFormSheet,
    TaskDeleteDialog,
  ],
  templateUrl: './task-page.html',
})
export class TaskPage {
  private readonly store = inject(TaskStore);

  protected readonly tasks = this.store.tasks;
  protected readonly total = this.store.total;
  protected readonly completedCount = this.store.completedCount;

  protected readonly pageDescription = computed(
    () =>
      `Sample CRUD with in-memory data — no API or database. ${this.completedCount()}/${this.total()} completed.`,
  );

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
