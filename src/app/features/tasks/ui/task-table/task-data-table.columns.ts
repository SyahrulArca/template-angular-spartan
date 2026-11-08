import { createColumnHelper, flexRenderComponent } from '@tanstack/angular-table';
import { DateUtil } from '../../../../core/utils/date.util';
import type { Task } from '../../models/task.model';
import type { TaskTableFeatures } from './task-data-table.features';
import { TaskTableActionsCell } from './task-table-actions-cell';
import { TaskTableStatusCell } from './task-table-status-cell';

const columnHelper = createColumnHelper<TaskTableFeatures, Task>();

export const taskDataTableColumns = columnHelper.columns([
  columnHelper.accessor('title', {
    id: 'title',
    header: 'Title',
    cell: (info) => {
      const task = info.row.original;
      const desc = task.description
        ? `<span class="text-muted-foreground line-clamp-2 text-xs">${escapeHtml(task.description)}</span>`
        : '';
      return `<div class="flex flex-col gap-1"><span class="font-medium">${escapeHtml(task.title)}</span>${desc}</div>`;
    },
  }),
  columnHelper.accessor('createdAt', {
    id: 'created',
    header: 'Tanggal',
    cell: (info) =>
      `<span class="text-muted-foreground whitespace-nowrap">${escapeHtml(
        DateUtil.formatDate(info.getValue(), 'id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      )}</span>`,
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    header: 'Status',
    cell: () => flexRenderComponent(TaskTableStatusCell),
  }),
  columnHelper.accessor('updatedAt', {
    id: 'updated',
    header: '<span class="hidden md:inline">Updated</span>',
    cell: (info) =>
      `<span class="text-muted-foreground hidden md:inline">${DateUtil.timeAgo(info.getValue())}</span>`,
  }),
  columnHelper.display({
    id: 'actions',
    header: '<div class="text-end">Actions</div>',
    cell: () => flexRenderComponent(TaskTableActionsCell),
  }),
]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
