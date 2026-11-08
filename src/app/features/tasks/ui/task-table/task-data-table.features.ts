import { createPaginatedRowModel, rowPaginationFeature, tableFeatures } from '@tanstack/angular-table';

/** Minimal feature set: manual pagination over pre-sliced rows (see spartan data-table guide). */
export const taskTableFeatures = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

export type TaskTableFeatures = typeof taskTableFeatures;
