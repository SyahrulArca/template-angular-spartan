import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  FlexRender,
  type PaginationState,
  TanStackTable,
  TanStackTableCell,
  injectTable,
  isFunction,
} from '@tanstack/angular-table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { EmptyData } from '../../../../core/components/empty-data/empty-data';
import { TASK_PAGE_SIZES, TaskStore } from '../../data/task.store';
import type { Task } from '../../models/task.model';
import { taskDataTableColumns } from './task-data-table.columns';
import { taskTableFeatures } from './task-data-table.features';
import { TaskTableRowActions, TASK_TABLE_ROW_ACTIONS } from './task-table-row-actions.token';

@Component({
  selector: 'app-task-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FlexRender,
    TanStackTable,
    TanStackTableCell,
    EmptyData,
    HlmButtonImports,
    HlmTableImports,
    HlmPaginationImports,
  ],
  providers: [{ provide: TASK_TABLE_ROW_ACTIONS, useExisting: TaskTable }],
  templateUrl: './task-table.html',
})
export class TaskTable implements TaskTableRowActions {
  protected readonly store = inject(TaskStore);

  /** Total tasks in the store (ignores filter). */
  readonly totalTaskCount = input.required<number>();
  /** Count after toolbar filters (date range, status, search). */
  readonly filteredCount = input.required<number>();

  readonly editTask = output<string>();
  readonly deleteTask = output<string>();
  /** Toolbar / empty-state: clear date, status, search. */
  readonly resetFilters = output<void>();
  readonly addTask = output<void>();

  protected readonly pageSizes = TASK_PAGE_SIZES;

  protected readonly table = injectTable(() => ({
    features: taskTableFeatures,
    columns: taskDataTableColumns,
    data: this.store.paged() as Task[],
    manualPagination: true,
    rowCount: this.store.filtered().length,
    autoResetPageIndex: false,
    state: {
      pagination: {
        pageIndex: this.store.page() - 1,
        pageSize: this.store.pageSize(),
      } satisfies PaginationState,
    },
    onPaginationChange: (updater) => {
      const prev: PaginationState = {
        pageIndex: this.store.page() - 1,
        pageSize: this.store.pageSize(),
      };
      const next = isFunction(updater) ? updater(prev) : updater;
      this.store.setPage(next.pageIndex + 1);
      this.store.setPageSize(next.pageSize);
    },
  }));

  protected readonly colspan = computed(() => this.table.getAllColumns().length);

  edit(id: string): void {
    this.editTask.emit(id);
  }

  remove(id: string): void {
    this.deleteTask.emit(id);
  }
}
