import { TaskStore } from './task.store';

describe('TaskStore', () => {
  it('resets to page 1 when the filter changes', () => {
    const store = new TaskStore();
    store.setPageSize(1);
    store.setPage(2);
    expect(store.page()).toBe(2);

    store.setStatus('done');
    expect(store.page()).toBe(1);
    expect(store.paged().every((t) => t.status === 'done')).toBe(true);
  });

  it('counts statuses without applying the selected status filter', () => {
    const store = new TaskStore();
    store.setStatus('todo');

    const all = store.statusOptions().find((option) => option.value === 'all');
    expect(all?.count).toBe(store.tasks().length);
  });
});
