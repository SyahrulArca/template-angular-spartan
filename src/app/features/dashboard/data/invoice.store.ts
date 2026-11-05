import { Injectable, computed, linkedSignal, signal } from '@angular/core';
import type { DatatableStatusOption } from '../../../core/components/datatable-filter/status-filter/status-filter';
import {
  DEFAULT_DATE_RANGE_PRESET,
  type DateRange,
  rangeFromPreset,
} from '../../../core/constanta/date-range-preset';
import { INVOICE_STATUS_OPTIONS } from '../models/invoice.model';
import { filterInvoices, invoiceRows } from '../utils/invoice.utils';

export const INVOICE_PAGE_SIZES = [5, 10, 20];

@Injectable()
export class InvoiceStore {
  private readonly _invoices = signal(invoiceRows());
  private readonly _range = signal<DateRange | null>(rangeFromPreset(DEFAULT_DATE_RANGE_PRESET));
  private readonly _status = signal<string | null>('all');
  private readonly _search = signal('');
  private readonly _pageSize = signal(INVOICE_PAGE_SIZES[0]);

  readonly range = this._range.asReadonly();
  readonly status = this._status.asReadonly();
  readonly search = this._search.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();

  readonly filtered = computed(() =>
    filterInvoices(this._invoices(), this._range(), this._status(), this._search()),
  );

  // Back to page 1 whenever the filtered rows change.
  private readonly _page = linkedSignal({ source: this.filtered, computation: () => 1 });
  readonly page = this._page.asReadonly();

  readonly paged = computed(() => {
    const start = (this._page() - 1) * this._pageSize();
    return this.filtered().slice(start, start + this._pageSize());
  });

  /** Counts ignore the selected status so every bucket stays visible. */
  readonly statusOptions = computed<DatatableStatusOption[]>(() => {
    const rows = filterInvoices(this._invoices(), this._range(), null, this._search());
    return [
      { value: 'all', label: 'All', count: rows.length },
      ...INVOICE_STATUS_OPTIONS.map((option) => ({
        ...option,
        count: rows.filter((row) => row.status === option.value).length,
      })),
    ];
  });

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
