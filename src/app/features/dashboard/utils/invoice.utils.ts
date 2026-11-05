import type { DateRange } from '../../../core/constanta/date-range-preset';
import sample from '../data/invoices.sample.json';
import { INVOICE_STATUS_OPTIONS, type Invoice, type InvoiceStatus } from '../models/invoice.model';

export function invoiceRows(today = new Date()): Invoice[] {
  return sample.map((row) => ({
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    email: row.email,
    subject: row.subject,
    status: isStatus(row.status) ? row.status : 'draft',
    createdAt: daysAgo(row.createdDaysAgo, today),
    updatedAt: row.updatedDaysAgo == null ? null : daysAgo(row.updatedDaysAgo, today),
  }));
}

export function filterInvoices(
  rows: Invoice[],
  range: DateRange | null,
  status: string | null,
  query = '',
): Invoice[] {
  const needle = query.trim().toLowerCase();
  return rows.filter((row) => {
    const inRange =
      !range ||
      (dayTime(row.createdAt) >= dayTime(range.start) &&
        dayTime(row.createdAt) <= dayTime(range.end));
    const statusMatches = !status || status === 'all' || row.status === status;
    const queryMatches =
      !needle ||
      [row.id, row.email, row.subject].some((text) => text.toLowerCase().includes(needle));
    return inRange && statusMatches && queryMatches;
  });
}

function daysAgo(days: number, today: Date): Date {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);
}

function dayTime(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function isStatus(value: string): value is InvoiceStatus {
  return INVOICE_STATUS_OPTIONS.some((option) => option.value === value);
}
