import { rangeFromPreset } from '../../core/constanta/date-range-preset';
import { filterInvoices, invoiceRows, type InvoiceRow } from './invoices.sample';

describe('invoice sample filter', () => {
  const today = new Date(2026, 10, 5);

  it('keeps rows inside the preset and the selected status', () => {
    const rows = invoiceRows(today);
    const week = filterInvoices(rows, rangeFromPreset('7d', today), 'all');
    const paidThisWeek = filterInvoices(rows, rangeFromPreset('7d', today), 'paid');

    expect(week.map((row) => row.id)).toEqual([
      'INV0938-09-001',
      'INV6789-09-002',
      'INV2983-09-003',
      'INV2344-09-004',
    ]);
    expect(paidThisWeek.map((row) => row.id)).toEqual(['INV2344-09-004']);
  });

  it('drops a row dated before the three-month window', () => {
    const rows = invoiceRows(today);
    const ids = filterInvoices(rows, rangeFromPreset('3m', today), 'all').map((row) => row.id);

    expect(ids).toContain('INV2134-09-010');
    expect(ids).not.toContain('INV8801-06-011');
  });

  it('returns every row when the range is cleared', () => {
    const rows: InvoiceRow[] = invoiceRows(today);
    expect(filterInvoices(rows, null, null)).toHaveLength(rows.length);
  });
});
