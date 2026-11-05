import { rangeFromPreset } from '../../../core/constanta/date-range-preset';
import { InvoiceStore } from './invoice.store';

describe('InvoiceStore', () => {
  it('pages the filtered rows and returns to page 1 when a filter changes', () => {
    const store = new InvoiceStore();
    store.setRange(rangeFromPreset('3m'));

    expect(store.filtered()).toHaveLength(10);
    expect(store.paged()).toHaveLength(5);

    store.setPage(2);
    expect(store.paged().map((row) => row.id)).toEqual(
      store
        .filtered()
        .slice(5, 10)
        .map((row) => row.id),
    );

    store.setStatus('past_due');
    expect(store.page()).toBe(1);
    expect(store.paged().every((row) => row.status === 'past_due')).toBe(true);
  });

  it('counts statuses without applying the selected status', () => {
    const store = new InvoiceStore();
    store.setRange(rangeFromPreset('3m'));
    store.setStatus('paid');

    const all = store.statusOptions().find((option) => option.value === 'all');
    expect(all?.count).toBe(10);
  });
});
