import { Injectable, computed, signal } from '@angular/core';
import type { Task, TaskFormValue, TaskStatus } from '../models/task.model';

const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review Spartan UI docs',
    description: 'Browse components and composition rules before building features.',
    status: 'done',
    createdAt: new Date('2026-07-10T09:00:00'),
    updatedAt: new Date('2026-07-12T14:30:00'),
  },
  {
    id: 'task-2',
    title: 'Wire sidebar navigation',
    description: 'Add routes and menu items for new feature pages.',
    status: 'in_progress',
    createdAt: new Date('2026-07-11T10:15:00'),
    updatedAt: new Date('2026-07-13T11:00:00'),
  },
  {
    id: 'task-3',
    title: 'Draft release notes',
    description: 'Summarize template changes for the first public release.',
    status: 'todo',
    createdAt: new Date('2026-07-14T08:00:00'),
    updatedAt: new Date('2026-07-14T08:00:00'),
  },
];

@Injectable()
export class TaskStore {
  private readonly _tasks = signal<Task[]>(structuredCloneTasks(SEED_TASKS));

  readonly tasks = this._tasks.asReadonly();
  readonly total = computed(() => this._tasks().length);
  readonly completedCount = computed(
    () => this._tasks().filter((task) => task.status === 'done').length,
  );

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

  countByStatus(status: TaskStatus): number {
    return this._tasks().filter((task) => task.status === status).length;
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
