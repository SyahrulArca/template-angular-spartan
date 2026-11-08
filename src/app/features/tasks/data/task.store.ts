import { Injectable, computed, linkedSignal, signal } from '@angular/core';
import type { DatatableStatusOption } from '../../../core/components/datatable-filter/status-filter/status-filter';
import type { DateRange } from '../../../core/constanta/date-range-preset';
import type { Task, TaskFormValue } from '../models/task.model';
import { TASK_STATUS_OPTIONS } from '../models/task.model';
import { filterTasks } from '../utils/task.utils';
import seedTasksJson from './seed-tasks.json';

export const TASK_PAGE_SIZES = [5, 10, 20];

@Injectable()
export class TaskStore {
  /** seed-tasks.json stores ISO date strings; structuredCloneTasks maps them to Date. */
  private readonly _tasks = signal<Task[]>(
    structuredCloneTasks(seedTasksJson as unknown as Task[]),
  );
  /** null = no date filter so seed JSON (any year) is visible; use toolbar to narrow. */
  private readonly _range = signal<DateRange | null>(null);
  private readonly _status = signal<string | null>('all');
  private readonly _search = signal('');
  private readonly _pageSize = signal(TASK_PAGE_SIZES[0]);

  readonly tasks = this._tasks.asReadonly();
  readonly range = this._range.asReadonly();
  readonly status = this._status.asReadonly();
  readonly search = this._search.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();

  readonly total = computed(() => this._tasks().length);
  readonly completedCount = computed(
    () => this._tasks().filter((task) => task.status === 'done').length,
  );

  readonly filtered = computed(() =>
    filterTasks(this._tasks(), this._range(), this._status(), this._search()),
  );

  private readonly _page = linkedSignal({ source: this.filtered, computation: () => 1 });
  readonly page = this._page.asReadonly();

  readonly paged = computed(() => {
    const start = (this._page() - 1) * this._pageSize();
    return this.filtered().slice(start, start + this._pageSize());
  });

  /** Counts ignore the selected status so every bucket stays visible. */
  readonly statusOptions = computed<DatatableStatusOption[]>(() => {
    const rows = filterTasks(this._tasks(), this._range(), null, this._search());
    return [
      { value: 'all', label: 'All', count: rows.length },
      ...TASK_STATUS_OPTIONS.map((option) => ({
        ...option,
        count: rows.filter((row) => row.status === option.value).length,
      })),
    ];
  });

  getById(id: string): Task | undefined {
    return this._tasks().find((task) => task.id === id);
  }

  create(value: TaskFormValue): Task {
    const now = new Date();
    const task: Task = {
      id: createTaskId(),
      title: value.title.trim(),
      description: value.description.trim(),
      status: value.status,
      createdAt: now,
      updatedAt: now,
    };

    this._tasks.update((tasks) => [task, ...tasks]);
    return task;
  }

  update(id: string, value: TaskFormValue): Task | undefined {
    let updated: Task | undefined;

    this._tasks.update((tasks) =>
      tasks.map((task) => {
        if (task.id !== id) {
          return task;
        }

        updated = {
          ...task,
          title: value.title.trim(),
          description: value.description.trim(),
          status: value.status,
          updatedAt: new Date(),
        };
        return updated;
      }),
    );

    return updated;
  }

  delete(id: string): boolean {
    const exists = this._tasks().some((task) => task.id === id);
    if (!exists) {
      return false;
    }

    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
    return true;
  }

  setRange(range: DateRange | null): void {
    this._range.set(range);
  }

  setStatus(status: string | null): void {
    this._status.set(status);
  }

  setSearch(search: string): void {
    this._search.set(search);
  }

  setPage(page: number): void {
    this._page.set(page);
  }

  setPageSize(size: number): void {
    this._pageSize.set(size);
  }
}

function createTaskId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}`;
}

function structuredCloneTasks(tasks: Task[]): Task[] {
  return tasks.map((task) => ({
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  }));
}
