import type { DateRange } from '../../core/constanta/date-range-preset';
import sample from './invoices.sample.json';

export type InvoiceStatus = 'unpaid' | 'past_due' | 'draft' | 'paid';

export interface InvoiceRow {
  id: string;
  amount: number;
  currency: string;
  email: string;
  subject: string;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

const STATUSES: InvoiceStatus[] = ['unpaid', 'past_due', 'draft', 'paid'];

export function invoiceRows(today = new Date()): InvoiceRow[] {
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
  rows: InvoiceRow[],
  range: DateRange | null,
  status: string | null,
): InvoiceRow[] {
  return rows.filter((row) => {
    const inRange =
      !range ||
      (dayTime(row.createdAt) >= dayTime(range.start) && dayTime(row.createdAt) <= dayTime(range.end));
    const statusMatches = !status || status === 'all' || row.status === status;
    return inRange && statusMatches;
  });
}

function daysAgo(days: number, today: Date): Date {
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);
}

function dayTime(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function isStatus(value: string): value is InvoiceStatus {
  return STATUSES.some((status) => status === value);
}
