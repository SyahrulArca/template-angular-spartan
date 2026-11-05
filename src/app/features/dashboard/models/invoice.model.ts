export type InvoiceStatus = 'unpaid' | 'past_due' | 'draft' | 'paid';

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  email: string;
  subject: string;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface InvoiceFormValue {
  email: string;
  subject: string;
}

export interface InvoiceLineFormValue {
  description: string;
  qty: number;
  price: number;
}

export interface InvoiceWithLinesFormValue extends InvoiceFormValue {
  lines: InvoiceLineFormValue[];
}

export const INVOICE_STATUS_OPTIONS: ReadonlyArray<{ value: InvoiceStatus; label: string }> = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'draft', label: 'Draft' },
  { value: 'past_due', label: 'Past due' },
  { value: 'paid', label: 'Paid' },
];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  unpaid: 'Unpaid',
  draft: 'Draft',
  past_due: 'Past due',
  paid: 'Paid',
};

export const INVOICE_STATUS_VARIANTS: Record<
  InvoiceStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  unpaid: 'outline',
  draft: 'secondary',
  past_due: 'destructive',
  paid: 'default',
};
