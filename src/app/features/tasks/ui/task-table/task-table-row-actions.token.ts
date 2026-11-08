import { InjectionToken } from '@angular/core';

/** Lets action cells call the host table without prop-drilling (TanStack flex-render pattern). */
export abstract class TaskTableRowActions {
  abstract edit(id: string): void;
  abstract remove(id: string): void;
}

export const TASK_TABLE_ROW_ACTIONS = new InjectionToken<TaskTableRowActions>('TASK_TABLE_ROW_ACTIONS');
